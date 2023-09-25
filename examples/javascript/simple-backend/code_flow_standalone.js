// const config = {
  // clientId: 'APP_KEY_HERE',
  // clientSecret: 'APP_SECRET_HERE',
  // accessToken: "access_token_here", 
  // refreshToken: "refresh_token_here", // (retrieved from "Token Result" in ./code_flow_example.js):
// };
let config = require('../config.local.json')

const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved
const dbx = new Dropbox(config);

// this code snippet copied and tweaked from from code_flow_example.js

      // console.log(`Token Result:${JSON.stringify(token)}`);

      // ORIGINAL method to set refresh token:
      // dbx.auth.setRefreshToken(token.result.refresh_token); // (retrieve from "Token Result" in ./code_flow_example.js):

      // OR: // refresh_token could also be set like this
      // refresh_token = "refresh_token_here" 
      // dbx.auth.setRefreshToken(refresh_token); // not necessary; set in config
      dbx.usersGetCurrentAccount()
        .then((response) => {
          console.log('response', JSON.stringify(response));
        })
        .catch((error) => {
          console.error(JSON.stringify(error));
        });

