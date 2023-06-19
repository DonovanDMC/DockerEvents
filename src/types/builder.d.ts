import type { BasePruneEvent } from ".";

export type Actions = "prune";
export type AnyEvent = PruneEvent;
export interface PruneEvent extends BasePruneEvent<"builder", "prune"> {}
