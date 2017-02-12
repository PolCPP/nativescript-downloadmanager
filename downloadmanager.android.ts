/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />
import * as Application from "application"
import definition = require("./downloadmanager");

export enum notificationVisibility {
    VISIBILITY_HIDDEN = 2, //This download doesn't show in the UI or in the notifications.requires the permission android.permission.DOWNLOAD_WITHOUT_NOTIFICATION.
    VISIBILITY_VISIBLE = 0, //This download is visible but only shows in the notifications while it's in progress. 
    VISIBILITY_VISIBLE_NOTIFY_COMPLETED = 1, //This download is visible and shows in the notifications while in progress and after completion. 
    // VISIBILITY_VISIBLE_NOTIFY_ONLY_COMPLETION = 3 /*This download shows in the notifications after completion ONLY. It is usuable only with addCompletedDownload(String, String, boolean, String, String, long, boolean). */
}

export class DownloadManager {
    
    downloads: Map<number, Function>;
    manager: any;

    public constructor() {        
        this.manager = Application.android.context.getSystemService(android.content.Context.DOWNLOAD_SERVICE);
        this.downloads = new Map<number,Function>();
        this.registerBroadcast();
    }
            
    public downloadFile(url: string,options:definition.DownloadOptions, cb: Function) {
        let directory = options.directory ? options.directory : 'downloads';

        let filename = options.filename ? options.filename : url.substring(url.lastIndexOf('/') + 1);
        let title = options.title ? options.title: filename;

        let uri = android.net.Uri.parse(url);
        let req = new android.app.DownloadManager.Request(uri);       

        req.setDestinationInExternalFilesDir(Application.android.context, directory, filename);                

        req.setTitle(title);

        if(options.description)
            req.setDescription(options.description)                        

        if(options.header){
            let header = options.header.header
            let value = options.header.value;
            req.addRequestHeader(header,value);
        }

        if(options.allowScanningByMediaScanner)
            req.allowScanningByMediaScanner();

        if(options.disallowOverMetered)
            req.setAllowedOverMetered(false);
        
        if(options.disallowOverRoaming)
            req.setAllowedOverRoaming(false);

        if(options.mimeType)
            req.setMimeType(options.mimeType);
        
        if(options.notificationVisibility != undefined)
            req.setNotificationVisibility(options.notificationVisibility);
        
        if(options.hideInDownloadsUi)
            req.setVisibleInDownloadsUi(false);    

        /*API 24
        if(options.requiresCharging)
            req.setRequiresCharging(true);
        
        if(options.requiresDeviceIdle)
            req.setRequiresDeviceIdle(true);
        
        */

        let id = this.manager.enqueue(req);
        this.downloads.set(id, cb);
    }

    public registerBroadcast() {
        Application.android.registerBroadcastReceiver(android.app.DownloadManager.ACTION_DOWNLOAD_COMPLETE, 
                                                        this.handleDownloadEvent.bind(this));

    }

    private handleDownloadEvent(context: android.content.Context, intent: android.content.Intent) {                
        var query = new android.app.DownloadManager.Query();        
        var id = intent.getExtras().getLong(android.app.DownloadManager.EXTRA_DOWNLOAD_ID);
        // Todo: Add a filter and remove the loop.
        // https://github.com/NativeScript/android-runtime/issues/469 Explains this
        // Apparently since its vargargs instead of         
        // query.setFilterById(id);  or  query.setFilterById(long(id));
        // one has to pass query.setFilterById(id,[]); ran a quick test and it worked
        var c = this.manager.query(query);
        while (c.moveToNext()) {
            if (c.getLong(c.getColumnIndex(android.app.DownloadManager.COLUMN_ID)) == id) {
                var success;
                switch (c.getInt(c.getColumnIndex(android.app.DownloadManager.COLUMN_STATUS))) {
                    case android.app.DownloadManager.STATUS_SUCCESSFUL: 
                        success = true;
                        break;
                    case android.app.DownloadManager.STATUS_FAILED: 
                        success = false;
                        break;
                }
                if (this.downloads.has(id)) {
                    let uri = c.getString(c.getColumnIndex(android.app.DownloadManager.COLUMN_LOCAL_URI));
                    let cb = this.downloads.get(id)
                    cb(success,uri)
                }
                break;
            }
        }
        c.close();                
    }

    public unregisterBroadcast() {
        Application.android.unregisterBroadcastReceiver(android.app.DownloadManager.ACTION_DOWNLOAD_COMPLETE);
    }
    
}
