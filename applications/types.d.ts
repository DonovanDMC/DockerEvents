export interface Container {
    HostConfig: {
        NetworkMode: string;
    };
    Id: string;
    Labels: Record<string, string>;
    Names: Array<string>;
    NetworkSettings: {
        Networks: Record<string, {
            IPAddress: string;
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
    ip: string;
    name: string;
}
