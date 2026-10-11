# Site Leads

**App:** https://dwarkaagencies10.github.io/leads/  
**Owner account:** dwarka.agencies10@gmail.com  
**Setup guide:** [SETUP.md](SETUP.md)

A simple, private lead register for construction sites, built for a team of 5.

- **One page**, with Cards and List views, search, sort and filters
- **Add leads from the phone** with GPS location and camera photos
- **Owner, Builder, Architect and Contractor** contacts, each with call and WhatsApp buttons
- **Card name follows Contractor Type** (With Material → Builder, Without Material → Owner)
- **Multi-select Lead Type:** Cement, Electrical, RMC, BPD
- **Create, view, update, archive and delete** (delete is admin only, with a copy kept in History)
- **Lead Status:** Open (default) → Converted / Not Converted (a reason is required), with status buttons on top to filter cards and list
- **Follow-up dates**, with overdue and due-today highlighting
- **Change history:** who changed what, and when
- **Add new columns from the app**: they appear everywhere automatically
- **Export to Excel (CSV)**
- **Zero cost:** Google Sheet as the database, Google Drive for photos, GitHub Pages for hosting
- **Installable** on phones (home screen), and can be wrapped as an Android APK later

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app |
| `config.js` | Your Google script link (one line). Change only this if the link ever changes |
| `manifest.json`, `sw.js`, `icons/` | Make the app installable and APK-ready |
| `apps-script/Code.gs` | The backend: paste it into your Google Sheet's Apps Script |
| `SETUP.md` | Step-by-step setup guide, from A to Z |

Version 1.0.0. `config.js` already holds the Dwarka Agencies script link. To try the app in **demo mode**, set the link in `config.js` to `""` (log in as Divyesh / 1234; data stays on that device).
