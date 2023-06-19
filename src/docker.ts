import type { ActionTypes, AnyEventParams } from "./types/index.js";
import type { Debugger } from "debug";
import * as http from "node:http";
import * as https from "node:https";

let debug: Debugger | undefined;
try {
    debug = (await import("debug")).default("docker-events");
} catch {}

export default function connect(info: string | URL, cb: (...args: [err: Error, data: null] | [err: null, data: AnyEventParams[0] | null]) => void) {
    let request: typeof http.request | typeof https.request = http.request;
    const options: http.RequestOptions = {
        path:    "/events",
        headers: {
            Accept: "application/json"
        },
        method: "GET"
    };
    if (typeof info === "string") {
        options.socketPath = info;
    } else {
        options.host = info.host;
        options.port = info.port;
        if (info.protocol === "https:") {
            request = https.request;
        }
    }
    const req = request(options, res => {
        if (!res.headers["content-type"]?.startsWith("application/json")) {
            req.end(() => {
                cb(new Error(`Invalid content-type: ${res.headers["content-type"] ?? ""}`), null);
            });
            return;
        }
        res
            .on("error", err => cb(err, null))
            .on("data", (data: Buffer) => {
                const d = JSON.parse(data.toString()) as AnyEventParams[0];
                if (d.Action.includes(":")) {
                    const a = d.Action;
                    d.Action = d.Action.split(":")[0] as ActionTypes;
                    if (["exec_create", "exec_start"].includes(d.Action)) {
                        (d as unknown as Record<string, string>).ExecCommand = a.split(":")[1];
                    } if (d.Action === "health_status") {
                        (d as unknown as Record<string, string>).HealthStatus = a.split(":")[1];
                    } else {
                        debug?.(`Action contains colon: ${a} (corrected to: ${d.Action as string})`);
                    }
                }
                cb(null, d);
            })
            .on("end", () => {
                cb(null, null);
                connect(info, cb);
            });
    });
    req.end();
    return req;
}
