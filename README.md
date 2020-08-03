# ChatApp

A realtime chat application created with React & Firebase

[Live Demo](http://chatapp-esn.web.app 'Live Demo')

## Tech Stacks

React, Typescript, Mobx, Firebase

## Getting Started

First you need a Google Firebase account, once you setup that, create a **.env** file at root of the project directory and copy the configuration variables below to **.env** file, and assign the variables value from your Firebase account.

```
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DATABASE_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APIID=
REACT_APP_MEASUREMENTID=
```

You also need to setup Facebook Authentication from your Firebase account in case you want to allow users to sign up with their Facebook account.

Finally clone this repository, install dependencies and run the local server

```sh
npm install
npm start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
