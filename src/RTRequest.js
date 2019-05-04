let RTPermissions = require("./RTPermissions");
let hash = require('object-hash');

class RTRequest {
  /**
   * Defines a request for a rtreaddefinition with a specific query attributes object and manages the request's subscribers
   * @class RTRequest
   * @param {Object} queryAttributes Query attributes object
   * @param {Number} minPermissions Minimum permissions
   * @param {CheckRequestedQueryAttributesFunction} checkRequestedQueryAttributes Function to check if user is permitted to request it's requested query attributes
   * @memberof RTRequest
   */
  constructor(queryAttributes, minPermissions, checkRequestedQueryAttributes) {
    this.queryAttributes = queryAttributes;
    this.minPermissions = minPermissions;
    this.checkRequestedQueryAttributes = checkRequestedQueryAttributes;
    this.subscribers = [];
  }

  /**
   * Gets the results and updates subscribers if needed
   * @param {GetResultsFunction} getResults Function that gets the result from the datasource
   * @param {String} sourceUuid Subscriber's uuid that shouldn't be updated
   */
  async synchronizeClients(getResults, sourceUuid) {
    let { queryAttributes, lastResultsHash, subscribers } = this;

    let results = await getResults(queryAttributes);
    let resultsHash = hash(results || {});
    if (resultsHash !== lastResultsHash) {
      this.lastResults = results;
      this.lastResultsHash = resultsHash
      subscribers.forEach(subscriber => {
        if (subscriber.uuid !== sourceUuid) {
          this.updateSubscriber(subscriber);
        }
      });
    }
  }

  /**
   * Updates a socket's subscriptions
   * @param {socket} socket Socket that subscriptions should be updated
   * @memberof RTRequest
   */
  async updateSocket(socket) {
    let { subscribers } = this;

    subscribers.forEach(subscriber => {
      if (subscriber.socket == socket) {
        this.updateSubscriber(subscriber);
      }
    });
  }

  /**
   * Updates a rtsubscriber
   * @param {RTSubscriber} subscriber
   */
  updateSubscriber(subscriber) {
    let {
      lastResults,
      minPermissions,
      checkRequestedQueryAttributes,
      queryAttributes
    } = this;

    subscriber.update(
      lastResults,
      new RTPermissions(
        minPermissions,
        checkRequestedQueryAttributes,
        queryAttributes
      )
    );
  }

  /**
   * Adds a subscriber to this request
   * @param {RTSubscriber} subscriber
   * @memberof RTRequest
   */
  addSubscriber(subscriber) {
    this.subscribers.push(subscriber);
  }

  /**
   * Adds a subscriber to this request and updates that subscriber
   * @param {RTSubscriber} subscriber
   * @memberof RTRequest
   */
  initializeSubscriber(subscriber) {
    this.addSubscriber(subscriber);
    this.updateSubscriber(subscriber);
  }

  /**
   * Removes a subscriber
   * @param {RTSubscriber} subscriberToRemove
   * @memberof RTRequest
   */
  removeSubscriber(subscriberToRemove) {
    this.subscribers = this.subscribers.filter(
      subscriber => subscriber !== subscriberToRemove
    );
  }

  /**
   * Initializes the request by getting initial results
   * @param {GetResultsFunction} getResults
   * @memberof RTRequest
   */
  async initRequest(getResults) {
    let { queryAttributes } = this;

    this.lastResults = await getResults(queryAttributes);
  }
}
module.exports = RTRequest;
