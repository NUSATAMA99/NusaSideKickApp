/**
 * APP CONTROLLER
 * Main application controller that orchestrates all modules
 * 
 * Responsibilities:
 * - Application initialization
 * - Page navigation and rendering
 * - Data loading and synchronization
 * - Event delegation
 */

const App = (() => {
  /**
   * Initialize application
   */
  async function init() {
    try {
      console.log("Initializing app...");
      
      // Setup event listeners
      setupEventListeners();
      
      // Setup page navigation
      setupPageNavigation();
      
      // Show login page
      showPage("login");
      
      // Initialize icons (Lucide)
      lucide.createIcons();
      
      console.log("App initialized successfully");
    } catch (error) {
      console.error("App initialization error:", error);
      UIUtils.showError("Gagal menginisialisasi aplikasi. Silakan refresh halaman.");
    }
  }

  /**
   * Setup global event listeners
   */
  function setupEventListeners() {
    // Login button
    const loginBtn = UIUtils.$("button[onclick*='doLogin']");
    if (loginBtn) {
      loginBtn.addEventListener("click", handleLogin);
    }

    // Refresh button
    const refreshBtn = UIUtils.$("button[onclick*='loadData']");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", handleRefresh);
    }

    // Bottom navigation buttons (if they exist)
    document.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-nav")) {
        const page = e.target.getAttribute("data-nav");
        showPage(page);
      }
    });
  }

  /**
   * Setup page navigation system
   */
  function setupPageNavigation() {
    // Listen for page changes in state
    StateManager.subscribe("currentPage", (newPage) => {
      updateActiveNav(newPage);
    });
  }

  /**
   * Show specific page/view
   * @param {string} pageName - Page name to show
   */
  function showPage(pageName) {
    const loginPage = UIUtils.$("#loginPage");
    const mainApp = UIUtils.$("#mainApp");
    const viewContents = UIUtils.$$(".view-content");

    if (pageName === "login") {
      if (loginPage) UIUtils.setVisible(loginPage, true);
      if (mainApp) UIUtils.setVisible(mainApp, false);
    } else {
      if (loginPage) UIUtils.setVisible(loginPage, false);
      if (mainApp) UIUtils.setVisible(mainApp, true);

      // Hide all views
      viewContents.forEach(view => {
        UIUtils.setVisible(view, false);
      });

      // Show selected view
      const selectedView = UIUtils.$(`#${pageName}Page`);
      if (selectedView) {
        UIUtils.setVisible(selectedView, true);
        StateManager.set("currentPage", pageName);
      }
    }
  }

  /**
   * Update active navigation indicator
   * @param {string} pageName - Active page
   */
  function updateActiveNav(pageName) {
    UIUtils.$$("[data-nav]").forEach(nav => {
      if (nav.getAttribute("data-nav") === pageName) {
        UIUtils.addClass(nav, "active");
      } else {
        UIUtils.removeClass(nav, "active");
      }
    });
  }

  /**
   * Handle login
   */
  async function handleLogin() {
    try {
      const pinInput = UIUtils.$("#pinInput");
      if (!pinInput) return;

      const pin = pinInput.value.trim();

      if (!pin || pin.length < 4) {
        UIUtils.showError("PIN minimal 4 karakter");
        return;
      }

      StateManager.setLoading(true);

      // Validate PIN
      const response = await APIClient.validatePin(pin);

      if (response.status === "success") {
        StateManager.setAuthenticated(true);
        pinInput.value = ""; // Clear input
        
        // Load dashboard
        showPage("home");
        await loadDashboardData();
        
        UIUtils.showSuccess("Login berhasil!");
      } else {
        UIUtils.showError(response.message || "PIN salah");
      }
    } catch (error) {
      UIUtils.showError("Terjadi kesalahan saat login");
      console.error("Login error:", error);
    } finally {
      StateManager.setLoading(false);
    }
  }

  /**
   * Handle data refresh
   */
  async function handleRefresh() {
    try {
      StateManager.setLoading(true);
      await loadDashboardData();
      UIUtils.showSuccess("Data berhasil dimuat ulang");
    } catch (error) {
      UIUtils.showError("Gagal memuat ulang data");
      console.error("Refresh error:", error);
    } finally {
      StateManager.setLoading(false);
    }
  }

  /**
   * Load dashboard data from API
   */
  async function loadDashboardData() {
    try {
      StateManager.setLoading(true);

      // Load all data in parallel
      const [dashboardRes, projectsRes, vendorsRes, clientsRes] = await Promise.all([
        APIClient.getDashboard(),
        APIClient.getProjects(),
        APIClient.getVendors(),
        APIClient.getClients()
      ]);

      // Update state
      if (dashboardRes.status === "success" && dashboardRes.data) {
        StateManager.set("stats", dashboardRes.data.stats);
      }

      if (projectsRes.status === "success") {
        StateManager.set("projects", projectsRes.data || []);
      }

      if (vendorsRes.status === "success") {
        StateManager.set("vendors", vendorsRes.data || []);
      }

      if (clientsRes.status === "success") {
        StateManager.set("clients", clientsRes.data || []);
      }

      // Render dashboard
      renderDashboard();

    } catch (error) {
      console.error("Dashboard load error:", error);
      StateManager.setError("Gagal memuat data dashboard");
    } finally {
      StateManager.setLoading(false);
    }
  }

  /**
   * Render dashboard with current state data
   */
  function renderDashboard() {
    const stats = StateManager.get("stats");

    if (stats) {
      // Update stats cards
      UIUtils.setText("#statIncome", UIUtils.formatCurrency(stats.total_income || 0));
      UIUtils.setText("#statReceivable", UIUtils.formatCurrency(stats.receivable || 0));
      UIUtils.setText("#statOngoing", stats.ongoing_count || "0");
      UIUtils.setText("#statMonthly", stats.monthly_projects || "0");
      UIUtils.setText("#statPaid", UIUtils.formatCurrency(stats.total_income || 0));
      UIUtils.setText("#statUnpaid", UIUtils.formatCurrency(stats.receivable || 0));
      UIUtils.setText("#statVendorPaid", UIUtils.formatCurrency(stats.vendor_paid_total || 0));
      UIUtils.setText("#statVendorUnpaid", UIUtils.formatCurrency(stats.vendor_unpaid_total || 0));
      UIUtils.setText("#statTotalProfit", UIUtils.formatCurrency(stats.total_profit || 0));
      UIUtils.setText("#statTotalExpense", UIUtils.formatCurrency(stats.total_expense || 0));
      UIUtils.setText("#statRecurring", stats.recurring_percentage || "0%");

      // Update funnel
      UIUtils.setText("#funnelPending", stats.pending_count || "0");
      UIUtils.setText("#funnelOngoing", stats.ongoing_count || "0");
      UIUtils.setText("#funnelDone", stats.done_count || "0");
    }

    // Render project list
    renderProjectList();
    renderVendorList();
  }

  /**
   * Render project list
   */
  function renderProjectList() {
    const projects = StateManager.get("projects") || [];
    const tbody = UIUtils.$("#jobTableBody");

    if (!tbody) return;

    if (projects.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="p-8 text-center text-slate-500">
            Tidak ada project
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = projects.slice(0, 20).map(project => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-4 font-semibold">${project.project_name}</td>
        <td class="p-4">${project.client_name}</td>
        <td class="p-4">${project.deadline ? UIUtils.formatDate(project.deadline, "short") : "-"}</td>
        <td class="p-4 text-center">
          <span class="px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(project.project_status)}">
            ${project.project_status}
          </span>
        </td>
        <td class="p-4 text-right font-semibold">${UIUtils.formatCurrency(project.sell_price)}</td>
        <td class="p-4 text-center">
          <span class="px-2 py-1 rounded-full text-xs font-bold ${getPaymentBadgeClass(project.payment_status)}">
            ${project.payment_status}
          </span>
        </td>
      </tr>
    `).join("");
  }

  /**
   * Render vendor list
   */
  function renderVendorList() {
    const vendors = StateManager.get("vendors") || [];
    const container = UIUtils.$("#vendorListContainer");

    if (!container) return;

    if (vendors.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          Tidak ada vendor terdaftar
        </div>
      `;
      return;
    }

    container.innerHTML = vendors.slice(0, 10).map(vendor => `
      <div class="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-bold text-slate-800">${vendor.name}</p>
            <p class="text-xs text-slate-500">${vendor.contact || "-"}</p>
            ${vendor.tags && vendor.tags.length > 0 ? `
              <div class="flex gap-1 mt-2">
                ${vendor.tags.map(tag => `<span class="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded">${tag}</span>`).join("")}
              </div>
            ` : ""}
          </div>
        </div>
      </div>
    `).join("");
  }

  /**
   * Get badge CSS class for status
   * @param {string} status - Status value
   * @returns {string} CSS classes
   */
  function getStatusBadgeClass(status) {
    const classes = {
      "PENDING": "bg-yellow-50 text-yellow-700",
      "ONGOING": "bg-blue-50 text-blue-700",
      "DONE": "bg-green-50 text-green-700",
      "CANCELLED": "bg-red-50 text-red-700"
    };
    return classes[status] || "bg-slate-50 text-slate-700";
  }

  /**
   * Get badge CSS class for payment status
   * @param {string} status - Status value
   * @returns {string} CSS classes
   */
  function getPaymentBadgeClass(status) {
    const classes = {
      "PAID": "bg-green-50 text-green-700",
      "UNPAID": "bg-orange-50 text-orange-700",
      "PARTIAL": "bg-yellow-50 text-yellow-700"
    };
    return classes[status] || "bg-slate-50 text-slate-700";
  }

  /**
   * Navigate to page with data loading
   * @param {string} pageName - Page name
   */
  async function navigateToPage(pageName) {
    try {
      showPage(pageName);

      if (pageName === "home" && !StateManager.get("stats")) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }

  // Public API
  return {
    init,
    showPage,
    navigateToPage,
    loadDashboardData,
    renderDashboard
  };
})();

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
