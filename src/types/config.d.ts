import type { BaseEvent } from ".";

export type Actions = "create" | "update" | "remove";
export type AnyEvent = CreateEvent | UpdateEvent | RemoveEvent;
export interface CreateEvent extends BaseEvent<"config", "create"> {}
export interface UpdateEvent extends BaseEvent<"config", "update"> {}
export interface RemoveEvent extends BaseEvent<"config", "remove"> {}
