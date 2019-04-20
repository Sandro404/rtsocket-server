class RTAuthentication {
  /**
   * Stores authentication properties
   * @class RTAuthentication 
   * @param {Object} queryAttributes Permitted attributes
   * @param {Number} permissions Permission level
   */
  constructor(queryAttributes, permissions) {
    this.queryAttributes = queryAttributes;
    this.permissions = permissions;
  }
}
module.exports = RTAuthentication;
