# NUSATAMA SIDEKICK TRACKER EVO

A powerful, modular, production-ready project management system built with Google Apps Script, Google Sheets, and Cloudflare Workers.

## ✨ What's New in This Refactor

This version features a **complete architectural overhaul** for:
- ✅ **Modular Backend** - Separated into Handlers, Repositories, and Database layers
- ✅ **Modular Frontend** - Separated into API Client, State Manager, UI Utils, and Controller
- ✅ **Scalability** - Easy to add new features without touching existing code
- ✅ **Maintainability** - Clear separation of concerns and well-documented architecture
- ✅ **Lightweight** - Optimized performance, minimal dependencies
- ✅ **TypeScript-Ready** - Code structure prepared for future TypeScript migration

## 📋 Quick Overview

**SIDEKICK TRACKER** is an enterprise project management system for tracking projects, clients, vendors, and payments. It provides:

### Core Features
- ✅ **PIN-Protected Access** — Secure login with backend PIN validation
- 📊 **Real-time Dashboard** — Live analytics and statistics
- 👥 **Client Management** — Track clients, entities, and contacts
- 🏢 **Vendor Management** — Manage vendors, payments, and categorization
- 💰 **Payment Tracking** — Record and monitor client & vendor payments
- 📱 **Responsive Design** — Mobile-first PWA-capable interface
- 🔄 **Real-time Sync** — Integrated with Google Sheets

## 🏗️ Architecture Overview

### Three-Tier System

```
Frontend (Browser)           Backend (Google Apps Script)      Database (Google Sheets)
├─ HTML                      ├─ Router Layer                   ├─ Multiple Sheets
├─ Modular JS Modules        ├─ Handlers Layer                 ├─ Real-time Data
├─ CSS (modular)             ├─ Repository Layer               └─ Structured Storage
└─ 4 KB modules              ├─ Database Layer
                             └─ Utilities
```

---

## 🚀 Installation & Setup

### 1. Deploy Backend to Google Apps Script

Copy these files to your Google Apps Script project:

**Layer 1: Configuration**
- `Backend/Config.gs` - Global constants and sheet names

**Layer 2: Data Access**
- `Backend/DataLayer/Database.gs` - Raw database operations
- `Backend/DataLayer/ClientRepository.gs` - Client business logic
- `Backend/DataLayer/ProjectRepository.gs` - Project business logic
- `Backend/DataLayer/VendorRepository.gs` - Vendor business logic

**Layer 3: API Handlers**
- `Backend/Handlers/AuthHandlers.gs`
- `Backend/Handlers/ClientHandlers.gs`
- `Backend/Handlers/ProjectHandlers.gs`
- `Backend/Handlers/VendorHandlers.gs`
- `Backend/Handlers/PaymentHandlers.gs`
- `Backend/Handlers/DashboardHandlers.gs`

**Layer 4: Utilities**
- `Backend/Utilities/Security.gs` - Validation & security
- `Backend/Router.gs` - Main API router (entry point)

### 2. Setup PIN in Google Sheet

1. Open the linked Google Sheet
2. Create a sheet named "PIN" (if not exists)
3. Put your PIN in cell B2

### 3. Include Frontend Modules

Add these to your HTML (in order):
```html
<!-- External dependencies -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Your modular modules -->
<script src="js/api-client.js"></script>
<script src="js/state-manager.js"></script>
<script src="js/ui-utils.js"></script>
<script src="js/app-controller.js"></script>

<!-- CSS -->
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/theme.css">
```

### 4. Configure API Endpoint

