const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved
let config;
try{
  // should be like:
  // const config = {
  //   clientId: 'APP_KEY_HERE',
  //   clientSecret: 'APP_SECRET_HERE',
  //   accessToken: "access_token_here", // AKA API V2 access token
  //   refreshToken: "refresh_token_here" // (retrieved from "Token Result" in ../simple-backend/code_flow_example.js); if you have this, SDK will automatically retrieve accessToken as needed
  // }; 
  config = require('../config.local.json')
}
catch {}

let dbx;
if (config) {
  dbx = new Dropbox(config);
  doUploadAppend();
}
else {
 prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token',
    },
  },
}, (error, result) =>{

  dbx = new Dropbox({ accessToken: result.accessToken });
  doUploadAppend()
});
};

function doUploadAppend(filePathAndName = "/basic.csv") {
    console.log("downloading:")
    dbx.filesDownload({ path: filePathAndName})
      .then((response) => {
        console.log(JSON.stringify(response));
        console.log(response?.result?.fileBinary.toString());

        // prepare to update the file (per https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor); content is the content we've already received
        return {contents:response?.result?.fileBinary.toString(),mode:{".tag":"update", "update":response?.result?.rev}};
      })
      .catch((err) => {
        // console.error(JSON.stringify(err));
        if (err.status != 409 || err.error?.error?.path[".tag"] != "not_found")
          throw err; // if this is not a 409 error for a file not found, give up

        // start building a new file (per https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesUpload__anchor); content is the header line of the new file
        return {contents:"field1,field2,field3", mode:{".tag":"add"}}
      })
      .then((response) => {
        let newContent = "aa,bb,cc"

        // add crlf and then new line to the existing file
        response.contents += "\r\n" + newContent;
        // This uploads the file the dropbox
        return dbx.filesUpload({ path: filePathAndName, ...response})
      })
      .then((response) => {
        console.log(JSON.stringify(response));
      })
      .catch((err) => {
        console.error(JSON.stringify(err));
        throw err;
      });
}