class RTAuthentication {
  /**
   * Stores authentication properties
   * @class RTAuthentication 
   * @param {Object} queryAttributes Permitted attributes
   * @param {Number} permissions Permission level
   * @param {String} infoText Informational text for status of authentication
   */
  constructor(queryAttributes, permissions, infoText) {
    this.queryAttributes = queryAttributes;
    this.permissions = permissions;
    this.infoText = infoText;
  }
}
module.exports = RTAuthentication;
