import DockerEvents from "../dist/index.js";
import { get } from "../dist/docker.js";
import {
    access,
    constants,
    copyFile,
    readFile,
    writeFile
} from "node:fs/promises";

const hostsFile = process.env.HOSTS_FILE ?? "/data/hosts";

try {
    await access(hostsFile, constants.R_OK | constants.W_OK);
} catch (err) {
    throw new Error(`Hosts file "${hostsFile}" is either missing, or not readable/writable.`, { cause: err });
}

class Queue {
    /** @type {Function[]} */
    static queue = [];
    static running = false;

    /** @param {Function} fn */
    static add(fn, priority = false) {
        if (priority === true) {
            this.queue.unshift(fn);
        } else {
            this.queue.push(fn);
        }

        if (this.running === false) {
            this.running = true;
            void this.next();
        }
    }

    static flush() {
        this.queue = [];
        this.running = false;
    }

    static async next() {
        const fn = this.queue.shift();
        if (fn === undefined) {
            this.running = false;
            return;
        }
        try {
            await fn();
        } catch (err) {
            if (cleanup === false) {
                log("error", "Queue Error:", err);
            }
        }

        void this.next();
    }
}

let cleanup = false;
const events = new DockerEvents({ socketPath: "/var/run/docker.sock" });
process
    .on("SIGINT", clean)
    .on("SIGTERM", clean);
function clean() {
    cleanup = true;
    Queue.flush();
    events.close();
    process.kill(process.pid, "SIGKILL");
}

log("log", "Launched");
await refresh();

events
    .on("container.start", async data => {
        if (data.Actor.Attributes.hostname !== undefined) {
            Queue.add((async() => {
                log("group", "Got start for %s", data.Actor.Attributes.hostname);
                await refresh(data.Actor.ID);
                console.groupEnd();
            }));
        }
    })
    .on("container.stop", async data => {
        if (data.Actor.Attributes.hostname !== undefined) {
            Queue.add((async() => {
                log("group", "Got stop for %s", data.Actor.Attributes.hostname);
                await refresh(data.Actor.ID);
                console.groupEnd();
            }));
        }
    })
    .on("container.die", async data => {
        if (data.Actor.Attributes.hostname !== undefined) {
            Queue.add((async() => {
                log("group", "Got die for %s", data.Actor.Attributes.hostname);
                await refresh(data.Actor.ID);
                console.groupEnd();
            }));
        }
    })
    .on("error", err => {
        log("error", "Events Error:", err);
    });

/**
 *
 * @param {("log" | "warn" | "debug" | "error" | "group")} type
 * @param {string} formatter
 * @param  {...unknown} args
 */
function log(type, formatter, ...args) {
    console[type](`\u001B[90m%s \u001B[0m${formatter}`, new Date().toISOString(), ...args);
}

/** @param {string} [from] */
async function refresh(from) {
    const content = (await readFile(hostsFile, { encoding: "utf8" })).split("\n");
    const startIndex = content.findIndex(d => d.startsWith("# begin docker-hosts"));
    const endIndex = content.findIndex(d => d.startsWith("# end docker-hosts"));
    if (startIndex === -1) {
        log("debug", "[Refresh] No start index found, assuming first run");
        if (endIndex !== -1) {
            log("warn", "[Refresh] Found end index, but no start index. The end index will be removed, and a new section will be created at the end of the file.");
            content.splice(endIndex, 1);
        }
    } else {
        if (endIndex === -1) {
            log("warn", "[Refresh] Found start index, but no end index. The start index will be removed, and a new section will be created at the end of the file.");
            content.splice(startIndex, 1);
        } else {
            // console.debug("Found start and end index, removing all lines between them.");
            content.splice(startIndex, endIndex);
        }
    }


    const containers = await getHosts();
    /** @type {import("./types").HostDuplicate[]} */
    const duplicateHosts = [];
    /** @type {string[]} */
    const seen = [],
        /** @type {string[]} */
        duplicate = [];
    for (const container of containers) {
        if (duplicate.includes(container.host)) {
            continue;
        }

        if (seen.includes(container.host)) {
            duplicate.push(container.host);
        } else {
            seen.push(container.host);
        }
    }

    for (const host of duplicate) {
        duplicateHosts.push({ host, containers: containers.filter(c => c.host === host) });
    }

    for (const d of duplicateHosts) {
        /** @type {import("./types").ContainerInfo | undefined} */
        let container;

        let shouldLog = true;
        if (from === undefined || d.containers.some(c => c.container === from)) {
            console.group(`[Refresh] Duplicate host ${d.host} found on ${d.containers.length} containers`);

            const hasNumbers = d.containers.every(c => /-\d+$/.test(c.name));
            if (hasNumbers) {
                log("debug", "Containers seem to be numbered, using highest container.");
                const highest = d.containers.reduce((prev, curr) => {
                    const num = Number(curr.name.split("-").at(-1));
                    return isNaN(num) ?  prev : Math.max(prev, num);
                }, -1);
                container = d.containers.find(c => c.name.endsWith(`-${highest}`));
                if (container === undefined) {
                    log("error", "Failed to find highest numbered container, using first container.");
                    container = d.containers[0];
                }
            } else {
                log("warn", "Containers do not seem to be numbered, using first container.");
                container = d.containers[0];
            }

            if (container === undefined) {
                log("error", "Failed to pick container to assign host.");
            }
        } else {
            // not our concern currently, defer to what we already have in the hosts file.
            container = d.containers.find(c => content.some(l => l.includes(c.container)));
            if (container === undefined) {
                container = d.containers[0];
            }
            shouldLog = false;
        }
        for (const c of d.containers) {
            if (c === container) {
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore it is defined
            const index = containers.findIndex(ct => ct.container === c.container);
            if (index !== -1) {
                containers.splice(index, 1);

                if (shouldLog) {
                    log("debug", "Removed container %s (%s).", c.container, c.name);
                }
            }
        }
        console.groupEnd();
    }

    let maxIPLen = 0, maxHostLen = 0, maxNameLen = 0, maxContainerLen = 0;
    for (const { container, host, ip, name } of containers) {
        maxIPLen = Math.max(maxIPLen, ip.length);
        maxHostLen = Math.max(maxHostLen, host.length);
        maxNameLen = Math.max(maxNameLen, name.length);
        maxContainerLen = Math.max(maxContainerLen, container.length);
    }

    const newContent = ["# begin docker-hosts", ...containers.map(d => `${d.ip.padEnd(maxIPLen, " ")} ${d.host.padEnd(maxHostLen, " ")} # ${d.name.padEnd(maxNameLen, " ")} (${d.container.padEnd(maxContainerLen, " ")})`), "# end docker-hosts"];
    content.push(...newContent);
    await copyFile(hostsFile, `${hostsFile}.bak`);
    await writeFile(hostsFile, content.join("\n"), { encoding: "utf8" });
}

async function getHosts() {
    /** @type {import("./types").Container[]} */
    const containers = await get(events.connect, "/containers/json");
    return containers.filter(c => c.Labels.hostname !== undefined).map(c => ({ container: c.Id, host: c.Labels.hostname, ip: c.NetworkSettings.Networks[c.HostConfig.NetworkMode === "default" ? "bridge" : c.HostConfig.NetworkMode].IPAddress, name: c.Names[0].slice(1) }));
}
