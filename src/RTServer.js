let RTAuthentication = require("./RTAuthentication");

class RTServer {
  /**
   * Handles a part of a website with all read-, modifyrequests and permissions
   * @class RTServer
   * @param {RTServerConfig} RTServerConfig configuration for this rtserver
   */
  constructor(RTServerConfig) {
    this.modifyDefinitions = RTServerConfig.modifyDefinitions;
    this.readDefinitions = RTServerConfig.readDefinitions;
    this.RTAuthenticator = RTServerConfig.RTAuthenticator;
    this.synchronizeClients = this.synchronizeClients.bind(this);
  }

  /**
   * Adds read-, modify- and authenticationhandlers for a socket. Also adds a default RTAuthentication if needed
   * @param {*} socket Socket to add the handlers for
   * @memberof RTServer
   */
  addSocket(socket) {
    let { readDefinitions, modifyDefinitions, RTAuthenticator } = this;

    if (socket.RTAuthentication === undefined) {
      // add a default RTAuthentication with {} as permitted query attributes and 0 as permissions level
      socket.RTAuthentication = new RTAuthentication({}, 0);
    }

    RTAuthenticator.startAuthenticationHandler(socket, () => {
      // updates all subscriptions from authenticated socket when socket's authentication changes
      readDefinitions.forEach(readDefinition =>
        readDefinition.updateSocket(socket)
      );
    });
    readDefinitions.forEach(readDefinition =>
      readDefinition.addHandler(socket)
    );
    modifyDefinitions.forEach(modifyDefinition =>
      modifyDefinition.addHandler(socket, this.synchronizeClients)
    );
  }

  /**
   * Synchronizes clients from readdefinitions
   * @function
   * @name SynchronizeClients
   * @param {String} sourceUuid Uuid from subscriber that shouldn't be updated
   * @memberof RTServer
   */
  synchronizeClients(sourceUuid) {
    this.readDefinitions.forEach(readDefinition =>
      readDefinition.synchronizeClients(sourceUuid)
    );
  }
}
module.exports = RTServer;
