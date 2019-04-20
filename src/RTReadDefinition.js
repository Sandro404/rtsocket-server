let RTRequest = require("./RTRequest");
let RTSubscriber = require("./RTSubscriber");
let RTDefinition = require("./RTDefinition");

class RTReadDefinition extends RTDefinition {
  /**
   *  @name GetResultsFunction
   *  @function
   *  @param queryAttributes Query attributes for the reading query
   *  @return {*} Results from the query
   */

  /**
   * Definitions for a data source query. Manages requests and creates new subscribers for them
   * @class RTReadDefinition
   * @extends {RTDefinition}
   * @param {String} name Human readable definiton name
   * @param {Number} minPermissions Socket's minimum authentication permissions level
   * @param {CheckRequestedQueryAttributesFunction} checkRequestedQueryAttributes Function to check socket's requested attributes with serverside permitted saved ones
   * @param {GetResultsFunction} getResults Function that gets the result from the datasource
   */
  constructor(name, getResults, minPermissions, checkRequestedQueryAttributes) {
    super(name, minPermissions, checkRequestedQueryAttributes);
    this.getResults = getResults;
    this.requests = [];
  }

  /**
   * Synchronizes clients from requests
   * @param {String} sourceUuid Subscriber's uuid that shouldn't be updated
   * @memberof RTReadDefinition
   */
  synchronizeClients(sourceUuid) {
    let { getResults } = this;

    this.requests.forEach(request =>
      request.synchronizeClients(getResults, sourceUuid)
    );
  }

  /**
   * Updates all request subscriptions from a specific socket
   * @param {socket} socket
   * @memberof RTReadDefinition
   */
  updateSocket(socket) {
    this.requests.forEach(request => request.updateSocket(socket));
  }

  /**
   * Adds a getReadHandler listener for this definition to a socket
   * @param {socket} socket
   * @memberof RTReadDefinition
   */
  addHandler(socket) {
    let { name } = this;
    socket.on(name, this.getReadHandler(socket));
  }

  /**
   * Creates a function to handle a socket's reading requests and adds a unsubscribe handler
   * @param {socket} socket Socket to create the handler for
   * @returns {ReadHandlerFunction} Handler for the listener
   * @memberof RTReadDefinition
   */
  getReadHandler(socket) {
    let { requests, minPermissions, checkQueryAttributes, getResults } = this;

    /**
     * Adds a subscriber to the existing or new request for these query attributes
     * @name ReadHandlerFunction
     * @function
     * @param {String} uuid Uuid for the new subscriber
     * @param {Object} queryAttributes Query attributes for the reading query
     */
    return async (uuid, queryAttributes) => {
      let request = requests.find(
        request => request.queryAttributes === queryAttributes
      );
      // create a new request if no request with the same queryattributes found
      if (request === undefined) {
        request = new RTRequest(
          queryAttributes,
          minPermissions,
          checkQueryAttributes
        );
        // get data for request
        await request.initRequest(getResults);
      }
      requests.push(request);
      let subscriber = new RTSubscriber(socket, uuid);
      // create unsubscribe handler for socket
      socket.on("unsubscribe" + uuid, () => {
        request.removeSubscriber(subscriber);
        if (request.subscribers.length === 0) {
          this.requests = this.requests.filter(
            filterRequest => filterRequest !== request
          );
        }
      });
      request.initializeSubscriber(subscriber);
    };
  }
}
module.exports = RTReadDefinition;