In `Frontend/js/api-client.js`, set your Apps Script URL:
```javascript
const API_ENDPOINT = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

## 📚 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend UI** | HTML5 + Vanilla JS | User Interface |
| **Frontend Logic** | 4 Modular JS Modules | State & API Management |
| **Frontend Styling** | CSS3 (Tailwind + Custom) | Responsive Design |
| **Backend** | Google Apps Script | Business Logic |
| **Database** | Google Sheets | Data Storage |
| **Edge Layer** | Cloudflare Workers | CORS Proxy |

## 📁 Project Structure

```
src/
├── Backend/                          # Backend services
│   ├── Config.gs                     # Configuration
│   ├── Router.gs                     # API router (entry point)
│   ├── DataLayer/                    # Data access layer
│   │   ├── Database.gs               # Raw DB operations
│   │   ├── ClientRepository.gs
│   │   ├── ProjectRepository.gs
│   │   └── VendorRepository.gs
│   ├── Handlers/                     # API handlers
│   │   ├── AuthHandlers.gs
│   │   ├── ClientHandlers.gs
│   │   ├── ProjectHandlers.gs
│   │   ├── VendorHandlers.gs
│   │   ├── PaymentHandlers.gs
│   │   └── DashboardHandlers.gs
│   └── Utilities/
│       └── Security.gs               # Validation & security
├── Frontend/                         # Frontend application
│   ├── index.html                    # Main HTML
│   ├── js/                           # JavaScript modules
│   │   ├── api-client.js             # Backend communication
│   │   ├── state-manager.js          # State management
│   │   ├── ui-utils.js               # UI helpers
│   │   └── app-controller.js         # Main controller
│   ├── css/                          # Stylesheets
│   │   ├── animations.css
│   │   ├── components.css
│   │   └── theme.css
│   └── assets/                       # Images & icons
├── Cloudflare/
│   └── worker.js                     # Edge function
├── ARCHITECTURE.md                   # Detailed documentation
└── README.md                         # This file
```

## 🔌 API Endpoints

### Example Requests

**Validate PIN:**
```json
{
  "action": "validatePin",
  "pin": "1234"
}
```

**Get Dashboard Data:**
```json
{
  "action": "getDashboard"
}
```

**Add Project:**
```json
{
  "action": "addProject",
  "projectName": "My Project",
  "clientName": "ABC Corp",
  "sellPrice": 5000000
}
```

**Add Client:**
```json
{
  "action": "addClient",
  "namaClient": "PT ABC",
  "wa": "6285880193610"
}
```

**Record Payment:**
```json
{
  "action": "recordPayment",
  "projectName": "My Project",
  "paymentAmount": 2500000
}
```

## 💡 Frontend Modules

### APIClient Module
Encapsulates all backend communication:
```javascript
await APIClient.validatePin("1234");
await APIClient.getProjects();
await APIClient.addProject({ ... });
```

### StateManager Module
Centralized app state with observers:
```javascript
StateManager.set("projects", data);
StateManager.subscribe("projects", (data) => { ... });
```

### UIUtils Module
DOM and UI helper functions:
```javascript
UIUtils.formatCurrency(5000000);
UIUtils.showSuccess("Done!");
await UIUtils.showConfirm("Continue?");
```

### App Controller
Main application orchestrator coordinating all modules.

## 🎯 Key Design Patterns

### Backend
- **Repository Pattern** - Separates data access from business logic
- **Handler Pattern** - Centralizes request validation and processing
- **Layer Architecture** - Clear separation between Router, Handlers, Repo, and DB

### Frontend
- **State Management** - Single source of truth with StateManager
- **Module Pattern** - Encapsulated modules with private state
- **Observer Pattern** - Components react to state changes
- **Facade Pattern** - APIClient hides backend complexity

## 🚀 Adding New Features

### To Add a New Endpoint:

1. **Create Handler** in `Handlers/YourHandler.gs`
2. **Add Route** in `Router.gs` switch statement
3. **Add API Method** in `api-client.js`
4. **Update UI** in `app-controller.js`
5. **Test** using the API endpoint

### Example: Add "Reports" Feature

**Handler** (`Backend/Handlers/ReportHandlers.gs`):
```javascript
const ReportHandlers = {
  generateReport: function(request) {
    // Business logic here
    return { status: "success", data: reportData };
  }
};
```

**Router** (add to `Router.gs`):
```javascript
case "generatereport":
case "generate_report":
  return ReportHandlers.generateReport(request);
```

**API Client** (in `api-client.js`):
```javascript
async function generateReport(params) {
  return request("generateReport", params);
}
```

## 📊 Data Flow

```
Frontend Request
    ↓
APIClient.makeRequest()
    ↓
Backend Router (parse & validate)
    ↓
Handler (business logic)
    ↓
Repository (data aggregation)
    ↓
Database (raw operations)
    ↓
Google Sheets
    ↓
[Response flows back up]
    ↓
StateManager.set()
    ↓
UIUtils renders changes
    ↓
