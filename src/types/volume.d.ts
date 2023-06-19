import type { BaseEvent, BasePruneEvent } from ".";

export type Actions = "create" | "mount" | "unmount" | "destroy" | "prune";
export type AnyEvent = CreateEvent | MountEvent | UnmountEvent | DestroyEvent | PruneEvent;
export interface CreateEvent extends BaseEvent<"volume", "create"> {}
export interface MountEvent extends BaseEvent<"volume", "mount"> {}
export interface UnmountEvent extends BaseEvent<"volume", "unmount"> {}
export interface DestroyEvent extends BaseEvent<"volume", "destroy"> {}
export interface PruneEvent extends BasePruneEvent<"volume", "prune"> {}
