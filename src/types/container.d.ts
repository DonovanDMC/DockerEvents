import type { BaseAttributes, BaseEventWithImage, BasePruneEvent } from ".";

export type Actions = "archive-path" | "attach" | "commit" | "copy" | "create" | "destroy" | "detach" | "die" | "exec_create" | "exec_detach" | "exec_die" | "exec_start" | "export" | "health_status" | "kill" | "oom" | "pause" | "prune" | "rename" | "resize" | "restart" | "start" | "stop" | "top" | "unpause" | "update";
export type AnyEvent = ArchivePathEvent | AttachEvent | CommitEvent | CopyEvent | CreateEvent | DestroyEvent | DetachEvent | DieEvent | ExecCreateEvent | ExecDetachEvent | ExecDieEvent | ExecStartEvent | ExportEvent | HealthStatusEvent | KillEvent | OOMEvent | PauseEvent | PruneEvent | RenameEvent | ResizeEvent | RestartEvent | StartEvent | StopEvent | TopEvent | UnpauseEvent | UpdateEvent;
export interface ArchivePathEvent extends BaseEventWithImage<"container", "archive-path"> {}
export interface AttachEvent extends BaseEventWithImage<"container", "attach"> {}

export interface CommitEvent extends BaseEventWithImage<"container", "commit"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            comment: string;
            image: string;
            imageID: string;
            imageRef: string;
        };
        ID: string;
    };
}

export interface CopyEvent extends BaseEventWithImage<"container", "copy"> {}
export interface CreateEvent extends BaseEventWithImage<"container", "create"> {}
export interface DestroyEvent extends BaseEventWithImage<"container", "destroy"> {}
export interface DetachEvent extends BaseEventWithImage<"container", "detach"> {}
export interface DieEvent extends BaseEventWithImage<"container", "die"> {}

export interface ExecCreateEvent extends BaseEventWithImage<"container", "exec_create"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            execID: string;
            image: string;
        };
        ID: string;
    };
    ExecCommand: string;
}

export interface ExecDetachEvent extends BaseEventWithImage<"container", "exec_detach"> {}
export interface ExecDieEvent extends BaseEventWithImage<"container", "exec_die"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            execDuration: string;
            exitCode: string;
            image: string;
        };
        ID: string;
    };
}

export interface ExecStartEvent extends BaseEventWithImage<"container", "exec_start"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            execID: string;
            image: string;
        };
        ID: string;
    };
    ExecCommand: string;
}

export interface ExportEvent extends BaseEventWithImage<"container", "export"> {}
export interface HealthStatusEvent extends BaseEventWithImage<"container", "health_status"> {
    HealthStatus: "healthy" | "unhealthy";
}
export interface KillEvent extends BaseEventWithImage<"container", "kill"> {}
export interface OOMEvent extends BaseEventWithImage<"container", "oom"> {}
export interface PauseEvent extends BaseEventWithImage<"container", "pause"> {}
export interface PruneEvent extends BasePruneEvent<"container", "prune"> {}
export interface RenameEvent extends BaseEventWithImage<"container", "rename"> {}
export interface ResizeEvent extends BaseEventWithImage<"container", "resize"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            height: string;
            image: string;
            width: string;
        };
        ID: string;
    };}
export interface RestartEvent extends BaseEventWithImage<"container", "resize"> {}
export interface StartEvent extends BaseEventWithImage<"container", "start"> {}
export interface StopEvent extends BaseEventWithImage<"container", "stop"> {}
export interface TopEvent extends BaseEventWithImage<"container", "top"> {}
export interface UnpauseEvent extends BaseEventWithImage<"container", "unpause"> {}
export interface UpdateEvent extends BaseEventWithImage<"container", "update"> {}
