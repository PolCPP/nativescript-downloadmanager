# Nativescript DownloadManager

DownloadManager is a library that allows downloading files from Nativescript in Android using the Android Download Manager. Why not use Http.getFile() ? Pretty much because as i see it it's pretty much broken if you want to download something thats not [just a few kilobytes](https://github.com/NativeScript/NativeScript/issues/3314/).

## Installing

1. `tns plugin add nativescript-downloadmanager`
2. Make sure the following permissions are in your android manifest

	```
	<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
	<uses-permission android:name="android.permission.INTERNET"/>
	```
	
## Usage

Usage is pretty much straightforward: This is a commented example on top of a simplified version of the default Hello world application (aka. just removed the tap count stuff and added a download method). 

**TLDR:** check the download method.

```TypeScript
import {Observable} from 'data/observable';
// Import the class.
import {DownloadManager} from 'nativescript-downloadmanager'

export class HelloWorldModel extends Observable {

    private _message: string;

    constructor() {
        super();
    }

    public download() {
    	// Instantiate a Download Manager. The way it's done (it uses a BroadcastReceiver), 
    	// it's mean to be kept alive during all the application lifetime. But we can kill unsubscribe 
        let dm = new DownloadManager();
        // We download a file, in this example a 10mb test file. 
        // This is the Most simple version of doing it.
        // Aside from that there are optional parameters for. Directory (always inside android/data/yourapp/),
        // The file name, and title and description for the notification bar. By default it uses the file name 
        // as title, and no description.
        dm.downloadFile("http://cachefly.cachefly.net/10mb.test", function(result,uri) {
            // result is a boolean, if the download was successful, it will return true
            console.log(result);
            // Uri in file:// format of the downloaded file.
            console.log(uri);
            // unregisterBroadcast is used to unregister the broadcast (For example if you just want to 
            // download a single file).
            dm.unregisterBroadcast();
        })
    }
}
```

## Todo

* More testing.
*  Document it better.
* Make some kind of iOS emulatedish version.
