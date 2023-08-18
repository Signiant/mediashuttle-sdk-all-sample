# Media Shuttle SDK Example App

A sample React web application demonstrating the use of the [Media Shuttle SDK](https://developer.signiant.com/media-shuttle/media-shuttle-sdk.html) to navigate the folder structure (files and directories) in a given portal, and to upload and download files. It also showcases how to leverage listeners to display progress and to control transfers via SDK.

Build with [create-react-app](https://github.com/facebook/create-react-app).

## Getting Started

Clone this repo and install the application dependencies.

```
npm install
```

### Listing files and directories

In order to list the files and directories of a portal, follow the following steps:

- Authenticate using [MediaShuttleResourceFactory LoginCredentials](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/classes/MediaShuttleResourceFactory.html).
- Fetch accounts and select one of them to get the list of the associated portals. See [Accounts](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Explorer.html#listAccounts).
- Fetch portals and select one of them. See [Portals](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Explorer.html#listPortals).
- Get the portal member permissions. See [Portal Member Permissions](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Explorer.html#getPortalMemberPermissions).
- Find the root directory with **isUserHome** true from [Portal Member Permissions Response](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/PortalPermissions.html#folders).
- Get the folder content for the root directory. See [Folder Content](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Explorer.html#getFolderContent).

Note: Results from [Folder Content](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Explorer.html#getFolderContent) are not recursive, so if the root folder is found based on the portal member permissions, request must be repeated per sub folder. Request for the sub folder should provide `browsePath` instead of `folderId`.

### Uploading files

```javascript
const uploadOptions =
{
  portalId: portalId,
  serviceId: serviceId,
  accountId: accountId,
  force: true,
  destinationPath: "/"
}
mediaShuttleResourceFactory.generateUpload(uploadOptions).then((uploader) => {
  // open a file selector and add files to the uploader
  uploader
    .addFiles()
    .then((files) => {
      addSubscriptions(uploader, false);
      // start uploading the selected files
      uploader.start();
    })
    .catch((error) => {});
});   
```

### Downloading files

```javascript
const downloadOptions =
{
  portalId: portalId,
  serviceId: serviceId,
  accountId: accountId,
  force: true,
  files: files
}
mediaShuttleResourceFactory.generateDownload(downloadOptions).then((downloader) => {
  downloader
    .selectDestinationFolder()
    .then(() => {
      downloader.start();
      addSubscriptions(downloader, true);
    })
    .catch((error) => {});
});   
```

### Subscription to transfer events

For both upload and download, transfer events can be subscribed. Refer `addSubscriptions` in `src/containers/MediaShuttle/index.js` for subscriptions to different transfer events. 

- [Upload Subscription](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Upload.html#subscribe)
- [Download Subscription](https://sdk.developer.signiant.com/sdk-documentation/media-shuttle/latest/interfaces/Download.html#subscribe)

## Running the Application

The development server that comes with create-react-app can be used to serve the application.

```
npm start
```

The application will be served at `http://localhost:3000`.
