import type { BaseEvent } from ".";

export type Actions = "create" | "update" | "remove";
export type AnyEvent = CreateEvent | UpdateEvent | RemoveEvent;
export interface CreateEvent extends BaseEvent<"service", "create"> {}
export interface UpdateEvent extends BaseEvent<"service", "update"> {}
export interface RemoveEvent extends BaseEvent<"service", "remove"> {}
