import type { BaseEvent } from ".";

export type Actions = "reload";
export type AnyEvent = ReloadEvent;
export interface ReloadEvent extends BaseEvent<"daemon", "reload"> {}
