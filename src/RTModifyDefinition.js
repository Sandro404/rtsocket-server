let RTPermissions = require("./RTPermissions");
let RTDefinition = require("./RTDefinition");

class RTModifyDefinition extends RTDefinition {
  /**
   * @name ModifyFunction
   * @function
   * @param {Object} requestedQueryAttributes Query attributes object the socket wants to request
   * @param {Object} permittedQueryAttributes Query attributes object the socket is permitted to request
   * @return {Boolean} True if modifying was successful, false if not
   */

  /**
   * Definitions for a data source manipulation and start for synchronization of requests' subscribers
   * @class RTModifyDefinition
   * @extends {RTDefinition}
   * @param {String} name Human readable definiton name
   * @param {Number} minPermissions Socket's mininum authentication permissions level
   * @param {CheckRequestedQueryAttributesFunction} checkRequestedQueryAttributes Function to check socket's requested query attributes with serverside permitted saved ones //TODO: function definition
   * @param {ModifyFunction} modify Modifies the datasource
   */
  constructor(name, modify, minPermissions, checkRequestedQueryAttributes) {
    super(name, minPermissions, checkRequestedQueryAttributes);
    this.modify = modify;
  }

  /**
   * Adds a listener for this definition to a socket
   * @param {socket} socket Socket that wants the handler
   * @param {SynchronizeClients} synchronizeClients Function to call when modifying succeeds
   * @memberof RTModifyDefinition
   */
  addHandler(socket, synchronizeClients) {
    let { name } = this;
    socket.on(name, this.getModifyHandler(socket, synchronizeClients));
  }

  /**
   * Creates a function to handle a socket's modifying requests
   * @param {socket} socket Socket to create the handler for
   * @param {SynchronizeClients} synchronizeClients Function to call when modifying succeeds
   * @returns {ModifyHandlerFunction} Handler for the listener
   * @memberof RTModifyDefinition
   */
  getModifyHandler(socket, synchronizeClients) {
    let { minPermissions, checkQueryAttributes, modify } = this;

    /**
     * Modifies the datasource and synchronizes the clients
     * @name ModifyHandlerFunction
     * @function
     * @param {Object} queryAttributes Query attributes for the modify query
     * @param {String} uuid Subscriber's uuid that shouldn't be updated
     * @param {Function} callback Gets called with the results
     */
    return async (queryAttributes, uuid, callback) => {
      let results;
      let isPermitted = await new RTPermissions(
        minPermissions,
        checkQueryAttributes,
        queryAttributes
      ).isPermitted(socket);
      if (!isPermitted) {
        results = "NO_PERMISSIONS_TO_MODIFY";
      } else {
        let modifiedSuccessful = await modify(
          queryAttributes,
          socket.RTAuthentication.queryAttributes
        );
        if (modifiedSuccessful) {
          results = "SUCCESSFUL_MODIFIED";
          synchronizeClients(uuid);
        } else {
          results = "FAILED_TO_MODIFY";
        }
      }
      callback(results);
    };
  }
}
module.exports = RTModifyDefinition;
