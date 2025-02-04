export interface Container {
    HostConfig: {
        NetworkMode: string;
    };
    Id: string;
    Labels: Record<string, string>;
    Names: Array<string>;
    NetworkSettings: {
        Networks: Record<string, {
            IPAddress: string; // can be literal ""
        }>;
    };
}

export interface HostDuplicate {
    containers: Array<ContainerInfo>;
    host: string;
}

export interface ContainerInfo {
    container: string;
    host: string;
    ip: string | null;
    name: string;
}
