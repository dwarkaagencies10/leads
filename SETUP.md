# Site Leads: setup guide for Dwarka Agencies

This guide is written for **your** accounts and links. Follow the parts in order, on a computer with Chrome.

**Cost:** ₹0. Everything runs on free Google and GitHub accounts.

---

## Your details (keep this page safe)

| What | Yours |
|---|---|
| Google account (owns the Sheet, script and photos) | **dwarka.agencies10@gmail.com** |
| GitHub username | **dwarkaagencies10** |
| GitHub repository (the app's code) | **https://github.com/dwarkaagencies10/leads** |
| **App link (send this to your team)** | **https://dwarkaagencies10.github.io/leads/** |
| Google connector link (Web App URL) | `https://script.google.com/macros/s/AKfycbykwzkgAYv3FvwgGn5JxzH21G-eK7aUJ4UKbQ09SK0ETSwzX8oWIgE5RJVJcmvqKw/exec` |
| Admin login name | **Divyesh** (you can rename it in the Users tab) |

✅ The connector link is **already inside `index.html`**, so you don't need to edit any code.

## Where you are now

| Step | Status |
|---|---|
| Part 1–3: Google Sheet, script, setup | Done (check Part 3 once) |
| Part 4: Users and PINs | Check |
| Part 5: Publish script (Web App) | ✅ Done (link above) |
| Part 6: Put the app on GitHub | **To do next** |
| Part 7: First test | To do |
| Part 8: Install on phones | To do |
| Part 12: Android APK | Optional, later |

---

## What you are building

| Piece | What it does | Where it lives |
|---|---|---|
| **Google Sheet "Site Leads"** | Stores every lead, the list of columns, the change history and the users | Google Drive of dwarka.agencies10@gmail.com (private) |
| **Apps Script "Site Leads API"** | The connector between the app and the Sheet; it also saves photos to Drive | Inside the Google Sheet |
| **Drive folder "Site Leads Photos"** | Stores site photos | Same Google Drive |
| **The app** | What your team uses on phone and computer | https://dwarkaagencies10.github.io/leads/ |

Your team **never** opens the Google Sheet. They only use the app, with their name and PIN.

---

## Part 1: Create the Google Sheet

*(Skip if you already have it.)*

1. Log in to Chrome as **dwarka.agencies10@gmail.com**.
2. Go to **sheets.new**.
3. Rename "Untitled spreadsheet" to **Site Leads**.

---

## Part 2: Add the script to the Sheet

1. In the Sheet: **Extensions → Apps Script**.
2. Rename "Untitled project" to **Site Leads API**.
3. In **Code.gs**, press **Ctrl+A** then **Delete**, so the editor is empty.
4. On your computer, open **leads-app → apps-script → Code.gs** in Notepad. Press **Ctrl+A**, then **Ctrl+C**.
5. Paste it into the Apps Script editor (**Ctrl+V**) and save (**Ctrl+S**).

---

## Part 3: Run setup, and check you have the latest script

1. In the dropdown next to **▶ Run**, choose **setup**, then click **▶ Run**.
2. The first time, Google asks for permission:
   1. Click **Review permissions** and choose **dwarka.agencies10@gmail.com**.
   2. On "Google hasn't verified this app", click **Advanced → Go to Site Leads API (unsafe)**. This is your own script, so it's safe.
   3. Click **Allow**.
3. The log at the bottom should say **"✅ Setup complete (version 2.0.0)"**.
4. The Sheet now has 4 tabs: **Leads, Fields, History, Users**.

### ⚠️ Important: is your script the latest version?

You deployed your script before this final version was ready. Do this check once:

1. In Apps Script, press **Ctrl+F** and search for `VERSION = '2.0.0'`.
2. **If it's found:** you're up to date. Go to Part 4.
3. **If it's not found:**
   1. Replace all the code with the new **Code.gs** (Part 2, steps 3–5) and save.
   2. Run **setup** again. It never deletes data; it only adds or upgrades what's missing, such as turning Lead Type into multi-select.
   3. Update the live version **without changing your link**: go to **Deploy → Manage deployments**, click the ✏️ pencil, set **Version** to **New version**, and click **Deploy**.

> ❗ Never use **Deploy → New deployment** again. That creates a **new** link, and the app (which uses your current link) would stop working. Always use **Manage deployments → ✏️ → New version**.

**How to check from anywhere:** open your connector link in Chrome. You should see:
`{"ok":true,"version":"2.0.0","message":"Site Leads API is running. ..."}`
- If you see `"version":"2.0.0"`, everything is correct.
- If there's no version, the old script is still live: do step 3 above.

### What each tab is

- **Leads:** one row per site. Read it any time; let the app do the writing.
- **Fields:** the list of columns the app shows. The app's Settings screen edits this.
- **History:** every change: when, who, which column, old value, new value.
- **Users:** names, PINs and roles.

---

## Part 4: Set up your users

Open the **Users** tab:

| Name | PIN | Role | Active |
|---|---|---|---|
| Divyesh | 1234 | Admin | Yes |
| Member 2 | 2222 | User | No |
| Member 3 | 3333 | User | No |
| Member 4 | 4444 | User | No |
| Member 5 | 5555 | User | No |

1. **Change your PIN** from 1234 to your own secret PIN.
2. For each team member, put their real name and their own PIN, and set **Active** to **Yes**.

Rules:
- **Name:** what they type to log in (capitals don't matter). Every name must be different, e.g. "Rahul S" and "Rahul K".
- **PIN:** 4 to 6 digits; 6 is safer.
- **Role:**
  - `Admin` can add and change columns and permanently delete leads.
  - `User` can add, edit and archive leads.
  - Keep yourself as the only Admin.
- **Active:** `No` blocks a person immediately (lost phone, left the job). Their old entries stay.

Add more rows any time for more people. After 5 wrong PINs, that name is blocked for 15 minutes.

---

## Part 5: Publish the script ✅ done

Your connector link:
`https://script.google.com/macros/s/AKfycbykwzkgAYv3FvwgGn5JxzH21G-eK7aUJ4UKbQ09SK0ETSwzX8oWIgE5RJVJcmvqKw/exec`

Check that it was published with these settings: **Deploy → Manage deployments** →
- **Execute as:** Me (dwarka.agencies10@gmail.com)
- **Who has access:** **Anyone**

If "Who has access" is anything else, click ✏️, change it to **Anyone**, set **Version** to **New version**, then **Deploy**.

> **Why "Anyone"?** Phones must reach the script without a Google login. It's still protected: every request needs a valid name and PIN from your Users tab.

---

## Part 6: Put the app online (GitHub Pages)

Log in to **github.com** as **dwarkaagencies10**.

### 6a. Create the repository

1. Go to **https://github.com/new**.
2. **Repository name:** `leads`. Use exactly this, in small letters, because it becomes part of your app link.
3. Choose **Public**. Free hosting needs a public repository.
4. Tick **Add a README file**.
5. Click **Create repository**.

> **Is Public safe?** Yes. The repository holds only the app's code. Your leads, phone numbers and photos stay in your private Google Sheet and Drive, and nothing works without a name and PIN.

### 6b. Upload the app files

1. Unzip **leads-app.zip** on your computer and open the **leads-app** folder.
2. Go to **https://github.com/dwarkaagencies10/leads** → **Add file → Upload files**.
3. Select **everything inside** the leads-app folder and drag it into the upload box:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icons` (folder)
   - `apps-script` (folder)
   - `SETUP.md`
   - `README.md`
4. When the uploads finish, click **Commit changes**. If GitHub says a README already exists, it simply replaces it.
5. **Check:** the repository's main page must show `index.html` directly, not inside a "leads-app" folder.

### 6c. Turn on the website

1. In the repository, click **Settings** → **Pages** (left menu).
2. **Source:** Deploy from a branch.
3. **Branch:** `main`, folder **/ (root)**, then click **Save**.
4. Wait 2 minutes and refresh. It says: **"Your site is live at https://dwarkaagencies10.github.io/leads/"**

**That's your app.** 🎉

---

## Part 7: First test (on your computer)

1. Open **https://dwarkaagencies10.github.io/leads/**.
2. Log in as **Divyesh** with your PIN.
3. Check:
   - There's **no yellow "Demo mode" bar**, which means it's connected to your Sheet.
   - There's **no "older version" warning bar**. If you see one, do the check in Part 3.
4. Tap **Add lead**:
   1. Tick Lead Type **Cement** and **RMC**.
   2. Enter an owner name and a builder name.
   3. Choose Contractor Type **With Material**.
   4. Tap **Save lead**.
5. The card should show the **builder's** name (With Material → Builder).
6. Open your Google Sheet → **Leads** tab. The lead is there.
7. Open the lead → **Edit** → change Contractor Type to **Without Material** → **Save lead**. The card now shows the **owner's** name.
8. Open the lead → **Change history**. Your change is listed. It's also in the Sheet's **History** tab.
9. Scroll down in the lead → **Delete permanently** → confirm. The test lead disappears.

All working? Your app is ready for the team.

---

## Part 8: Install on your team's phones

Send each person this on WhatsApp, with their own name and PIN:

> **Site Leads app:** https://dwarkaagencies10.github.io/leads/
> Login name: ______  PIN: ______
> Open the link in Chrome → tap ⋮ → "Add to Home screen" (or "Install app").

### Android (Chrome)

1. Open the link in **Chrome**. If WhatsApp opens it inside itself, tap ⋮ → **Open in Chrome**.
2. Tap ⋮ → **Add to Home screen** or **Install app** → **Install**.
3. The **Site Leads** icon (yellow pin) appears on the home screen. Always open the app from this icon.
4. Log in with name and PIN. It stays logged in.
5. The first time someone taps:
   - **Capture location**, they tap **Allow / While using the app**.
   - **Take photo**, they tap **Allow**.

### iPhone (Safari)

1. Open the link in **Safari**.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Open it from the icon and log in.

### Office computer

Open the same link in Chrome. To install it, click the install icon at the right end of the address bar.

---

## Part 9: Daily use

**Add a lead at a site:**
1. Tap **Add lead**.
2. Fill what you know. Anything can be left empty and added later.
3. Tap **Capture location** while standing at the site. If it says it's accurate only to 80 m or more, step into the open and tap **Capture again**.
4. Tap **Take photo** or **From gallery**. Add as many photos as you need.
5. Tap **Save lead**. Everyone sees it right away.

If the form is closed by mistake (or the phone dies), what you typed is kept. Tapping **Add lead** again continues from there.

**Which name shows on a card:** it depends on **Contractor Type**.

| Contractor Type | Name on card | Call button calls |
|---|---|---|
| **With Material** | Builder name | Builder |
| **Without Material** | Owner name | Owner |
| Not selected | Owner name (or the Builder name if there's no owner) | That person |

A small "Builder" or "Owner" tag shows which one it is. The other person still appears in the card's contact list.

**Lead Type** is multi-select: tap all that apply (**Cement, Electrical, RMC, BPD**), and tap again to unselect. Filtering by RMC shows every lead that includes RMC.

**Create, view, update, delete:**

| Action | How | Who |
|---|---|---|
| Create | **Add lead** → fill → **Save lead** | Everyone |
| View | Tap a card (or a row in List view) | Everyone |
| Update | Open lead → **Edit** → change → **Save lead** | Everyone |
| Archive (hide, can undo) | Open lead → scroll down → **Archive this lead**. To bring it back: Filter → **Show archived leads** → open it → **Restore this lead** | Everyone |
| Delete permanently | Open lead → scroll down → **Delete permanently** → confirm | Admin only |

When a lead is deleted:
- It disappears for everyone, and its row is removed from the Leads tab.
- A full copy is kept in the **History** tab (Action = "Deleted"; the Old Value column holds all its details).
- Its photos stay in Drive.
- Its Sr. No. is never reused.

Use **Archive** for lost or finished leads, and **Delete** for duplicates and test entries.

**Finding leads:**
- **Search** looks in every column: names, numbers, address, vendor, remark.
- **Filter** by Lead Type, Site Status, Contractor Type, Project, Vendor, or follow-up (Overdue / Today / Next 7 days).
- **Sort** by newest, oldest, follow-up date, recently updated, or name A–Z (the name shown on the card). In List view, click any column heading to sort, and click again to reverse.
- **Cards / List:** switch at the top. Phones open in Cards, computers in List.
- The red **overdue** and yellow **due today** chips show follow-ups not to miss. Tap one to see just those leads.

**On a lead's screen:** Call, WhatsApp, Directions (Google Maps navigation to the site), call and WhatsApp buttons on every number, and tap a photo to see it full size.

**Export to Excel:** ⋮ menu → **Export to Excel (CSV)**. It exports the leads currently shown, after your search and filters.

---

## Part 10: Adding a new column (Admin only)

Example: **Site Engineer Name** and **Site Engineer Number**.

1. In the app: ⋮ menu → **Columns and settings**.
2. Under **Add a new column**:
   - **Column name:** `Site Engineer Name`
   - **Type:** Short text
   - **Section:** type `Site Engineer` (this creates a new section)
   - Tick **Show on cards** if you want it on the cards.
3. Tap **Add column**.
4. Repeat for `Site Engineer Number` with Type **Phone number** and the same section.

The new column appears straight away in the form, cards, list, search, filters and Excel export. Others may need to tap ↻ once. It's also added at the right end of the **Leads** tab.

| Type | Use it for |
|---|---|
| Short text | Names, short details |
| Long text / notes | Remarks, descriptions |
| Phone number | Gets call and WhatsApp buttons, plus the duplicate check |
| Number | Quantities, e.g. bags per month |
| Date | Any date (date picker) |
| Picklist (pick one) | Buttons where only one can be chosen, e.g. With Material / Without Material |
| Multi-select (pick several) | Buttons where several can be chosen, e.g. Lead Type |
| Picklist + add new | A dropdown where people can add a new choice, e.g. Vendor |
| GPS location | Capture-location button |
| Photos | Camera and gallery button |

**Changing an existing column:** tap it in the list. You can change:
- its section
- its choices (one per line). For example, add `Steel` to Lead Type.
- **Allow more than one choice** (pick-one ↔ multi-select)
- whether it shows on cards or in the list
- whether it's required
- whether it's hidden

Use ↑ ↓ to change the order.

**Hiding vs deleting columns:** columns are only hidden, never deleted, so old data stays safe.

> ⚠️ Don't rename or delete column headings in the Leads tab directly, or that column's data stops showing in the app. If you really must rename a column, change it in **both** the Fields tab (Label) and the Leads tab (heading), spelled exactly the same.

---

## Part 11: Updating later

### When you get a new Code.gs

1. Apps Script → replace all the code → **Save**.
2. Run **setup** once (it's always safe).
3. **Deploy → Manage deployments → ✏️ → Version: New version → Deploy.**
4. Open your connector link and check the version number.

Never use "New deployment", because it changes your link.

### When you get a new index.html (or other app files)

1. Go to **https://github.com/dwarkaagencies10/leads** → **Add file → Upload files**.
2. Upload the new files. Files with the same name are replaced.
3. Click **Commit changes**.
4. The website updates within 1–2 minutes. Phones get it the next time the app opens (sometimes it takes closing and reopening it twice).

Files I send you will always already contain your connector link. If you edit the app yourself, also change the version in `sw.js` (e.g. `site-leads-v2.0.0` → `site-leads-v2.0.1`) so phones pick up the change.

---

## Part 12: Make an Android APK (optional, later)

The APK is a wrapper around your app link, so updates on GitHub reach APK users automatically.

### 12a. Create the APK

1. Go to **pwabuilder.com**.
2. Paste **https://dwarkaagencies10.github.io/leads/** and click **Start**.
3. Click **Package for stores → Android → Generate Package**.
   - **Package ID:** `com.dwarkaagencies.siteleads`
   - **App name:** Site Leads
   - Leave the rest as default.
4. Download and unzip the result. Inside:
   - **`app-release-signed.apk`**: the file you install.
   - **`signing.keystore`** and **`signing-key-info.txt`**: ⚠️ **keep these safe** (Google Drive and a pen drive). You need them to make updated APKs; without them every phone would have to uninstall and reinstall.
   - **`assetlinks.json`**: used in 12c.

### 12b. Install the APK

1. Send `app-release-signed.apk` on WhatsApp (as a document).
2. On the phone, tap it → allow **Install from this source** → **Install**.
3. If **Play Protect** warns, tap **More details → Install anyway**. That's normal for private apps.
4. Open **Site Leads** and log in.

### 12c. Remove the address bar in the APK (optional)

1. On GitHub, create a new **Public** repository named exactly **`dwarkaagencies10.github.io`**, with a README.
2. In it, **Add file → Create new file**: name it `.nojekyll`, leave it empty, and click **Commit**.
3. **Add file → Create new file**:
   1. Name it `.well-known/assetlinks.json`.
   2. Paste in the contents of `assetlinks.json` from the PWABuilder zip.
   3. Click **Commit**.
4. **Settings → Pages** → Deploy from branch → **main** / root → **Save**.
5. After 2 minutes, check that **https://dwarkaagencies10.github.io/.well-known/assetlinks.json** shows the text.
6. Reopen the APK. The address bar is gone.

> iPhones can't install APKs. iPhone users keep using the home-screen version (Part 8).

---

## Part 13: Backups and safety

- **Sheet history:** **File → Version history** restores any earlier state.
- **Monthly backup:** **File → Make a copy**, or use the app's **Export to Excel**.
- **Photos** are in the Drive folder **"Site Leads Photos"**, named like `Lead-12_1.jpg`. Each is about 250 KB, so the free 15 GB holds about 50,000 photos.
- **Who can see what:**
  - Only dwarka.agencies10@gmail.com can open the Sheet. Don't share it with the team.
  - Photos are viewable only by someone who has the exact link, which appears only inside the app.
- **Lost phone or someone leaves:** set **Active = No** in the Users tab.
- **Change a PIN:** edit the Users tab. That person logs in again.

---

## Troubleshooting

| What you see | What to do |
|---|---|
| **"Wrong name or PIN."** | Check the spelling in the Users tab (spaces count) and the PIN. |
| **"Too many wrong PIN attempts"** | Wait 15 minutes. |
| **"This user is not active"** | Set Active = **Yes** in the Users tab. |
| **Yellow bar: "The Google script is an older version"** | Do the check in Part 3 (update Code.gs → New version). |
| **"The server did not answer properly"** | Manage deployments → check **Who has access = Anyone**. Open your connector link and check it shows `"ok":true`. |
| **"No internet connection"** | Check mobile data. Saved leads still show; saving needs internet. |
| **"The Leads tab is missing. Run setup()"** | A tab was renamed or deleted. Rename it back exactly (Leads, Fields, History, Users) or run **setup**. |
| **The app shows "Demo mode"** | An old `index.html` is on GitHub. Upload the one from the latest zip (it contains your link). |
| **GitHub page shows "404"** | Wait 2 minutes after turning on Pages. Check that `index.html` is at the top level of the repository and the repository name is exactly `leads`. |
| **"Location is blocked"** | Phone Settings → Apps → Chrome (or Site Leads) → Permissions → Location → Allow. Turn on GPS. |
| **Location is inaccurate** | Step out from under the slab or roof, wait 10 seconds, and tap Capture again. |
| **Camera doesn't open** | Phone Settings → Apps → Chrome (or Site Leads) → Permissions → Camera → Allow. Or use **From gallery**. |
| **Photos show as grey boxes** | Wait a few seconds and check the internet. |
| **Changes don't show on phones** | Close and reopen the app twice. |
| **Saving takes 2–3 seconds** | Normal: every save goes to Google and back. |

---

## Limits

- Google's free limits are far beyond what 5–10 people need.
- A Sheet holds about 300,000 leads with these columns.
- Saving needs internet. Viewing the last loaded leads works with a weak signal.
