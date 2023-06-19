export interface Container {
    Id: string;
    Names: string[];
    Labels: Record<string, string>;
    HostConfig: {
        NetworkMode: string;
    };
    NetworkSettings: {
        Networks: Record<string, {
            IPAddress: string;
        }>;
    };
}
