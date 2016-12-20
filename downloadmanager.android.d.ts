export declare class DownloadManager {
    downloads: Map<number, Function>;
    manager: any;
    constructor();
    downloadFile(url: string, cb: Function, directory?: string, filename?: string, title?: string, description?: string): void;
    registerBroadcast(): void;
    private handleDownloadEvent(context, intent);
    unregisterBroadcast(): void;
}
