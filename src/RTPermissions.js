class RTPermissions {
  /**
   * Compares requested query attributes object with socket's server-side saved permitted query attributes object
   *  @name CheckRequestedQueryAttributesFunction
   *  @function
   *  @param {Object} permittedQueryAttributes The query attributes object the socket is permitted to request
   *  @param {Object} requestedQueryAttributes The query attributes object the socket wants to request
   *  @return {Boolean} True if socket's permitted, false if not
   */

  /**
   * Class to check socket's permissions to read or modify
   * @class RTPermissions
   * @param {Number} minPermissions Minimum permission level that socket needs
   * @param {CheckRequestedQueryAttributesFunction} checkRequestedQueryAttributes Compares requested query attributes with socket's permitted query attributes
   * @param {Object} requestedQueryAttributes Requested query attributes
   */
  constructor(
    minPermissions,
    checkRequestedQueryAttributes,
    requestedQueryAttributes
  ) {
    this.minPermissions = minPermissions;
    this.checkRequestedQueryAttributes = checkRequestedQueryAttributes;
    this.requestedQueryAttributes = requestedQueryAttributes;
  }

  /**
   * Checks if user is permitted by checking it's permission level and it's requested query attributes
   * @param {socket} socket Socket to check
   * @returns {Boolean} True if it's permitted, false if not
   * @memberof RTPermissions
   */
  async isPermitted(socket) {
    return (
      this.hasMinPermissions(socket) &&
      (await this.hasRequestedQueryAttributes(socket))
    );
  }

  /**
   * Checks if user has minimum permissions level
   * @param {socket} socket Socket to check
   * @returns True if it has the needed permissions level or more, false if not
   * @memberof RTPermissions
   */
  hasMinPermissions(socket) {
    return (
      socket.RTAuthentication !== undefined &&
      this.minPermissions <= socket.RTAuthentication.permissions
    );
  }

  /**
   * Check if user is permitted to request it's requested query attributes
   * @param {socket} socket Socket to check
   * @returns True if it's permitted to request the query attributes, false if not
   * @memberof RTPermissions
   */
  async hasRequestedQueryAttributes(socket) {
    return await this.checkRequestedQueryAttributes(
      this.requestedQueryAttributes,
      socket.RTAuthentication === undefined
        ? {}
        : socket.RTAuthentication.queryAttributes
    );
  }
}
module.exports = RTPermissions;
