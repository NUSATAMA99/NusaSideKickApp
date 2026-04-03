/**
 * STATE MANAGER MODULE
 * Manages application state and data
 * 
 * This module provides:
 * - State storage and management
 * - Data caching
 * - State observers/subscribers
 * - Data getters and setters
 */

const StateManager = (() => {
  // Private state storage
  let state = {
    authenticated: false,
    currentUser: null,
    currentPage: "home",
    
    // Data
    clients: [],
    projects: [],
    vendors: [],
    stats: {},
    
    // UI State
    loading: false,
    error: null,
    notification: null,
    
    // Filters
    filters: {
      projectStatus: null,
      clientName: null,
      vendorTag: null
    }
  };

  // Subscribers for state changes
  const subscribers = {};

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Callback function
   */
  function subscribe(key, callback) {
    if (!subscribers[key]) {
      subscribers[key] = [];
    }
    subscribers[key].push(callback);
  }

  /**
   * Unsubscribe from state changes
   * @param {string} key - State key
   * @param {Function} callback - Callback to remove
   */
  function unsubscribe(key, callback) {
    if (subscribers[key]) {
      subscribers[key] = subscribers[key].filter(cb => cb !== callback);
    }
  }

  /**
   * Notify all subscribers of state change
   * @private
   * @param {string} key - State key that changed
   */
  function notifySubscribers(key) {
    if (subscribers[key]) {
      subscribers[key].forEach(callback => {
        callback(state[key]);
      });
    }
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @returns {any} State value
   */
  function get(key) {
    return state[key];
  }

  /**
   * Set state value
   * @param {string} key - State key
   * @param {any} value - New value
   */
  function set(key, value) {
    state[key] = value;
    notifySubscribers(key);
  }

  /**
   * Update nested state object
   * @param {string} key - State key
   * @param {Object} updates - Updates to merge
   */
  function update(key, updates) {
    state[key] = { ...state[key], ...updates };
    notifySubscribers(key);
  }

  /**
   * Set authentication state
   * @param {boolean} isAuthenticated - Auth status
   * @param {Object} user - User data
   */
  function setAuthenticated(isAuthenticated, user = null) {
    state.authenticated = isAuthenticated;
    state.currentUser = user;
    notifySubscribers("authenticated");
  }

  /**
   * Get all state
   * @returns {Object} Current state object
   */
  function getAll() {
    return { ...state };
  }

  /**
   * Reset state
   */
  function reset() {
    state = {
      authenticated: false,
      currentUser: null,
      currentPage: "home",
      clients: [],
      projects: [],
      vendors: [],
      stats: {},
      loading: false,
      error: null,
      notification: null,
      filters: {
        projectStatus: null,
        clientName: null,
        vendorTag: null
      }
    };
    Object.keys(subscribers).forEach(key => {
      notifySubscribers(key);
    });
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Loading status
   */
  function setLoading(isLoading) {
    state.loading = isLoading;
    notifySubscribers("loading");
  }

  /**
   * Set error message
   * @param {string} errorMessage - Error message or null
   */
  function setError(errorMessage) {
    state.error = errorMessage;
    notifySubscribers("error");
  }

  /**
   * Set notification
   * @param {string} message - Notification message
   * @param {string} type - Type (success, error, warning, info)
   */
  function setNotification(message, type = "info") {
    state.notification = { message, type };
    notifySubscribers("notification");
  }

  // Public API
  return {
    get,
    set,
    update,
    getAll,
    reset,
    subscribe,
    unsubscribe,
    setAuthenticated,
    setLoading,
    setError,
    setNotification
  };
})();
