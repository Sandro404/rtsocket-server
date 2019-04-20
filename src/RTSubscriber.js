class RTSubscriber {
  /**
   * Represents a subscriber to a request by a component identified by an uuid
   * @class RTSubscriber
   * @param {socket} socket Subscriber's socket
   * @param {String} uuid Subscriber's component uuid
   */
  constructor(socket, uuid) {
    this.socket = socket;
    this.uuid = uuid;
    this.hasSentData = false;
  }

  /**
   * Updates the subscriber by parsing the results
   * @param {*} lastSentResults Request's last sent results
   * @param {RTPermissions} permissionsChecker Checks if subscriber has permissions for request
   * @memberof RTSubscriber
   */
  async update(lastSentResults, permissionsChecker) {
    let { socket, uuid } = this;

    let interpretedResults = await this.parseResults(
      lastSentResults,
      permissionsChecker
    );
    socket.emit(uuid, interpretedResults);
  }

  /**
   * Parses RTRequest's results by also checking permissions for subscriber's socket
   * @param {*} lastSentResults Request's last sent results
   * @param {RTPermissions} permissionsChecker Checks if subscriber has permissions for request
   * @returns Results or a message if something went wrong
   * @memberof RTSubscriber
   */
  async parseResults(lastSentResults, permissionsChecker) {
    let { hasSentData, socket } = this;

    let interpretedResults;
    if (!(await permissionsChecker.isPermitted(socket))) {
      // socket doesn't have permissions to read
      interpretedResults = "NO_PERMISSIONS_TO_READ";
    } else {
      if (lastSentResults == undefined) {
        if (hasSentData) {
          // data results have been sent, but now they don't exist anymore
          interpretedResults = "REQUESTED_ELEMENT_OR_LIST_DELETED";
        } else {
          // no results have been found earlier and no results can be found now
          interpretedResults = "REQUESTED_ELEMENT_OR_LIST_NOT_FOUND";
        }
      } else if (
        Array.isArray(lastSentResults) &&
        lastSentResults.length == 0
      ) {
        // the requested list exist, but it's currently empty
        interpretedResults = "REQUESTED_LIST_EMPTY";
      } else {
        // the requested element exists and the socket has the needed authentication
        interpretedResults = lastSentResults;
        hasSentData = true;
      }
    }

    return interpretedResults;
  }
}
module.exports = RTSubscriber;
