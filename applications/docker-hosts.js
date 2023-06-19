import { access, constants, copyFile, readFile, writeFile } from "fs/promises";
import DockerEvents from "../dist/index.js";
import { get } from "../dist/docker.js";

const hostsFile = process.env.HOSTS_FILE ?? "/data/hosts";

try {
    await access(hostsFile, constants.R_OK | constants.W_OK);
} catch(err) {
    throw new Error(`Hosts file "${hostsFile}" is either missing, or not readable/writable.`, { cause: err });
}

const events = new DockerEvents({ socketPath: "/var/run/docker.sock" });
process
.once("SIGINT", cleam.bind(null, "SIGINT"))
.once("SIGTERM", clean.bind(null, "SIGTERM"))
.once("SIGKILL", clean.bind(null, "SIGKILL"))
function clean(signal) {
     events.close();
    process.kill(process.pid, signal);
}

console.log("Launching - refreshing");
await refresh();

events.on("container.start", async(data) => {
    if(data.Actor.Attributes.hostname !== undefined) {
        console.log("Got start for %s - refreshing", data.Actor.Attributes.hostname);
        await refresh();
    }
});
events.on("container.stop", async(data) => {
    if(data.Actor.Attributes.hostname !== undefined) {
        console.log("Got stop for %s - refreshing", data.Actor.Attributes.hostname);
        await refresh();
    }
});
events.on("container.die", async(data) => {
    if(data.Actor.Attributes.hostname !== undefined) {
        console.log("Got die for %s - refreshing", data.Actor.Attributes.hostname);
        await refresh();
    }
});

async function refresh() {
    const content = (await readFile(hostsFile, { encoding: "utf-8" })).split("\n");
    const startIndex = content.findIndex(d => d.startsWith("# begin docker-hosts"));
    const endIndex = content.findIndex(d => d.startsWith("# end docker-hosts"));
    if(startIndex === -1) {
        console.debug("No start index found, assuming first run");
        if(endIndex !== -1) {
            console.warn("Found end index, but no start index. The end index will be removed, and a new section will be created at the end of the file.");
            content.splice(endIndex, 1);
        }
    } else {
        if(endIndex === -1) {
            console.warn("Found start index, but no end index. The start index will be removed, and a new section will be created at the end of the file.");
            content.splice(startIndex, 1);
        } else {
            // console.debug("Found start and end index, removing all lines between them.");
            content.splice(startIndex, endIndex);
        }
    }


    const hosts = await getHosts();
    let maxIPLen = 0, maxHostLen = 0, maxNameLen = 0, maxContainerLen = 0;
    for(const { container, host, ip, name } of hosts) {
        maxIPLen = Math.max(maxIPLen, ip.length);
        maxHostLen = Math.max(maxHostLen, host.length);
        maxNameLen = Math.max(maxNameLen, name.length);
        maxContainerLen = Math.max(maxContainerLen, container.length);
    }
    const newContent = ["# begin docker-hosts", ...hosts.map(d => `${d.ip.padEnd(maxIPLen, " ")} ${d.host.padEnd(maxHostLen, " ")} # ${d.name.padEnd(maxNameLen, " ")} (${d.container.padEnd(maxContainerLen, " ")})`), "# end docker-hosts"];
    content.push(...newContent);
    await copyFile(hostsFile, `${hostsFile}.bak`);
    await writeFile(hostsFile, content.join("\n"), { encoding: "utf-8" });
}

async function getHosts() {
    /** @type {import("./types").Container[]} */
    const containers = await get(events.connect, "/containers/json");
    return containers.filter(c => c.Labels.hostname !== undefined).map(c => ({ container: c.Id, host: c.Labels.hostname, ip: c.NetworkSettings.Networks[c.HostConfig.NetworkMode === "default" ? "bridge" : c.HostConfig.NetworkMode].IPAddress, name: c.Names[0].slice(1) }));
}
