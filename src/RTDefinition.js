class RTDefinition {
  /**
   * Defines basic definition properties
   * @class RTDefinition
   * @param {String} name Human readable definiton name
   * @param {Number} minPermissions Socket's minimum authentication permissions level, if undefined 0
   * @param {CheckRequestedQueryAttributesFunction} checkQueryAttributes Function to check socket's requested query attributes with serverside permitted saved ones, if undefined function that always returns true
   */
  constructor(name, minPermissions, checkQueryAttributes) {
    if (typeof name !== "string")
      throw new Error("RTDefinition's name has to be a string.");
    this.name = name;
    this.minPermissions = minPermissions || 0;
    this.checkQueryAttributes =
      checkQueryAttributes ||
      function() {
        return true;
      };
  }
}
module.exports = RTDefinition;
