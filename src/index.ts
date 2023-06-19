import TypedEmitter from "./TypedEmitter.js";
import connect from "./docker.js";
import type { Events } from "./types/index.js";
import type { ClientRequest } from "node:http";
export type * from "./types/index.js";

export interface Options {
    http?: string;
    socketPath?: string;
}
export default class DockerEvents extends TypedEmitter<Events> {
    connect: string | URL;
    request: ClientRequest;
    constructor(options?: Options) {
        super();
        if (options?.http) {
            try {
                this.connect = new URL(options.http);
            } catch (err) {
                throw new TypeError(`Invalid URL: ${options.http}`, { cause: err });
            }
        } else {
            this.connect = options?.socketPath ?? "/var/run/docker.sock";
        }

        this.request = connect(this.connect, (err, data) => {
            if (err === null) {
                if (data === null) {
                    this.emit("warn", "Connection closed -- reconnecting");
                } else {
                    this.emit(`${data.Type}.${data.Action}` as "any", data as never);
                }
            } else {
                this.emit("error", err);
            }
        });
    }
}
