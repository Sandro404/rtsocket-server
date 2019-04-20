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
   * Adds read-, modify- and authenticationhandlers for a socket
   * @param {*} socket Socket to add the handlers for
   * @memberof RTServer
   */
  addSocket(socket) {
    let { readDefinitions, modifyDefinitions, RTAuthenticator } = this;

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
