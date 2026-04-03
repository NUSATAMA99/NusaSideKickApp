# NUSATAMA SIDEKICK TRACKER EVO - Architecture Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [API Reference](#api-reference)
6. [Getting Started](#getting-started)
7. [Best Practices](#best-practices)

---

## Overview

This is a modern, modular application architecture for the NUSATAMA SIDEKICK TRACKER EVO system. The application has been refactored from a monolithic structure into a scalable, maintainable, and lightweight system with clear separation of concerns.

### Key Principles
- **Modularity**: Each component has a single responsibility
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear code organization and documentation
- **Lightweight**: Minimal dependencies,  optimized for performance
- **Testability**: Each module can be tested independently

---

## Project Structure

```
src/
├── Backend/
│   ├── Config.gs                 # Global configuration & constants
│   ├── Router.gs                 # Main API router & entry point
│   ├── DataLayer/
│   │   ├── Database.gs           # Low-level database operations
│   │   ├── ClientRepository.gs   # Client business logic
│   │   ├── ProjectRepository.gs  # Project business logic
│   │   └── VendorRepository.gs   # Vendor business logic
│   ├── Handlers/
│   │   ├── AuthHandlers.gs       # Authentication handlers
│   │   ├── ClientHandlers.gs     # Client API handlers
│   │   ├── ProjectHandlers.gs    # Project API handlers
│   │   ├── VendorHandlers.gs     # Vendor API handlers
│   │   ├── PaymentHandlers.gs    # Payment handlers
│   │   └── DashboardHandlers.gs  # Dashboard data aggregation
│   └── Utilities/
│       └── Security.gs           # Security & validation utilities
├── Frontend/
│   ├── Index.html               # Main HTML (to be refactored)
│   ├── js/
│   │   ├── api-client.js        # API communication module
│   │   ├── state-manager.js     # Application state management
│   │   ├── ui-utils.js          # UI helper functions
│   │   └── app-controller.js    # Main app controller
│   ├── css/
│   │   ├── animations.css       # Animation definitions
│   │   ├── components.css       # Component styles
│   │   └── theme.css            # Theme & utility styles
│   └── assets/
│       └── sidekick_favicon.png # Application icon
├── Cloudflare/
│   └── worker.js               # Cloudflare Worker edge function
└── appsscript.json             # Google Apps Script manifest
```

---

## Backend Architecture

### Layer Architecture

```
┌─────────────────────────────────────────┐
│          API Router (Router.gs)          │
│     (Routes requests to handlers)       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Handlers Layer                   │
│  (Business logic & validation)          │
│  ├── AuthHandlers                       │
│  ├── ClientHandlers                     │
│  ├── ProjectHandlers                    │
│  ├── VendorHandlers                     │
│  ├── PaymentHandlers                    │
│  └── DashboardHandlers                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│       Repository Layer                   │
│  (Data access & aggregation)            │
│  ├── ClientRepository                   │
│  ├── ProjectRepository                  │
│  └── VendorRepository                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│        Database Layer                    │
│     (Direct spreadsheet access)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│       Google Sheets API                  │
│    (Actual data storage)                │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. **Router Layer** (`Router.gs`)
- Entry point for all POST requests
- Routes requests based on `action` parameter
- Handles CORS and OPTIONS requests
- Logs all API calls

#### 2. **Handlers Layer** (`Handlers/*.gs`)
- Receives requests from Router
- Validates input data using Security module
- Calls appropriate Repository methods
- Returns formatted JSON responses

#### 3. **Repository Layer** (`DataLayer/*Repository.gs`)
- Implements business logic
- Orchestrates Database operations
- Formats data for frontend consumption
- Handles data aggregation and calculations

#### 4. **Database Layer** (`DataLayer/Database.gs`)
- Pure data access operations
- No business logic
- Methods for CRUD operations
- Direct Google Sheets API calls

### Data Flow

```
Frontend Request
        ↓
    Router.gs (parse & route)
        ↓
   Handler (validate & process)
        ↓
   Repository (business logic)
        ↓
   Database (raw operations)
        ↓
    Google Sheets
        ↓
   Database (format results)
        ↓
   Repository (aggregate data)
        ↓
   Handler (final response)
        ↓
    Router (send JSON)
        ↓
Frontend Response
```

### Adding New Features

To add a new feature (e.g., "Reports"):

1. **Create Handler** (`Handlers/ReportHandlers.gs`)
   ```javascript
   const ReportHandlers = {
     generateReport: function(request) {
       // Business logic
     }
   };
   ```

2. **Update Router** (add case in `Router.gs`)
   ```javascript
   case "generatereport":
   case "generate_report":
     return ReportHandlers.generateReport(request);
   ```

3. **Create Frontend Integration** (in JS modules)
   - Add API method in `api-client.js`
   - Call from `app-controller.js`
   - Update State if needed

---

## Frontend Architecture

### Module Structure

```
Frontend Architecture (MVC-like Pattern)

┌──────────────────────────────────────────┐
│         DOM / HTML Structure              │
│   (View - User Interface)                │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│      UI Utils (ui-utils.js)               │
│   Helper functions for DOM manipulation   │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│   App Controller (app-controller.js)      │
│   Main application logic & orchestration  │
└────────────┬──────────┬──────────────────┘
             │          │
   ┌─────────▼─┐   ┌────▼─────────┐
   │ State     │   │ API Client    │
   │ Manager   │   │               │
   │ (state)   │   │ (api-client)  │
   └───────────┘   └─────────────┘
        │                │
   State Store      Backend API
```

### Module Descriptions

#### 1. **API Client** (`api-client.js`)
- Encapsulates all backend communication
- Provides promise-based async methods
- Handles network errors & timeouts
- Formats requests & responses

**Usage:**
```javascript
const response = await APIClient.addProject({
  projectName: "My Project",
  clientName: "ABC Corp",
  sellPrice: 5000000
});
```

#### 2. **State Manager** (`state-manager.js`)
- Centralized application state
- Supports observers/subscribers
- Provides getters & setters
- Notifies UI of state changes

**Usage:**
```javascript
// Get state
const projects = StateManager.get("projects");

// Set state
StateManager.set("projects", newProjects);

// Subscribe to changes
StateManager.subscribe("projects", (newData) => {
  updateUI(newData);
});
```

#### 3. **UI Utils** (`ui-utils.js`)
- DOM selection & manipulation
- Event handling helpers
- Alert/modal dialogs (SweetAlert2)
- Helper functions (format currency, dates, etc.)

**Usage:**
```javascript
// DOM manipulation
UIUtils.setText("#statIncome", "Rp 10,000,000");
UIUtils.addClass(element, "hidden");

// Dialogs
await UIUtils.showSuccess("Data saved!");

// Formatting
const formatted = UIUtils.formatCurrency(5000000); // "Rp 5,000,000"
```

#### 4. **App Controller** (`app-controller.js`)
- Main application logic
- Page navigation
- Data loading & synchronization
- Event delegation
- Renders UI based on state

---

## CSS Architecture

### CSS File Organization

#### 1. **animations.css**
- All @keyframes definitions
- Animation utility classes
- Staggered animation delays

#### 2. **components.css**
- Component-specific styles
- Button styles (.btn-arcade variants)
- Card & container styles
- Table & form styles
- Modal & overlay styles

#### 3. **theme.css**
- Color utilities
- Spacing utilities
- Display & visibility classes
- Flexbox utilities
- Text utilities
- Border, shadow, & rounded utilities
- Transitions & animations

### CSS Class Naming

Classes follow functional CSS convention:
- `.flex-center` - centered flex container
- `.text-primary` - primary text color
- `.p-md` - medium padding
- `.shadow-lg` - large shadow
- `.rounded-lg` - large border radius

---

## API Reference

### Authentication

#### `validatePin`
Validate user PIN against stored value
```json
{
  "action": "validatePin",
  "pin": "1234"
}
```

### Clients

#### `getClient`
Get all clients
```json
{
  "action": "getClient"
}
```

#### `addClient`
Add new client
```json
{
  "action": "addClient",
  "namaClient": "PT ABC",
  "entity": "Entity Name",
  "wa": "6285880193610",
  "location": "Jakarta"
}
```

### Projects

#### `getProject`
Get all projects
```json
{
  "action": "getProject"
}
```

#### `addProject`
Add new project
```json
{
  "action": "addProject",
  "projectName": "Web Development",
  "clientName": "PT ABC",
  "projectType": "Development",
  "paymentChannel": "Bank Transfer",
  "description": "Project description",
  "expense": 1000000,
  "sellPrice": 5000000,
  "deadline": "2025-12-31",
  "vendor": "Vendor Name"
}
```

#### `updateStatus`
Update project status
```json
{
  "action": "updateStatus",
  "projectName": "Web Development",
  "projectStatus": "DONE"
}
```

#### `deleteProject`
Delete a project
```json
{
  "action": "deleteProject",
  "projectName": "Web Development"
}
```

### Payments

#### `recordPayment`
Record client payment
```json
{
  "action": "recordPayment",
  "projectName": "Web Development",
  "paymentAmount": 2500000,
  "paymentNote": "Payment note"
}
```

#### `recordVendorPayment`
Record vendor payment
```json
{
  "action": "recordVendorPayment",
  "projectName": "Web Development",
  "paymentAmount": 1000000,
  "vendorPaymentNote": "Payment note"
}
```

### Dashboard

#### `getDashboard`
Get aggregated dashboard data
```json
{
  "action": "getDashboard"
}
```

### Vendors

#### `getVendor`
Get all vendors
```json
{
  "action": "getVendor"
}
```

#### `addVendor`
Add new vendor
```json
{
  "action": "addVendor",
  "name": "Vendor Name",
  "contact": "0858-8019-3610",
  "tags": ["development", "design"],
  "bank": "BCA",
  "notes": "Notes"
}
```

---

## Getting Started

### 1. Setup Google Apps Script Project

```bash
# Clone the remote Google Apps Script project
clasp clone <SCRIPT_ID>

# Push local changes to Google Apps Script
clasp push

# Deploy as web app
clasp deploy
```

### 2. Configure PIN Sheet

1. Open the Google Sheet linked to Apps Script
2. Create a tab named "PIN"
3. Put the PIN value in cell B2

### 3. Test API Endpoints

Use the deployed URL to test:
```javascript
// Test PIN validation
fetch("YOUR_APPS_SCRIPT_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "validatePin",
    pin: "1234"
  })
}).then(r => r.json()).then(console.log);
```

---

## Best Practices

### Backend

1. **Always Validate Input**
   ```javascript
   const validation = Security.validateRequired(request, ["name", "wa"]);
   if (validation.status === "error") return validation;
   ```

2. **Use Repositories for Data Access**
   - Don't call Database directly in Handlers
   - All business logic goes in Repositories

3. **Consistent Response Format**
   ```javascript
   return {
     status: "success|error",
     message: "Human readable message",
     data: { /* result data */ }
   };
   ```

4. **Log Important Operations**
   ```javascript
   console.log("Action: " + action + " | User: " + email);
   ```

5. **Handle Errors Gracefully**
   ```javascript
   try {
     // operation
   } catch (e) {
     return { status: "error", message: e.toString() };
   }
   ```

### Frontend

1. **Use API Client for All Backend Calls**
   ```javascript
   // ✅ Good
   const response = await APIClient.getClients();

   // ❌ Bad - direct fetch
   const response = await fetch(URL);
   ```

2. **Manage State Centrally**
   ```javascript
   // ✅ Good
   StateManager.set("projects", newProjects);
   StateManager.subscribe("projects", renderProjects);

   // ❌ Bad - direct DOM manipulation
   document.querySelector("#projects").innerHTML = html;
   ```

3. **Use UI Utils for DOM Operations**
   ```javascript
   // ✅ Good
   UIUtils.setText("#statIncome", amount);
   UIUtils.addClass(element, "hidden");

   // ❌ Bad - direct DOM access
   document.querySelector("#statIncome").textContent = amount;
   element.classList.add("hidden");
   ```

4. **Show Feedback to User**
   ```javascript
   // Always show success or error
   UIUtils.showSuccess("Data saved successfully!");
   UIUtils.showError("Failed to save data");
   ```

5. **Handle Loading States**
   ```javascript
   StateManager.setLoading(true);
   // ... async operation
   StateManager.setLoading(false);
   ```

### Code Guidelines

1. **Use JSDoc Comments**
   ```javascript
   /**
    * Description of function
    * @param {type} name - Parameter description
    * @returns {type} Return description
    */
   function doSomething(name) { }
   ```

2. **Meaningful Names**
   - Functions: `validateEmail()`, `formatCurrency()`
   - Variables: `isLoading`, `clientName`, `totalExpense`
   - Avoid abbreviations unless standard

3. **Error Messages**
   - Clear and actionable
   - User-friendly language
   - No technical jargon

4. **Keep Functions Small**
   - Single responsibility
   - Easy to test
   - Easy to understand

---

## Performance Optimization

### Frontend
- Debounce expensive operations
- Cache API responses in state
- Lazy load components
- Minimize DOM reflows

### Backend
- Cache dataset queries
- Use batch operations
- Optimize Google Sheets queries
- Limit data returned

### General
- Minify CSS & JS (production)
- Use CDN for dependencies
- Implement request timeouts
- Add rate limiting

---

## Troubleshooting

### API Errors

**"Action tidak valid"**
- Check spelling of the action
- Ensure action is registered in Router.gs

**"PIN tidak valid"**
- Verify PIN is set in Sheet PIN > B2
- Check PIN input format

**"Tab tidak ditemukan"**
- Verify sheet names in CONFIG.SHEETS
- Check spelling of sheet names

### Frontend Issues

**Modules not loading**
- Check file paths in HTML
- Ensure files are in correct directories
- Check browser console for errors

**State not updating**
- Verify StateManager.subscribe() callback
- Check if setState is being called
- Use browser DevTools to inspect state

---

## Version History

- **v1.0.0** (April 2025) - Initial modular refactor
  - Separated Backend into layers
  - Created Frontend modules
  - Implemented State Management
  - Added comprehensive documentation

---

## Support & Contact

For issues or questions:
1. Check this documentation first
2. Review browser console for errors
3. Check Google Apps Script logs
4. Contact development team

---

**Last Updated:** April 2025
**Maintained By:** NUSATAMA Development Team
