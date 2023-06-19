import type * as Builder from "./builder";
import type * as Config from "./config";
import type * as Container from "./container";
import type * as Daemon from "./daemon";
import type * as Image from "./image";
import type * as Network from "./network";
import type * as Node from "./node";
import type * as Secret from "./secret";
import type * as Service from "./service";
import type * as Volume from "./volume";

// eslint-disable-next-line unicorn/prefer-export-from
export { Builder, Config, Container, Daemon, Image, Network, Node, Secret, Service, Volume };

export interface ComposeLabels {
    "com.docker.compose.config-hash"?: string;
    "com.docker.compose.container-number"?: string;
    "com.docker.compose.depends_on"?: string;
    "com.docker.compose.image"?:  string;
    "com.docker.compose.oneoff"?: "False" | "True";
    "com.docker.compose.project"?: string;
    "com.docker.compose.project.config_files"?: string;
    "com.docker.compose.project.working_dir"?: string;
    "com.docker.compose.service"?: string;
    "com.docker.compose.version"?: string;
}

export interface LabelSchemaLabels {
    "org.label-schema.build-date"?: string;
    "org.label-schema.docker.cmd"?: string;
    "org.label-schema.docker.cmd.debug"?: string;
    "org.label-schema.docker.cmd.devel"?: string;
    "org.label-schema.docker.cmd.help"?: string;
    "org.label-schema.docker.cmd.test"?: string;
    "org.label-schema.docker.params"?: string;
    "org.label-schema.docker.rkt.cmd.debug"?: string;
    "org.label-schema.docker.rkt.cmd.devel"?: string;
    "org.label-schema.docker.rkt.cmd.help"?: string;
    "org.label-schema.docker.rkt.cmd.test"?: string;
    "org.label-schema.docker.rkt.params"?: string;
    "org.label-schema.license"?: string;
    "org.label-schema.name"?: string;
    "org.label-schema.schema-version"?: string;
    "org.label-schema.url"?: string;
    "org.label-schema.usage"?: string;
    "org.label-schema.vcs-ref"?: string;
    "org.label-schema.vcs-url"?: string;
    "org.label-schema.vendor"?: string;
    "org.label-schema.version"?: string;
}

export interface OpenContainerLabels {
    "org.opencontainers.image.authors"?: string;
    "org.opencontainers.image.base.digest"?: string;
    "org.opencontainers.image.base.name"?: string;
    "org.opencontainers.image.created"?: string;
    "org.opencontainers.image.documentation"?: string;
    "org.opencontainers.image.licenses"?: string;
    "org.opencontainers.image.ref.name"?: string;
    "org.opencontainers.image.revision"?: string;
    "org.opencontainers.image.source"?: string;
    "org.opencontainers.image.title"?: string;
    "org.opencontainers.image.url"?: string;
    "org.opencontainers.image.vendor"?: string;
    "org.opencontainers.image.version"?: string;
}

export interface DockerExtensionLabels {
    "com.docker.desktop.extension.api.version"?: string;
    "com.docker.desktop.extension.icon"?: string;
    "com.docker.extension.account-info"?: "required" | "";
    "com.docker.extension.additional-urls"?: string;
    "com.docker.extension.categories"?: string;
    "com.docker.extension.changelog"?: string;
    "com.docker.extension.detailed-description"?: string;
    "com.docker.extension.publisher-url"?: string;
    "com.docker.extension.screenshots"?: string;
}

export interface CommonLabels extends ComposeLabels, LabelSchemaLabels, OpenContainerLabels, DockerExtensionLabels {
    commit?: string;
    description?: string;
    maintainer?: string;
    name?: string;
    release?: string;
    revision?: string;
    summary?: string;
    url?: string;
    vendor?: string;
    version?: string;
}

export interface BaseAttributes extends CommonLabels {
    name: string;
}

export interface BaseEvent<T extends EventTypes, A extends TypeActionMap[T]> {
    Action: A;
    Actor: {
        Attributes:  BaseAttributes & Partial<Record<string, string>>;
        ID: string;
    };
    Type: T;
    from: string;
    id: string;
    scope: "local" | "swarm";
    status: string;
    time: number;
    timeNano: number;
}

export interface BaseEventWithImage<T extends EventTypes, A extends TypeActionMap[T]> extends BaseEvent<T, A> {
    Actor: {
        Attributes:  BaseAttributes & {
            [key: string]: string | undefined;
            image: string;
        };
        ID: string;
    };
}

export interface BasePruneEvent<T extends EventTypes, A extends TypeActionMap[T]> extends Omit<BaseEvent<T, A>, "Actor"> {
    Actor: {
        Attributes:  Omit<BaseAttributes, "name"> & {
            [key: string]: string | undefined;
            reclaimed: string;
        };
        ID: string;
    };
}

export interface Event<T extends EventTypes, A extends ActionTypes> {
    Action: A;
    Actor: {
        Attributes: Record<string, string> & { image: string; name: string; };
        ID: string;
    };
    Type: T;
    scope: "local" | "swarm";
    time: number;
    timeNano: number;
}
export interface TypeActionMap {
    builder: Builder.Actions;
    config: Config.Actions;
    container: Container.Actions;
    daemon: Daemon.Actions;
    image: Image.Actions;
    network: Network.Actions;
    node: Node.Actions;
    secret: Secret.Actions;
    service: Service.Actions;
    volume: Volume.Actions;
}
export type EventTypes = keyof TypeActionMap;
export type ActionTypes = TypeActionMap[EventTypes];
export interface ActionTypeMap {
    "archive-path": "container";
    attach: "container";
    commit: "container";
    connect: "network";
    copy: "container";
    create: "config" | "container" |"network" | "node" | "secret" | "service" | "volume";
    delete: "image";
    destroy: "container" | "network" | "volume";
    detach: "container";
    die: "container";
    disconnect: "network";
    exec_create: "container";
    exec_detach: "container";
    exec_die: "container";
    exec_start: "container";
    export: "container";
    health_status: "container";
    import: "image";
    kill: "container";
    load: "image";
    mount: "volume";
    oom: "container";
    pause: "container";
    prune: "builder" | "container" | "image" | "network";
    pull: "image";
    push: "image";
    reload: "daemon";
    remove: "config" | "network" | "node" | "secret" | "service";
    rename: "container";
    resize: "container";
    restart: "container";
    save: "image";
    start: "container";
    stop: "container";
    tag: "image";
    top: "container";
    unmount: "volume";
    unpause: "container";
    untag: "image";
    update: "config" | "container" | "network" | "node" | "secret" | "service";
}

export type AnyTypeEvent = {
    [T in EventTypes]: [event: Event<T, TypeActionMap[T]>];
};
export type AnyActionEvent = {
    [A in ActionTypes]: [event: Event<ActionTypeMap[A], A>];
};

export type UnionToIntersection<U> = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type AnyCombinedEvent = UnionToIntersection<{
    [K in EventTypes]: {
        [TA in `${K}.${TypeActionMap[K]}`]: [event: Event<TA extends `${infer T}.${string}` ? T : never, TA extends `${string}.${infer A}` ? A : never>];
    }
}[EventTypes]>;

export type AnyEventParams = {
    [K in EventTypes]: [event: Event<K, TypeActionMap[K]>];
}[EventTypes];

interface OtherEvents {
    any: AnyEventParams;
    error: [err: Error];
    warn: [info: string];
}

export type Events = AnyTypeEvent & AnyActionEvent & AnyCombinedEvent & OtherEvents;
