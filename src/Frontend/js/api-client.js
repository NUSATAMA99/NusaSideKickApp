/**
 * API CLIENT MODULE
 * Handles all communication with backend API
 * 
 * This module provides:
 * - Request construction and sending
 * - Response parsing
 * - Error handling
 * - Authentication management
 */

const APIClient = (() => {
  // Private configuration
  // Point to Cloudflare Worker (CORS proxy) instead of direct Google Apps Script
  const API_ENDPOINT = "https://thesidekick.nusatama4dev.workers.dev/api";
  const TIMEOUT = 30000;

  /**
   * Make API request
   * @param {string} action - API action name
   * @param {Object} payload - Request payload
   * @returns {Promise<Object>} Response object
   */
  async function request(action, payload = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      const requestBody = {
        action: action,
        ...payload
      };

      console.log('🔄 API Request:', { action, endpoint: API_ENDPOINT, payload });

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📡 API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response Data:', action, data);
      return data;

    } catch (error) {
      if (error.name === "AbortError") {
        return {
          status: "error",
          message: "Request timeout. Please try again.",
          code: "TIMEOUT"
        };
      }
      
      return {
        status: "error",
        message: error.message || "Network error occurred.",
        code: "NETWORK_ERROR"
      };
    }
  }

  /**
   * Validate PIN
   * @param {string} pin - User PIN
   * @returns {Promise<Object>} Validation result
   */
  async function validatePin(pin) {
    return request("validatePin", { pin });
  }

  /**
   * Get all clients
   * @returns {Promise<Object>} Client list
   */
  async function getClients() {
    return request("getClient");
  }

  /**
   * Add new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Result
   */
  async function addClient(clientData) {
    return request("addClient", clientData);
  }

  /**
   * Get all projects
   * @returns {Promise<Object>} Project list
   */
  async function getProjects() {
    return request("getProject");
  }

  /**
   * Add new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Result
   */
  async function addProject(projectData) {
    return request("addProject", projectData);
  }

  /**
   * Update project status
   * @param {string} projectName - Project name
   * @param {string} status - New status
   * @returns {Promise<Object>} Result
   */
  async function updateProjectStatus(projectName, status) {
    return request("updateStatus", { projectName, projectStatus: status });
  }

  /**
   * Record client payment
   * @param {string} projectName - Project name
   * @param {number} amount - Payment amount
   * @param {string} note - Payment note
   * @returns {Promise<Object>} Result
   */
  async function recordPayment(projectName, amount, note = "") {
    return request("recordPayment", {
      projectName,
      paymentAmount: amount,
      paymentNote: note,
      paymentStatus: "PAID"
    });
  }

  /**
   * Record vendor payment
   * @param {string} projectName - Project name
   * @param {number} amount - Payment amount
   * @param {string} note - Payment note
   * @returns {Promise<Object>} Result
   */
  async function recordVendorPayment(projectName, amount, note = "") {
    return request("recordVendorPayment", {
      projectName,
      paymentAmount: amount,
      vendorPaymentNote: note,
      vendorPaymentStatus: "PAID"
    });
  }

  /**
   * Get dashboard data
   * @returns {Promise<Object>} Dashboard data
   */
  async function getDashboard() {
    return request("getDashboard");
  }

  /**
   * Get all vendors
   * @returns {Promise<Object>} Vendor list
   */
  async function getVendors() {
    return request("getVendor");
  }

  /**
   * Add new vendor
   * @param {Object} vendorData - Vendor data
   * @returns {Promise<Object>} Result
   */
  async function addVendor(vendorData) {
    return request("addVendor", vendorData);
  }

  /**
   * Delete project
   * @param {string} projectName - Project name
   * @returns {Promise<Object>} Result
   */
  async function deleteProject(projectName) {
    return request("deleteProject", { projectName });
  }

  /**
   * Get projects by client
   * @param {string} clientName - Client name
   * @returns {Promise<Object>} Project list
   */
  async function getProjectsByClient(clientName) {
    return request("getProjectsByClient", { clientName });
  }

  /**
   * Get vendors by tag
   * @param {string} tag - Filter tag
   * @returns {Promise<Object>} Vendor list
   */
  async function getVendorsByTag(tag) {
    return request("getVendorTag", { tag });
  }

  // Public API
  return {
    validatePin,
    getClients,
    addClient,
    getProjects,
    addProject,
    updateProjectStatus,
    recordPayment,
    recordVendorPayment,
    getDashboard,
    getVendors,
    addVendor,
    deleteProject,
    getProjectsByClient,
    getVendorsByTag
  };
})();
