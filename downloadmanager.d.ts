export interface DownloadOptions {
    directory?:string, //directory to be created in android/data/yourapp/files/
    filename?:string, //set filename
    title?:string, //Set the title of this download, to be displayed in notifications (if enabled). If no title is given, a default one will be assigned based on the download filename, once the download starts.
    description?:string, // Set a description of this download, to be displayed in notifications (if enabled)
    header?:{header:string,value:string}, //Add an HTTP header to be included with the download request. The header will be added to the end of the list.
    allowScanningByMediaScanner?:boolean, // If the file to be downloaded is to be scanned by MediaScanner 
    disallowOverMetered?:boolean, // Set whether this download may proceed over a metered network connection. By default, metered networks are allowed.
    disallowOverRoaming?:boolean, // Set whether this download may proceed over a roaming connection. By default, roaming is allowed.
    mimeType?:string, // Set the MIME content type of this download. This will override the content type declared in the server's response.
    notificationVisibility?:notificationVisibility, //If enabled, the download manager posts notifications about downloads through the system 
    hideInDownloadsUi?:boolean //Set whether this download should be displayed in the system's Downloads UI. visible by default.
    /*API 24
    requiresCharging?:boolean, //Specify that to run this download, the device needs to be plugged in. This defaults to false.
    requiresDeviceIdle?:boolean, //Specify that to run, the download needs the device to be in idle mode. This defaults to false. 
    */

}

export enum notificationVisibility {
    VISIBILITY_HIDDEN , 
    VISIBILITY_VISIBLE,
    VISIBILITY_VISIBLE_NOTIFY_COMPLETED,
    // VISIBILITY_VISIBLE_NOTIFY_ONLY_COMPLETION
}

export declare class DownloadManager {
    downloads: Map<number, Function>;
    manager: any;
    constructor();
    downloadFile(url: string, options:DownloadOptions, cb: Function);
    registerBroadcast(): void;
    private handleDownloadEvent(context, intent);
    unregisterBroadcast(): void;
}
