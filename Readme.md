# NodeAPI for google Oauth, Facebook Oauth, Linking Accounts

This nodeAPI allows you to Login/ Signup with Google/Facebook and local Login/Signup. Linking of Google, Facebook and Local (Specific to app) accounts under a common entry in Database.

## Start the API

- To run the server open a terminal window and `cd` to the backend folder
- Then install the node_modules by running `npm install`
- create a `nodemon.json` in the root directory of project file and add
  `{ "env": { "JWT_KEY": "YourJWTKey", "mongousername": "YourmongoAtlasUsername", "mongopassword": "YourMongoAtlasPassword", "mongoDBname": "YourMongoDBName" } }`

- create a new js file in config folder `auth.js` with content `module.exports = { facebookAuth: { clientID: "YourFacebookClientId", clientSecret: "YourFacebookClientSecret", callbackURL: "http://localhost:3001/auth/facebook/callback", profileFields: ["email"] }, googleAuth: { clientID: "YourGoogleClientId", clientSecret: "YourGoogleClinetSecret", callbackURL: "http://localhost:3001/auth/google/callback" } };`

- Then start the development server by running `npm start`
- The server will be up and running on port 3001

## API Endpoints

- `/login`: To login with an existing account
- `/signup`: To create a new account
- `/auth/facebook`: To Signin using Facebook Oauth
- `/connect/facebook`: To Link the facebook account
- `/unlink/facebook`: To unlink the linked facebook account
- `/auth/google`: To Signin using Google Oauth
- `/connect/google`: To Link the google account
- `/unlink/google`: To unlink the linked google account
