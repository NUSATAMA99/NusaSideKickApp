/**
 * UI UTILITIES MODULE
 * Helper functions for UI operations and DOM manipulation
 * 
 * This module provides:
 * - DOM element selection and manipulation
 * - Event handling helpers
 * - Modal/alert dialogs
 * - Form utilities
 * - Animation helpers
 */

const UIUtils = (() => {
  /**
   * Safe querySelector wrapper
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null
   */
  function $(selector) {
    return document.querySelector(selector);
  }

  /**
   * Multiple elements selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} Collection of elements
   */
  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Set text content with sanitization
   * @param {Element|string} element - Element or selector
   * @param {string} text - Text to set
   */
  function setText(element, text) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) el.textContent = text;
  }

  /**
   * Set HTML content
   * @param {Element|string} element - Element or selector
   * @param {string} html - HTML to set
   */
  function setHTML(element, html) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) el.innerHTML = html;
  }

  /**
   * Add CSS class
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name
   */
  function addClass(element, className) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) el.classList.add(className);
  }

  /**
   * Remove CSS class
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name
   */
  function removeClass(element, className) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) el.classList.remove(className);
  }

  /**
   * Toggle CSS class
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name
   */
  function toggleClass(element, className) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) el.classList.toggle(className);
  }

  /**
   * Check if element has class
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name
   * @returns {boolean} Has class
   */
  function hasClass(element, className) {
    const el = typeof element === "string" ? $(element) : element;
    return el ? el.classList.contains(className) : false;
  }

  /**
   * Set element visibility
   * @param {Element|string} element - Element or selector
   * @param {boolean} isVisible - Show or hide
   */
  function setVisible(element, isVisible) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) {
      if (isVisible) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  }

  /**
   * Enable/disable element
   * @param {Element|string} element - Element or selector
   * @param {boolean} isEnabled - Enable or disable
   */
  function setEnabled(element, isEnabled) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) {
      el.disabled = !isEnabled;
      if (isEnabled) {
        el.classList.remove("opacity-50", "cursor-not-allowed");
      } else {
        el.classList.add("opacity-50", "cursor-not-allowed");
      }
    }
  }

  /**
   * Show loading state in element
   * @param {Element|string} element - Element or selector
   */
  function showLoading(element) {
    const el = typeof element === "string" ? $(element) : element;
    if (el) {
      el.innerHTML = `
        <div class="flex justify-center items-center p-8">
          <div class="animate-spin">
            <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full"></div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Format currency (IDR)
   * @param {number} amount - Amount to format
   * @returns {string} Formatted string
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format date (Indonesian)
   * @param {Date|string} date - Date to format
   * @params {string} format - Format option (short, long, full)
   * @returns {string} Formatted date
   */
  function formatDate(date, format = "short") {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    const formatOptions = {
      short: { year: "numeric", month: "2-digit", day: "2-digit" },
      long: { year: "numeric", month: "long", day: "numeric" },
      full: { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    };

    return new Intl.DateTimeFormat("id-ID", formatOptions[format] || formatOptions.short)
      .format(dateObj);
  }

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, limit = 1000) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Show alert dialog using SweetAlert2
   * @param {Object} config - Alert configuration
   * @returns {Promise} Alert result
   */
  async function showAlert(config) {
    const defaultConfig = {
      allowOutsideClick: false,
      allowEscapeKey: false
    };

    return Swal.fire({ ...defaultConfig, ...config });
  }

  /**
   * Show success notification
   * @param {string} message - Message to show
   * @param {string} title - Optional title
   */
  async function showSuccess(message, title = "Sukses!") {
    return showAlert({
      icon: "success",
      title: title,
      text: message,
      confirmButtonText: "OK"
    });
  }

  /**
   * Show error notification
   * @param {string} message - Message to show
   * @param {string} title - Optional title
   */
  async function showError(message, title = "Terjadi Kesalahan") {
    return showAlert({
      icon: "error",
      title: title,
      text: message,
      confirmButtonText: "OK"
    });
  }

  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @param {string} title - Optional title
   * @returns {Promise<boolean>} User confirmed
   */
  async function showConfirm(message, title = "Konfirmasi") {
    const result = await showAlert({
      icon: "question",
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    });

    return result.isConfirmed;
  }

  // Public API
  return {
    $,
    $$,
    setText,
    setHTML,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    setVisible,
    setEnabled,
    showLoading,
    formatCurrency,
    formatDate,
    debounce,
    throttle,
    showAlert,
    showSuccess,
    showError,
    showConfirm
  };
})();
