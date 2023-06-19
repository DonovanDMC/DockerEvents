import type {
    BaseAttributes,
    BaseEvent,
    BasePruneEvent,
    EventTypes,
    TypeActionMap
} from ".";

export type Actions = "create" | "connect" | "disconnect" | "destroy" | "update" | "remove" | "prune";
export type AnyEvent = CreateEvent | ConnectEvent | DisconnectEvent | DestroyEvent | UpdateEvent | RemoveEvent | PruneEvent;

interface BaseEventWithType<T extends EventTypes, A extends TypeActionMap[T]> extends BaseEvent<T, A> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            type: string;
        };
        ID: string;
    };
}

export interface CreateEvent extends BaseEventWithType<"network", "create"> {}
export interface ConnectEvent extends BaseEventWithType<"network", "connect"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            container: string;
            type: string;
        };
        ID: string;
    };
}
export interface DisconnectEvent extends BaseEventWithType<"network", "disconnect"> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            container: string;
            type: string;
        };
        ID: string;
    };
}
export interface DestroyEvent extends BaseEventWithType<"network", "destroy"> {}
export interface UpdateEvent extends BaseEventWithType<"network", "update"> {}
export interface RemoveEvent extends BaseEventWithType<"network", "remove"> {}
export interface PruneEvent extends BasePruneEvent<"network", "prune"> {}
