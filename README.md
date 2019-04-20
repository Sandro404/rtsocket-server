# rtsocket-server

> server part of rtsocket, a socket.io wrapper for real time communication between multiple endpoints

## Usage

### Installation

Install via npm:

```sh
npm install rtsocket-server
```

### Usage

Import needed classes

```javascript
let {
  RTAuthentication, 
  RTAuthenticator,
  RTModifyDefinition,
  RTReadDefinition,
  RTServer,
  RTServerConfig
} = require("rtsocket-server");
```

#### RTAuthenticator

A RTAuthenticator is needed to process user authentications and can be assigned to a RTServerConfig. The authentication state of each user is saved in it's socket.

```javascript
let publicAuthenticator = new RTAuthenticator(
  // function to create RTAuthentication by authentication object
  auth => {
    return new Promise(resolve => {
      if(checkCredentials(auth.login, auth.password)){
        // return RTAuthentication with query attributes the user is
        // permitted to request and the it's permissions level
        resolve(
          new RTAuthentication(
            { restaurantIds: getRestaurantIds(auth.login) },
            getPermissionsLevel(auth.login)
          )
        )
      }else{
        // create an empty RTAuthentication and add a infoText
        // to identify the cause for it
        resolve(
          new RTAuthentication(
            {},
            0,
            "WRONG_CREDENTIALS"
          )
        )
      }
    });
  },
  // function that gets called when user's authentication changed
  RTAuthentication => {
    return RTAuthentication.infoText === "WRONG_CREDENTIALS"
      ? "Credentials wrong..."
      : "Successful logged in";
  }
);
```

#### RTServerConfig

A RTServerConfig is the configuration for a RTServer. It holds different read- and modifydefinitions.

```javascript
// create a new RTServerConfig with this RTAuthenticator
let publicServerConfig = new RTServerConfig(publicAuthenticator);

// and add a read definition to it
publicServerConfig.addReadDefinition(
  new RTReadDefinition(
    // read definition's name
    "internetFavouriteByType",
    // function that gets the results from the data source
    queryAttributes => {
      var promise = new Promise((resolve, reject) => {
        let { type } = queryAttributes;
        getType(
          type, 
          (results) => {
            resolve(results);
          },
          (error) => {
            reject("DB error");
          })
      });
      return promise;
    },
    // minimum permissions level needed
    GUEST,
    // function that checks if the requested attributes are
    // appropriate with the saved / permitted attributes
    (requestedAttributes, savedAttributes) => {
      return new Promise(resolve => {
        resolve(properAttributes(requestedAttributes, savedAttributes));
      });
    }
  )
);

// add a modify definition to it
publicServerConfig.addModifyDefinition(
  new RTModifyDefinition(
    // modify definition's name
    "deleteFavouriteType",
    // function that modifies the data source
    queryAttributes => {
      const { type } = queryAttributes;
      return new Promise((resolve, reject) => {
        deleteType(
          type, 
          (results) => {
            resolve(results);
          },
          (error) => {
            reject("DB error");
          })
      });
    },
    // minimum permissions level needed
    ADMIN,
    // function that checks if the requested attributes are
    // appropriate with the saved / permitted attributes
    (requestedAttributes, savedAttributes) => {
      var promise = new Promise(resolve => {
        resolve(properAttributes(requestedAttributes, savedAttributes));
      });
      return promise;
    }
  )
);
```

A note about adding readDefinitions: When the data source gets changed with a modify definition, all requests (= all read definitions with the different query attributes) in that one RTServer get redone. Other RTServers will not be affected. The one RTServer redoes the read definition queries in the order you added the read definitions to the RTServerConfiguration.

#### RTServer

A RTServer is the implementation of a RTServerConfiguration. You can actually add sockets to it, and it will create handlers for the definitions in the config. A socket can be added to multiple RTServers. For example: if you have different restaurants in your application, you should create a RTServer for each restaurant (You could create them in RTAuthenticator's onAuthenticated function that gets the object to return to the client, see above.). If someone makes an order in restaurant number 1, the requests from the clients in restaurant 2 don't need to be redone (and compared with the previous sent results, which will be the same).

```javascript
// create the RTServer
let publicServer = new RTServer(publicServerConfig);

io.on("connection", socket => {
  // add socket to the RTServer on connection
  publicServer.addSocket(socket);
});
```

## License

MIT
