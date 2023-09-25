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
  doUpload();
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
  doUpload()
});
};

function doUpload() {
  fs.readFile(path.join(__dirname, '/basic.js'), (err, contents) => {
    if (err) {
      console.log('Error: ', err);
    }

    // This uploads basic.js to the root of your dropbox
    dbx.filesUpload({ path: '/basic.js', contents })
      .then((response) => {
        console.log(JSON.stringify(response));
      })
      .catch((uploadErr) => {
        console.log(JSON.stringify(uploadErr));
      });
  });
}