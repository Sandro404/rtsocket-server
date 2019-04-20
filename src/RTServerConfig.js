class RTServerConfig {
  /**
   * RTServer configuration with it's readdefinitions, modifydefinitions and rtauthenticator
   * @class RTServerConfig
   * @param {RTAuthenticator} RTAuthenticator RTAuthenticator to authenticate new sockets
   */
  constructor(RTAuthenticator) {
    this.RTAuthenticator = RTAuthenticator;
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
