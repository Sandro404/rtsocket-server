class RTDefinition {
  /**
   * Defines basic definition properties
   * @class RTDefinition
   * @param {String} name Human readable definiton name
   * @param {Number} minPermissions Socket's minimum authentication permissions level
   * @param {CheckRequestedQueryAttributesFunction} checkQueryAttributes Function to check socket's requested query attributes with serverside permitted saved ones
   */
  constructor(name, minPermissions, checkQueryAttributes) {
    this.name = name;
    this.minPermissions = minPermissions;
    this.checkQueryAttributes = checkQueryAttributes;
  }
}
module.exports = RTDefinition;
