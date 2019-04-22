let RTAuthenticator = require("./RTAuthenticator");
let RTAuthentication = require("./RTAuthentication");

class RTServerConfig {
  /**
   * RTServer configuration with it's readdefinitions, modifydefinitions and rtauthenticator. Uses default rtauthenticator that returns {} as permitted query attributes, 0 as permissions level and an empty onAuthenticated function if it's undefined.
   * @class RTServerConfig
   * @param {RTAuthenticator} rtauthenticator RTAuthenticator to authenticate new sockets
   */
  constructor(rtauthenticator) {
    this.RTAuthenticator =
      rtauthenticator ||
      new RTAuthenticator(() => new RTAuthentication({}, 0), () => {});
    this.readDefinitions = [];
    this.modifyDefinitions = [];
  }

  /**
   * Adds a readdefinition to the config
   * @param {RTReadDefinition} readDefinition
   * @memberof RTServerConfig
   */
  addReadDefinition(readDefinition) {
    this.readDefinitions.push(readDefinition);
  }

  /**
   * Adds a modifydefinition to the config
   * @param {RTModifyDefinition} modifyDefinition
   * @memberof RTServerConfig
   */
  addModifyDefinition(modifyDefinition) {
    this.modifyDefinitions.push(modifyDefinition);
  }
}
module.exports = RTServerConfig;
