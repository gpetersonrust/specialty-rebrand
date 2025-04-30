# KOC Specialty Admin System – Master

# Specification

## ACCESS & ENTRY POINT

### URL:

- **Frontend** : /specialties-admin
- Route registered via WordPress rewrite
- Uses a **custom page template** : page-specialties-admin.php
- Injects React root: <div id="specialties-admin-app"></div>

### Access Control:

- Only visible to logged-in users with administrator capability
- All REST API routes protected with current_user_can('manage_options')
- REST requests validated with **nonces**

## LAYOUT & PANELS

### App Shell (React SPA)

Rendered inside a layout like:
plaintext
CopyEdit
+----------------------+----------------------------+
| Sidebar (nav) | Main Panel |
|----------------------|----------------------------|
| • Manage Specialties | [Specialty term editor] |
| • Assign Specialties | [Search → assign UI] |
| • Import / Export | [CSV panel + file upload] |
+----------------------+----------------------------+
Each panel is toggled client-side.


## PANEL 1: Manage Specialties

### Purpose:

Create, edit, and structure specialty taxonomy (specialty_area) terms.

### Features:

- **Live Search** by name
- **Term Selector** (click to edit)
- **Create New Term** :
    o If search yields no match, show “+ Create” button
- **Edit Fields** :
    o name (text)
    o parent_term (search + select)
    o tier (user-defined string)
    o has_own_page (checkbox)

### Saving:

- Auto-save changes (on blur/change)
- Term meta stored via update_term_meta()

### No support for:

- Reordering
- Deleting terms (use WordPress core screen)

## PANEL 2: Assign Specialties

### Purpose:

Assign/remove taxonomy terms to/from physicians in bulk.

### Layout:

plaintext
CopyEdit
Left Panel: Right Panel:
------------------- ---------------------------
[Search specialty] [List of physicians]
[+ Create new term] [Physician card]:

- Name
- ID


- Current specialties (badges)
- [+ Add] or [− Remove]

### Features:

- Specialty selector auto-loads all linked physicians
- Searchable physicians by first + last name
- Inline add/remove buttons per physician
- Current relationships shown as colored badges

### Behavior:

- Auto-saves every assignment (no “Save” button)
- Clicking add/remove sends POST/DELETE to REST
- All changes logged (see logging below)

## PANEL 3: Import / Export

### Export CSV:

- Download all current relationships
- Columns: post_id, name, specialty_1, specialty_2, ...
- File: physician-specialties-export-YYYYMMDD.csv

### Import CSV:

- Upload CSV with same format
- Preview parsed data
- Confirm to apply (via bulk overwrite)
- On apply:
    o Clear all terms on each physician
    o Assign new terms
- File stored as physician-specialties-import-YYYYMMDD.csv

## LOGGING

### File:

- physician-assignments.log in plugin directory

### Format:


yaml
CopyEdit
[2025- 05 - 01 14:33:21] physician_id: 2234, term_id: 401, action: add, user_id:
1
[2025- 05 - 01 14:33:45] physician_id: 2234, term_id: 401, action: remove,
user_id: 1
Used for audit, rollback, and debugging.

## BRAND & STYLE

### 🖌 Typography & Grid

- Font: 'Roboto', sans-serif
- Grid: **4pt baseline**
- Type scale: **1.2 minor**
    o base: 1rem
    o small: 0.833rem
    o large: 1.2rem
    o xl: 1.44rem

### Colors

```
Use Case Color
Primary #^
Secondary #56a^
Text #^
Backgrounds white
```
### Responsive

- Mobile-first with media queries
- 1 - column on mobile, 2-panel on tablet+, 3-panel optional on desktop

### Implementation

- **Tailwind loaded globally** , but not used in JSX
- Styling done via app.scss, compiled to app.css
- Classes used in React will match CSS class names (e.g., .button-primary)


## REST API

Namespace: wp-json/specialty-admin/v
**Endpoint Method Purpose**

/terms (^) GET List + search specialties
/terms (^) POST Create new term
/terms/{term_id} (^) PUT Edit term (name, tier, etc.)
/physicians (^) GET Search physicians by name
/assignments/{physician_id} (^) GET List term IDs
/assignments/{physician_id} (^) POST Add term(s)
/assignments/{physician_id} (^) DELETE Remove term(s)
/assignments/bulk (^) POST Apply CSV import (overwrite)
All requests secured by nonce & role check.

## DATA MODEL

- specialty_area — hierarchical taxonomy
- Term Meta:
    o tier (string)
    o has_page (bool)
- Assignments: native term relationships (wp_set_object_terms())

## DEV STACK

```
Area Tooling
React Webpack, Babel, JSX
CSS SCSS compiled to app.css
State Local state + REST fetch
Build Tailwind + Gulp/Webpack
Back end PHP + WP Plugin
Logging Flat files
Access Ctrl WP roles + REST nonces
```

