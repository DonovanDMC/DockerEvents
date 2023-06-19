import type { BaseAttributes, BaseEvent } from ".";

export type Actions = "create" | "update" | "remove";
export type AnyEvent = CreateEvent | UpdateEvent | RemoveEvent;
export type NodeAvailability = "active" | "pause" | "drain";
export type NodeReachability = "unknown" | "reachable" | "unreachable";
export type NodeRole = "worker" | "manager";
export type NodeStatus = "unknown" | "down" | "ready" | "disconnected";

export interface CreateEvent extends BaseEvent<"node", "create"> {}
export interface UpdateEvent extends BaseEvent<"node", "update"> {
    Actor: {
        Attributes: BaseAttributes & {
            [key: string]: string | undefined;
            "availability.new"?: NodeAvailability;
            "availability.old"?: NodeAvailability;
            "leader.new"?: "true" | "false";
            "leader.old"?: "true" | "false";
            "reachability.new"?: NodeReachability;
            "reachability.old"?: NodeReachability;
            "role.new"?: NodeRole;
            "role.old"?: NodeRole;
            "state.new"?: NodeStatus;
            "state.old"?: NodeStatus;
        };
        ID: string;
    };
}
export interface RemoveEvent extends BaseEvent<"node", "remove"> {}
