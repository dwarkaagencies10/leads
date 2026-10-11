# Site Leads: setup guide (version 1.0.0)

A fresh, from-scratch setup for **Dwarka Agencies**. Follow the parts in order, on a computer with Chrome. It takes about 30 minutes, once.

**Cost:** ₹0. Everything runs on free Google and GitHub accounts.

---

## Your details

| What | Yours |
|---|---|
| Google account (owns the Sheet, script and photos) | **dwarka.agencies10@gmail.com** |
| GitHub username | **dwarkaagencies10** |
| GitHub repository | **https://github.com/dwarkaagencies10/leads** |
| **App link (send this to your team)** | **https://dwarkaagencies10.github.io/leads/** |
| Google script link (in `config.js`) | `https://script.google.com/macros/s/AKfycbx4R7qfF5u1dyywWbpsNNrU94cPfcwJlcHN1k3WBydtSEFArLMSt7-QbsGQ8jiiVZHg/exec` |
| Admin login | **Divyesh** (rename it in the Users tab if you like) |

## The files

| File | Where it goes |
|---|---|
| `apps-script/Code.gs` | Google Sheet → Extensions → Apps Script |
| `config.js` | GitHub. It holds your Google script link (already filled in) |
| `index.html`, `manifest.json`, `sw.js`, `icons/`, `README.md`, `SETUP.md` | GitHub |

## What the app does

- **One page** with **Cards** (phone) and **List** (computer) views, search, sort and filters.
- **Add a lead from the site:**
  - GPS location (opens in Google Maps)
  - camera and gallery photos (saved in Google Drive)
- **Contacts:** Owner, Builder, Architect and Contractor, each with name, number (call and WhatsApp buttons) and office address.
- **The name on the card follows Contractor Type:**
  - **With Material** → Builder name
  - **Without Material** → Owner name
- **Lead Type**, multi-select: Cement, Electrical, RMC, BPD.
- **Lead Status:**
  - New leads are **Open**.
  - They can move to **Converted** or **Not Converted**.
  - **Not Converted requires a reason.**
- **Status buttons at the top:** Open / Converted / Not Converted. Tap one or several to filter both cards and list.
- **Project details:** Project (G+3, 2B+G+5…), Site Status (Excavation → Completed), Current Usage, Vendor.
- **Follow-up date**, with red "overdue" and yellow "due today" reminders (Open leads only).
- **Change history** for every lead: who changed what, and when.
- **Create, edit, archive and delete:** delete is Admin only, and a copy is kept in History.
- **Admin can add new columns from the app.** They appear everywhere automatically.
- **Export to Excel (CSV).**
- **Works on phone, tablet and computer, in light and dark mode.** It installs on the home screen and can become an Android APK.

---

## Part 1: Google Sheet

1. Log in to Chrome as **dwarka.agencies10@gmail.com**.
2. Go to **sheets.new** and rename the sheet to **Site Leads**.

> Already made a Site Leads sheet for this link? Use that same sheet and skip to Part 2. The link in `config.js` belongs to the script inside that sheet.

---

## Part 2: Paste the script

1. In the Sheet: **Extensions → Apps Script**.
2. Rename the project (top left) to **Site Leads API**.
3. On the left, under **Files**, there must be only **one** file, **Code.gs**. Delete any other file: click the ⋮ next to it, then **Delete**.
4. Click inside the code, press **Ctrl+A**, then **Delete**.
5. Open **leads-app → apps-script → Code.gs** in Notepad. Press **Ctrl+A** and **Ctrl+C**, go back to Apps Script, and press **Ctrl+V**.
6. Check that line 19 says `const VERSION = '1.0.0';`.
7. Press **Ctrl+S** to save.

---

## Part 3: Run setup

1. In the dropdown next to **▶ Run**, choose **setup**, then click **▶ Run**.
2. The first time, Google asks for permission:
   1. Click **Review permissions** and choose **dwarka.agencies10@gmail.com**.
   2. On "Google hasn't verified this app", click **Advanced → Go to Site Leads API (unsafe)**. It's your own script, so it's safe.
   3. Click **Allow**.
3. Wait for **"✅ Setup complete (version 1.0.0)"** in the log.
4. The Sheet now has 4 tabs: **Leads, Fields, History, Users**.

