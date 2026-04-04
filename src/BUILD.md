# Tailwind CSS Production Setup

## Overview
This project has been configured to use Tailwind CSS with a proper production build setup instead of relying on the CDN.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install:
- **tailwindcss** - The Tailwind CSS framework
- **postcss** - CSS processor
- **autoprefixer** - Vendor prefix automation

### 2. Build Tailwind CSS
```bash
npm run build:css
```

This generates `Frontend/css/tailwind.css` with only the CSS classes actually used in your project (optimized for production).

### 3. Development Workflow
For development with automatic rebuilding:
```bash
npm run watch:css
```

This watches for changes and automatically regenerates the CSS.

### 4. Deploy
```bash
npm run deploy
```

This builds the CSS and then pushes to Google Apps Script using `clasp push`.

## Configuration Files

- **tailwind.config.js** - Tailwind configuration with project-specific settings
- **postcss.config.js** - PostCSS configuration (for autoprefixer and other plugins)
- **package.json** - NPM scripts and dependencies
- **Frontend/css/input.css** - Tailwind directives input file
- **Frontend/css/tailwind.css** - Generated output (do not edit manually)

## Why This Setup?

### Before (CDN)
- ❌ Large, unoptimized CSS (entire Tailwind framework)
- ❌ Not production-ready
- ❌ Slower load times
- ❌ Browser must parse and compile on every page load

### After (Local Build)
- ✅ Minimal, optimized CSS (only used classes)
- ✅ Production-ready and secure
- ✅ Faster load times
- ✅ CSS pre-compiled and minified
- ✅ Full control over Tailwind configuration

## Troubleshooting

### tailwind.css file is empty
Run `npm run build:css` to generate the CSS file.

### CSS changes not showing
Make sure to rebuild with `npm run build:css` or use `npm run watch:css` for development.

### Module not found errors
Run `npm install` to install dependencies.

## Next Steps

1. Run `npm install` in the project root
2. Run `npm run build:css` to generate the CSS
3. Push to Google Apps Script with `clasp push`
