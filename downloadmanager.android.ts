import * as Application from "application"

export class DownloadManager {
    
    downloads: Map<number, Function>;
    manager: any;

    public constructor() {        
        this.manager = Application.android.context.getSystemService(android.content.Context.DOWNLOAD_SERVICE);
        this.downloads = new Map<number,Function>();
        this.registerBroadcast();
    }
            
    public downloadFile(url: string, cb: Function, directory = "downloads", filename?: string, title?: string, description?: string) {
        if (!filename) {
            filename = url.substring(url.lastIndexOf('/') + 1);
        }
        if (!title) {
            title = filename;
        }
        let uri = android.net.Uri.parse(url);
        let req = new android.app.DownloadManager.Request(uri);       
        req.setDestinationInExternalFilesDir(Application.android.context, directory, filename);                

        req.setTitle(title);
        req.setDescription(description)                        

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