Frontend Updated
```

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Comprehensive architecture guide
  - Layer architecture details
  - API reference  
  - Best practices
  - Code examples
  - Troubleshooting

## 📊 Database Structure

### Google Sheets Tabs

| Tab Name | Purpose | Key Data |
|----------|---------|----------|
| **MAIN_JOURNAL** | Project registry & transactions | Projects, status, amounts, vendor info |
| **CLIENTBOOK** | Client database | Client names, entities, contact info |
| **VENDORLAND** | Vendor registry | Vendor names, contact info, payment status |
| **VARIABLES** / **SETUP** | Configuration & settings | System variables, constants |
| **PIN** | Security credentials | PIN stored in cell B2 |
| **3RPARTY_LOG** | Activity logging | API requests, transactions |
| **BANKACCLIST** | Bank account information | Account details for payments |

## 🔒 Security

- PIN validation on backend (never client-side)
- Input validation on all requests
- CORS protection via Cloudflare Worker
- No sensitive data in frontend

## ⚡ Performance

- Modular code (~4KB per module when minified)
- Efficient Google Sheets queries
- State-based rendering (minimal DOM updates)
- Debounced API calls for frequent operations

## 🐛 Troubleshooting

**"API endpoint not found"**
- Check `API_ENDPOINT` URL in `api-client.js`
- Verify Apps Script is deployed

**"PIN fails validation"**
- Verify PIN exists in Sheet PIN > Cell B2
- Check value format

**"UI not updating"**
- Check browser console
- Verify StateManager subscriptions
- Check API response status

## 💻 Development
- Handles `OPTIONS` requests for CORS preflight
- Forwards `POST` requests to AppScript
- Returns JSON responses with proper CORS headers

---

## 📝 Bug Fixes & Recent Updates

| Fix | Change |
|-----|--------|
| **FIX 1** | PIN validation moved from frontend hardcode to Sheet (PIN tab > B2) |
| **FIX 2** | `saveClient()` function added (was missing) |
| **FIX 3** | Dashboard data client names no longer appended with duplicate entity |
| **FIX 4** | Vendor paid/unpaid statistics now calculated and sent correctly |
| **FIX 5** | VendorChoice now read directly from column Q (not parsed from description) |

---

## 🚀 Deployment

### Google Apps Script Deployment
1. Open Apps Script Editor: [script.google.com](https://script.google.com)
2. Deploy as Web App:
   - New deployment → Web app
   - Execute as: Your account
   - Who has access: Anyone
3. Copy the deployment URL to `worker.js`

### Cloudflare Worker Deployment
1. Set up Cloudflare account
2. Create Worker with provided `worker.js` code
3. Update `APPSCRIPT_URL` in worker.js with current AppScript URL
4. Deploy to your domain

### Frontend Deployment
- Host HTML/CSS/JS files on any static hosting
- Update `APPSCRIPT_URL` in worker.js
- Enable PWA by adding manifest.json (optional)

---

## 🔄 Request Flow Example

```
User Action (Frontend)
    ↓
Fetch to Cloudflare Worker (/api)
    ↓
Worker forwards to AppScript
    ↓
AppScript validates & processes
    ↓
SheetManager reads/writes to Google Sheets
    ↓
Response JSON returned to Worker
    ↓
Worker adds CORS headers
    ↓
Frontend receives & displays data
```

---

## 📞 Support & Maintenance

### Configuration Changes
- Update PIN: Edit Google Sheets tab `PIN`, cell `B2`
- Add new sheets: Update `CONFIG.SHEETS` in `Constant.gs`
- Modify AppScript URL: Update in `worker.js` `APPSCRIPT_URL`

### Monitoring
- Check `3RPARTY_LOG` tab for API request logs
- Monitor Google Apps Script execution logs
- Review Cloudflare Worker analytics

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| `Main.gs` | Main router and request handler |
| `SheetManager.gs` | Database operations and business logic |
| `Constant.gs` | Configuration and constants |
| `index.html` | Frontend UI and user interactions |
| `worker.js` | Cloudflare Worker CORS proxy |
| `appsscript.json` | Apps Script manifest |

---

## 🎯 Development Notes

### Common Tasks

**Add a new API action:**
1. Add case in `Main.gs` switch statement
2. Create corresponding function in `SheetManager.gs`
3. Add Google Sheets column if needed
4. Update frontend to call new action

**Access the API:**
```javascript
const payload = {
  action: "actionName",
  data: { /* ... */ }
};

fetch('https://thesidekick.nusatama4dev.workers.dev/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## ✨ Features Roadmap

- [ ] Advanced filtering & search
- [ ] Export to PDF/Excel
- [ ] Email notifications
- [ ] Multi-user roles & permissions
- [ ] Audit trail
- [ ] Invoice generation
- [ ] Payment gateway integration

---

**Last Updated:** April 4, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
