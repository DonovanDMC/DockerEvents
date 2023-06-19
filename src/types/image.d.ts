import type { BaseEvent, BasePruneEvent } from ".";

export type Actions = "delete" | "import" | "load" | "pull" | "push" | "save" | "tag" | "untag" | "prune";
export type AnyEvent = DeleteEvent | ImportEvent | LoadEvent | PullEvent | PushEvent | SaveEvent | TagEvent | UntagEvent | PruneEvent;
export interface DeleteEvent extends BaseEvent<"image", "delete"> {}
export interface ImportEvent extends BaseEvent<"image", "import"> {}
export interface LoadEvent extends BaseEvent<"image", "load"> {}
export interface PullEvent extends BaseEvent<"image", "pull"> {}
export interface PushEvent extends BaseEvent<"image", "push"> {}
export interface SaveEvent extends BaseEvent<"image", "save"> {}
export interface TagEvent extends BaseEvent<"image", "tag"> {}
export interface UntagEvent extends BaseEvent<"image", "untag"> {}
export interface PruneEvent extends BasePruneEvent<"image", "prune"> {}
