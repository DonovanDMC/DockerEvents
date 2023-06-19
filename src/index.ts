import TypedEmitter from "./TypedEmitter.js";
import { connect } from "./docker.js";
import type { Events } from "./types/index.js";
import { accessSync } from "node:fs";
import type { ClientRequest } from "node:http";
import { constants } from "node:fs/promises";
export type * from "./types/index.js";

export interface Options {
    http?: string;
    socketPath?: string;
}
export default class DockerEvents extends TypedEmitter<Events> {
    connect: string | URL;
    #firstConnect = false;
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
            try {
                // sync because I cannot be fucked to create an init method, and despite javascript existing for decades, async constructors still don't exist
                accessSync(this.connect, constants.W_OK | constants.R_OK);
            } catch (err) {
                throw new TypeError(`Provided socket path "${this.connect}" either does not exist, or is not readable/writable.`, { cause: err });
            }
        }

        this.request = connect(this.connect, (err, data) => {
            if (err === null) {
                if (data === null) {
                    if (this.#firstConnect === false) {
                        throw new Error(`Failed to connect to "${this.connect instanceof URL ? this.connect.href : this.connect}".`);
                    }
                    this.emit("warn", "Connection closed -- reconnecting");
                } else {
                    // we can technically claim we never connected if we don't get any events before we're disconnected
                    this.#firstConnect = true;
                    this.emit(`${data.Type}.${data.Action}` as "any", data as never);
                }
            } else {
                this.emit("error", err);
            }
        });
    }

    close() {
        this.request.destroy();
    }
}
