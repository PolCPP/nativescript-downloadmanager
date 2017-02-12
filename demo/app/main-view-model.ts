import {Observable} from 'data/observable';
// Import the class.
import {DownloadManager} from 'nativescript-downloadmanager'
import {DownloadOptions} from 'nativescript-downloadmanager'
import {notificationVisibility} from 'nativescript-downloadmanager'

export class HelloWorldModel extends Observable {

    private _message: string;

    constructor() {
        super();
    }

    get message(): string {
        return this._message;
    }
    
    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange('message', value)
        }
    }

    public download() {
    	// Instantiate a Download Manager. The way it's done (it uses a BroadcastReceiver), 
    	// it's mean to be kept alive during all the application lifetime. But we can kill unsubscribe 
    	// if we want to
        let options:DownloadOptions = {title:"sample file", hideInDownloadsUi:true,directory:'mamad',notificationVisibility:notificationVisibility.VISIBILITY_VISIBLE,description:'we are downlading a sample file',allowScanningByMediaScanner:true};
        let dm = new DownloadManager();
	// We download a file. This is the Most simple version of doing it.
        dm.downloadFile("http://download.thinkbroadband.com/5MB.zip",options, function(res,uri) {
            // res is a boolean, if the download was successful, it will return true
            console.log(res);
            // This is the uri in file:// format of the downloaded file.
            console.log(uri);
        })
    }
}
