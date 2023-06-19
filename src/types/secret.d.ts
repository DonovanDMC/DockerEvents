import type { BaseEvent } from ".";

export type Actions = "create" | "update" | "remove";
export type AnyEvent = CreateEvent | UpdateEvent | RemoveEvent;
export interface CreateEvent extends BaseEvent<"secret", "create"> {}
export interface UpdateEvent extends BaseEvent<"secret", "update"> {}
export interface RemoveEvent extends BaseEvent<"secret", "remove"> {}