Running setup again is always safe. It never deletes anything; it only adds what's missing.

| Tab | What it holds |
|---|---|
| Leads | One row per site |
| Fields | The list of columns the app shows (edited from the app's Settings) |
| History | Every change: when, who, which column, old value, new value |
| Users | Names, PINs and roles |

---

## Part 4: Users and PINs

Open the **Users** tab:

| Name | PIN | Role | Active |
|---|---|---|---|
| Divyesh | 1234 | Admin | Yes |
| Member 2 | 2222 | User | No |
| Member 3 | 3333 | User | No |
| Member 4 | 4444 | User | No |
| Member 5 | 5555 | User | No |

1. **Change your PIN** from 1234 to your own secret PIN.
2. For each team member, enter their real name and their own PIN, and set **Active** to **Yes**.

- **Name:** what they type to log in (capitals don't matter). Every name must be different.
- **PIN:** 4 to 6 digits.
- **Role:**
  - **Admin** can add and change columns and delete leads.
  - **User** can add, edit and archive leads.
- **Active = No** blocks someone immediately. Their old entries stay.

After 5 wrong PINs, that name is locked for 15 minutes.

---

## Part 5: Publish the script

> **Already have the link** `…AKfycbx4R7qf…/exec` from this sheet? Don't create another one. Instead:
> 1. Click **Deploy → Manage deployments**, then the **✏️ pencil**.
> 2. Set **Version** to **New version**.
> 3. Click **Deploy**, then go to the check below.

**Only if this is a brand-new sheet:**
1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** Site Leads
   - **Execute as:** **Me** (dwarka.agencies10@gmail.com)
   - **Who has access:** **Anyone**
4. Click **Deploy** (allow permissions if asked), then copy the **Web app URL** ending in `/exec`.
5. If this link is different from the one in `config.js`, put the new link in `config.js` (Part 6, step 5).

**Check:** open the `/exec` link in Chrome. You must see:
`{"ok":true,"version":"1.0.0","message":"Site Leads API is running. ..."}`

> ❗ **Important rule for later:** to update the script, always use **Manage deployments → ✏️ → New version**. "New deployment" creates a **new link**, and the app would keep using the old one.

> **Why "Anyone"?** Phones must reach the script without a Google login. It's still protected: every request needs a valid name and PIN from your Users tab.

---

## Part 6: Put the app on GitHub

Log in to **github.com** as **dwarkaagencies10**.

1. **Repository:**
   - If **https://github.com/dwarkaagencies10/leads** already exists, open it.
   - Otherwise go to **github.com/new**, name it `leads`, choose **Public**, tick **Add a README file**, and click **Create repository**.
2. **Remove old files** (only if the repository has files from earlier attempts): open each old file, click **⋮ → Delete file**, and commit. Or just upload over them; files with the same name are replaced.
3. Unzip **leads-app.zip** and open the **leads-app** folder.
4. In the repository: **Add file → Upload files**. Drag **everything inside** the leads-app folder into the box:
   - `index.html`
   - `config.js`
   - `manifest.json`
   - `sw.js`
   - `icons` (folder)
   - `apps-script` (folder)
   - `README.md`
   - `SETUP.md`

   Then click **Commit changes**.
5. **Check `config.js`:** click it in the repository. The link must be the same `/exec` link you checked in Part 5. If it's different:
   1. Click the **✏️ pencil**.
   2. Replace only the link between the quotes.
   3. Click **Commit changes**.
6. **Turn on the website:** **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, **/ (root)** → **Save**.
7. Wait 2 minutes. Your app is live at **https://dwarkaagencies10.github.io/leads/**

> **Is Public safe?** Yes. GitHub only holds the app's code. Your leads, numbers and photos stay in your private Google Sheet and Drive, and nothing works without a name and PIN.

---

## Part 7: First test (on your computer)

1. Open **https://dwarkaagencies10.github.io/leads/** and log in as **Divyesh** with your PIN.
2. Check that there's **no yellow bar** at the top.
   - "Demo mode" bar → `config.js` is missing or empty on GitHub.
   - "older version" bar → do the ✏️ **New version** step in Part 5.
3. Tap **Add lead**:
   1. Lead Type: tick **Cement** and **RMC**.
   2. Lead Status is already **Open**.
   3. Enter an owner name and a builder name.
   4. Contractor Type: **With Material**.
   5. Tap **Save lead**.
4. The card shows the **builder's** name and a blue **Open** label.
5. Open your Google Sheet → **Leads** tab. The lead is there.
6. Open the lead and tap **Not Converted** in the Status row. It asks why; type a reason and save. The card turns red and shows the reason.
7. Tap the **Not Converted** button at the top of the list. Only that lead shows. Tap it again to see all.
8. Open the lead → **Change history**. All your changes are listed.
9. Scroll down → **Delete permanently** → confirm. The test lead is gone.

All working? Send the app to your team.

---

## Part 8: Install on phones

WhatsApp each person:

> **Site Leads app:** https://dwarkaagencies10.github.io/leads/
> Login name: ______  PIN: ______
> Open in Chrome → ⋮ → "Add to Home screen" (or "Install app").

**Android (Chrome):**
1. Open the link in **Chrome**. From WhatsApp: ⋮ → **Open in Chrome**.
2. Tap ⋮ → **Add to Home screen** / **Install app**.
3. Open it from the **Site Leads** icon and log in. It stays logged in.
4. When asked, allow **Location** and **Camera**.

**iPhone:** open the link in **Safari** → **Share** → **Add to Home Screen**.

**Office computer:** open the link in Chrome. To install it, click the install icon in the address bar.

---

## Part 9: Daily use

**Add a lead at a site:**
1. Tap **Add lead**.
2. Fill what you know; everything except a reason for Not Converted is optional.
3. Tap **Capture location** while standing at the site. If it says it's accurate only to 80 m or more, step into the open and tap **Capture again**.
4. Tap **Take photo** or **From gallery**.
5. Tap **Save lead**.

If the form is closed by mistake, what you typed is kept for next time.

**Name on the card:**

| Contractor Type | Card shows | Call button calls |
|---|---|---|
| With Material | Builder name | Builder |
| Without Material | Owner name | Owner |
| Not chosen | Owner name (or Builder if there's no owner) | That person |

**Lead Status:**
- New leads are **Open**.
- To change the status, open the lead and tap **Open / Converted / Not Converted** in the Status row, or use Edit.
- **Not Converted** always asks *"Why not converted?"*, and you can't save without an answer.
- If a lead moves back to Open or Converted, the reason is cleared from the lead (it stays in the history).
- Card colours: **blue = Open, green = Converted, red = Not Converted** (with the reason shown).

**Status buttons at the top:**
- Tap **Open**, **Converted** or **Not Converted** to see only those leads.
- Tap several to combine them, and tap again to unselect.
- **None selected = all leads.**
- This works in both Cards and List view and is remembered.

**Finding leads:**
- **Search** looks in every column.
- **Filter** works by Lead Type, Site Status, Contractor Type, Project, Vendor and follow-up.
- **Sort** by newest, oldest, follow-up date, recently updated or name.
- In List view, click a column heading to sort, and click again to reverse.

**Follow-ups:** the red "overdue" and yellow "due today" chips count **Open** leads only. Tap a chip to see those leads.

**Create, view, update, delete:**

| Action | How | Who |
|---|---|---|
| Create | **Add lead** → **Save lead** | Everyone |
| View | Tap a card or row | Everyone |
| Update | Open → **Edit** → **Save lead** | Everyone |
| Archive (can undo) | Open → **Archive this lead**. To bring it back: Filter → **Show archived leads** → **Restore** | Everyone |
| Delete | Open → **Delete permanently** | Admin only |

When a lead is deleted, a full copy is kept in the History tab, its photos stay in Drive, and its number is never reused.

**Export:** ⋮ → **Export to Excel (CSV)**. It exports the leads currently shown.

---

## Part 10: Add or change columns (Admin)

⋮ → **Columns and settings**.

**Add a column**, e.g. Site Engineer:
1. Name: `Site Engineer Name`, Type: **Short text**, Section: `Site Engineer`. Tick **Show on cards** → **Add column**.
2. Name: `Site Engineer Number`, Type: **Phone number**, same section → **Add column**.

It appears straight away in the form, cards, list, search, filters and export, and at the end of the Leads tab.

| Type | For |
|---|---|
| Short text | Names, short details |
| Long text / notes | Remarks |
| Phone number | Call and WhatsApp buttons, plus the duplicate check |
| Number | Quantities |
| Date | Dates |
| Picklist (pick one) | e.g. With / Without Material |
| Multi-select (pick several) | e.g. Lead Type |
| Picklist + add new | e.g. Vendor (people can add new ones) |
| GPS location | Capture-location button |
| Photos | Camera and gallery |

**Change a column:** tap it in the list. You can change:
- the section
- the choices (one per line; e.g. add `Steel` to Lead Type)
- **Allow more than one choice**
- whether it shows on cards or in the list
- whether it's required
- whether it's hidden (data is kept)

Use ↑ ↓ to change the order.

> Don't rename or delete column headings directly in the Leads tab.

---

## Part 11: Updating later

**New Code.gs:**
1. Paste it into Apps Script and save.
2. Run **setup**.
3. **Deploy → Manage deployments → ✏️ → New version → Deploy.**
4. Check the `/exec` link shows the new version.

**New app files:** upload them to the GitHub repository (they replace the old ones) and commit. Phones update the next time the app opens; close and reopen it if needed.

**If the script link ever changes:** edit only **`config.js`** on GitHub (✏️ → replace the link → Commit). Nothing else needs changing.

---

## Part 12: Android APK (optional, later)

1. Go to **pwabuilder.com**, paste **https://dwarkaagencies10.github.io/leads/**, and click **Start**.
2. **Package for stores → Android → Generate Package**.
   - Package ID: `com.dwarkaagencies.siteleads`
   - App name: Site Leads
3. Unzip the result:
   - **`app-release-signed.apk`**: send it on WhatsApp. On the phone, tap it → allow install → **Install**. If Play Protect warns, choose **Install anyway**.
   - **`signing.keystore`** and **`signing-key-info.txt`**: ⚠️ keep them safe (Drive and a pen drive). You need them for future APK updates.
4. App changes on GitHub reach APK users automatically. No new APK is needed.
5. **Optional, removes the address bar inside the APK:**
   1. Create a public repository named exactly **`dwarkaagencies10.github.io`**.
   2. Add an empty file named `.nojekyll`.
   3. Add a file named `.well-known/assetlinks.json` with the contents of `assetlinks.json` from the PWABuilder zip.
   4. Turn on Pages (main / root).

iPhones can't install APKs; iPhone users use the home-screen version.

---

## Part 13: Backups and safety

- **File → Version history** in the Sheet restores any earlier state.
- Monthly: **File → Make a copy**, or export to Excel from the app.
- Photos are in Drive → **Site Leads Photos**, named like `Lead-12_1.jpg`. Each is about 250 KB.
- Only dwarka.agencies10@gmail.com should open the Sheet. Don't share it.
- Lost phone or someone leaves: set **Active = No** in the Users tab.

---

## Troubleshooting

| What you see | What to do |
|---|---|
| Yellow bar: **"Demo mode"** | `config.js` isn't on GitHub or its link is empty. Upload it or add the link (Part 6). |
| Yellow bar: **"The Google script is running …, but this app needs 1.0.0"** | Apps Script → **Manage deployments → ✏️ → New version → Deploy** (Part 5). |
| **"The server did not answer properly"** | The link in `config.js` is wrong, or "Who has access" isn't **Anyone**. Open the link and check it shows `"ok":true`. |
| **"Wrong name or PIN."** | Check the Users tab (spelling and spaces). |
| **"Too many wrong PIN attempts"** | Wait 15 minutes. |
| **"This user is not active"** | Set Active = **Yes**. |
| **"The Leads tab is missing"** | Rename the tab back exactly, or run **setup**. |
| **"Please enter the reason why this lead was not converted"** | Type the reason in "Why not converted?" and save. |
| **GitHub page shows 404** | Wait 2 minutes. Check that `index.html` is at the top level and the repository is named `leads`. |
| **Location blocked** | Phone Settings → Apps → Chrome / Site Leads → Permissions → Location → Allow. Turn on GPS. |
| **Camera doesn't open** | Same place → Camera → Allow, or use **From gallery**. |
| **Changes don't show on a phone** | Close and reopen the app (twice if needed), or tap ↻. |
| **Saving takes 2–3 seconds** | Normal: every save goes to Google and back. |

**Where to see versions:** ⋮ → **Columns and settings → About** shows the app version and the Google script version.
