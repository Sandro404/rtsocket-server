class RTAuthenticator {
  /**
   *  Authenticates a user
   *  @name AuthenticationFunction
   *  @function
   *  @param {Object} userCredentials Credentials sent by the client
   *  @return {RTAuthentication} Generated authentication object for the client
   */

  /**
   *  Returns object to send to an authenticated client
   *  @name GetCallbackAttributesFunction
   *  @function
   *  @param {RTAuthentication} userAuthentication User's rtauthentication
   *  @return {Object} Object to be sent the client
   */
  
  /**
   * Manages authentication for a rtserverconfig
   * @class RTAuthenticator
   * @param {AuthenticationFunction} authenticate The function to check credentials
   * @param {GetCallbackAttributesFunction} getCallbackAttributes Gets object to send to an authenticated client
   */
  constructor(authenticate, getCallbackAttributes) {
    this.authenticate = authenticate;
    this.getCallbackAttributes = getCallbackAttributes;
  }

  /**
   * Creates an authenticate event listener for a socket
   * @param {socket} socket Socket that needs the event listener
   * @memberof RTAuthenticator
   */
  async startAuthenticationHandler(socket, rtserverCallback) {
    socket.on(
      "authenticate",
      await this.authenticateSocket(rtserverCallback, socket)
    );
  }

  /**
   * Wrapper function for function that gets socket's authentication object, notifies socket and rtserver
   * @param {RTServerCallback} rtserverCallback Server's callback on permission change
   * @param {socket} socket Socket that wants to authenticate
   * @returns {Function} Gets socket's authentication object, notifies socket and rtserver
   * @memberof RTAuthenticator
   */
  async authenticateSocket(rtserverCallback, socket) {
    return async (userCredentials, userCallback) => {
      let { getCallbackAttributes, authenticate } = this;

      socket.RTAuthentication = await authenticate(userCredentials);
      userCallback(getCallbackAttributes(socket.RTAuthentication));
      rtserverCallback();
    };
  }
}
module.exports = RTAuthenticator;
