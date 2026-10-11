/******************************************************************
 *  SITE LEADS — Backend (Google Apps Script)
 *
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete everything in Code.gs and paste this whole file
 *  3. Select the function  setup  at the top and press ▶ Run (once)
 *  4. Deploy → New deployment → Web app
 *       Execute as: Me      Who has access: Anyone
 *  5. Copy the Web app URL into the app (index.html → API_URL)
 *
 *  UPDATING from an older version: paste this file, Save, run  setup
 *  once more (it only adds/upgrades what's missing, never deletes data),
 *  then Deploy → Manage deployments → ✏️ → Version: New version → Deploy.
 *
 *  Full step-by-step guide: SETUP.md
 ******************************************************************/

const VERSION = '2.1.0';
const TZ = 'Asia/Kolkata';

const LEADS = 'Leads';
const FIELDS = 'Fields';
const HISTORY = 'History';
const USERS = 'Users';

const SYS = {
  SR: 'Sr. No.',
  CREATED_AT: 'Created At',
  CREATED_BY: 'Created By',
  UPDATED_AT: 'Updated At',
  UPDATED_BY: 'Updated By',
  ARCHIVED: 'Archived'
};
const SYSTEM_COLUMNS = [SYS.SR, SYS.CREATED_AT, SYS.CREATED_BY, SYS.UPDATED_AT, SYS.UPDATED_BY, SYS.ARCHIVED];

const FIELD_HEADERS = ['Label', 'Type', 'Section', 'Options', 'On Card', 'In List', 'Required', 'Order', 'Active'];
const HISTORY_HEADERS = ['Timestamp', 'Sr. No.', 'User', 'Action', 'Field', 'Old Value', 'New Value'];
const USER_HEADERS = ['Name', 'PIN', 'Role', 'Active'];
const FIELD_TYPES = ['text', 'longtext', 'phone', 'number', 'date', 'picklist', 'multiselect', 'picklist_custom', 'gps', 'photos'];
const LEAD_TYPES = 'Cement, Electrical, RMC, BPD';
const PHOTO_FOLDER = 'Site Leads Photos';

// Lead Status: every new lead starts as the first option (Open).
// "Not Converted" needs a reason; the reason is cleared for any other status.
const LSTATUS = 'Lead Status';
const REASON = 'Not Converted Reason';
const LEAD_STATUSES = 'Open, Converted, Not Converted';
function isNotConverted_(v) { return /not\s*converted/i.test(String(v || '')); }

const STAGES = 'Excavation, Foundation, Plinth, Structure, Brickwork, Plastering, Finishing, Completed, On Hold';

// Label, Type, Section, Options, On Card, In List, Required
const DEFAULT_FIELDS = [
  ['Date', 'date', 'Lead', '', 'No', 'Yes', 'No'],
  ['Lead Type', 'multiselect', 'Lead', LEAD_TYPES, 'Yes', 'Yes', 'No'],
  [LSTATUS, 'picklist', 'Lead', LEAD_STATUSES, 'Yes', 'Yes', 'No'],
  [REASON, 'longtext', 'Lead', '', 'Yes', 'Yes', 'No'],
  ['Site Address', 'longtext', 'Site', '', 'Yes', 'Yes', 'No'],
  ['Location', 'gps', 'Site', '', 'Yes', 'Yes', 'No'],
  ['Photos', 'photos', 'Site', '', 'Yes', 'Yes', 'No'],
  ['Owner Name', 'text', 'Owner', '', 'Yes', 'Yes', 'No'],
  ['Owner Number', 'phone', 'Owner', '', 'Yes', 'Yes', 'No'],
  ['Owner Office Address', 'text', 'Owner', '', 'No', 'Yes', 'No'],
  ['Builder Name', 'text', 'Builder', '', 'Yes', 'Yes', 'No'],
  ['Builder Number', 'phone', 'Builder', '', 'Yes', 'Yes', 'No'],
  ['Builder Office Address', 'text', 'Builder', '', 'No', 'Yes', 'No'],
  ['Architect Name', 'text', 'Architect', '', 'Yes', 'Yes', 'No'],
  ['Architect Number', 'phone', 'Architect', '', 'Yes', 'Yes', 'No'],
  ['Architect Office Address', 'text', 'Architect', '', 'No', 'Yes', 'No'],
  ['Contractor Name', 'text', 'Contractor', '', 'Yes', 'Yes', 'No'],
  ['Contractor Number', 'phone', 'Contractor', '', 'Yes', 'Yes', 'No'],
  ['Contractor Type', 'picklist', 'Contractor', 'With Material, Without Material', 'Yes', 'Yes', 'No'],
  ['Project', 'picklist_custom', 'Project', 'G+1, G+2, G+3, G+4, G+5, B+G+3, 2B+G+5', 'Yes', 'Yes', 'No'],
  ['Site Status', 'picklist', 'Project', STAGES, 'Yes', 'Yes', 'No'],
  ['Current Usage', 'text', 'Project', '', 'Yes', 'Yes', 'No'],
  ['Vendor', 'picklist_custom', 'Project', '', 'Yes', 'Yes', 'No'],
  ['Follow-up Date', 'date', 'Follow-up', '', 'Yes', 'Yes', 'No'],
  ['Remark', 'longtext', 'Follow-up', '', 'Yes', 'Yes', 'No']
];

/* ================================================================
 *  ONE-TIME SETUP  — select "setup" and press ▶ Run
 * ================================================================ */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);

  // Fields tab (the list of columns the app shows)
  let f = ss.getSheetByName(FIELDS);
  if (!f) {
    f = ss.insertSheet(FIELDS);
    f.getRange(1, 1, f.getMaxRows(), FIELD_HEADERS.length).setNumberFormat('@');
    f.getRange(1, 1, 1, FIELD_HEADERS.length).setValues([FIELD_HEADERS]).setFontWeight('bold');
    const rows = DEFAULT_FIELDS.map(function (r, i) {
      return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], String((i + 1) * 10), 'Yes'];
    });
    f.getRange(2, 1, rows.length, FIELD_HEADERS.length).setValues(rows);
    f.setFrozenRows(1);
  } else {
    // Upgrade from version 1: Lead Type becomes multi-select with Cement, Electrical, RMC, BPD
    const rows = f.getDataRange().getDisplayValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === 'Lead Type' && String(rows[i][1]).trim() === 'picklist') {
        const have = splitOptions_(rows[i][3]);
        const want = splitOptions_(LEAD_TYPES);
        const merged = want.concat(have.filter(function (o) { return want.indexOf(o) < 0; }));
        f.getRange(i + 1, 2).setValue('multiselect');
        f.getRange(i + 1, 4).setNumberFormat('@').setValue(merged.join(', '));
        Logger.log('Upgraded "Lead Type" to multi-select: ' + merged.join(', '));
      }
    }
    // Upgrade: add any standard column that's missing (e.g. Lead Status in 2.1),
    // placed right after the column it follows in the standard list
    const have = {};
    rows.slice(1).forEach(function (r) { have[String(r[0]).trim()] = Number(r[7]) || 0; });
    DEFAULT_FIELDS.forEach(function (d, i) {
      if (have[d[0]] !== undefined) return;
      let order = 5;
      for (let j = i - 1; j >= 0; j--) if (have[DEFAULT_FIELDS[j][0]] !== undefined) { order = have[DEFAULT_FIELDS[j][0]] + 1; break; }
      have[d[0]] = order;
      const r = f.getLastRow() + 1;
      ensureRows_(f, r);
      f.getRange(r, 1, 1, FIELD_HEADERS.length).setNumberFormat('@').setValues([[d[0], d[1], d[2], d[3], d[4], d[5], d[6], String(order), 'Yes']]);
      Logger.log('Added column "' + d[0] + '"');
    });
  }

  // Leads tab (your lead register)
  let l = ss.getSheetByName(LEADS);
  if (!l) {
    l = ss.insertSheet(LEADS, 0);
    const labels = DEFAULT_FIELDS.map(function (r) { return r[0]; });
    const headers = [SYS.SR].concat(labels, SYSTEM_COLUMNS.slice(1));
    if (l.getMaxColumns() < headers.length) l.insertColumnsAfter(l.getMaxColumns(), headers.length - l.getMaxColumns());
    l.getRange(1, 1, l.getMaxRows(), l.getMaxColumns()).setNumberFormat('@');
    l.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#fff4e6');
    l.setFrozenRows(1);
    l.setFrozenColumns(1);
  }

  // Make sure every standard column exists in Leads, and old leads get the default status (Open)
  const lh = ensureHeaders_(l, SYSTEM_COLUMNS.concat(DEFAULT_FIELDS.map(function (r) { return r[0]; })));
  if (l.getLastRow() > 1) {
    const sc = lh.indexOf(LSTATUS), srC = lh.indexOf(SYS.SR);
    const vals = l.getRange(2, 1, l.getLastRow() - 1, lh.length).getDisplayValues();
    const out = vals.map(function (v) { return [String(v[srC]).trim() && !String(v[sc]).trim() ? defaultStatus_() : v[sc]]; });
    l.getRange(2, sc + 1, out.length, 1).setNumberFormat('@').setValues(out);
  }

  // History tab (who changed what)
  let h = ss.getSheetByName(HISTORY);
  if (!h) {
    h = ss.insertSheet(HISTORY);
    h.getRange(1, 1, h.getMaxRows(), HISTORY_HEADERS.length).setNumberFormat('@');
    h.getRange(1, 1, 1, HISTORY_HEADERS.length).setValues([HISTORY_HEADERS]).setFontWeight('bold');
    h.setFrozenRows(1);
  }

  // Users tab (names and PINs)
  let u = ss.getSheetByName(USERS);
  if (!u) {
    u = ss.insertSheet(USERS);
    u.getRange(1, 1, u.getMaxRows(), USER_HEADERS.length).setNumberFormat('@');
    u.getRange(1, 1, 1, USER_HEADERS.length).setValues([USER_HEADERS]).setFontWeight('bold');
    u.getRange(2, 1, 5, USER_HEADERS.length).setValues([
      ['Divyesh', '1234', 'Admin', 'Yes'],
      ['Member 2', '2222', 'User', 'No'],
      ['Member 3', '3333', 'User', 'No'],
      ['Member 4', '4444', 'User', 'No'],
      ['Member 5', '5555', 'User', 'No']
    ]);
    u.setFrozenRows(1);
  }

  // Remove the empty default tab
  ['Sheet1', 'Sheet 1'].forEach(function (n) {
    const s = ss.getSheetByName(n);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  const folder = photoFolder_();
  Logger.log('✅ Setup complete (version ' + VERSION + '). Photos folder: ' + folder.getUrl());
  Logger.log('Next: change PINs in the Users tab, then Deploy → New deployment → Web app.');
  return 'Setup complete';
}

/* ================================================================
 *  WEB ENDPOINTS
 * ================================================================ */
function doGet() {
  return json_({ ok: true, version: VERSION, message: 'Site Leads API is running. Open the app link to use it.' });
}

function doPost(e) {
  let out;
  try {
    const req = JSON.parse(e.postData.contents);
    const user = auth_(req.auth);
    out = { ok: true, data: route_(req, user) };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err), code: (err && err.code) || '' };
  }
  return json_(out);
}

function route_(req, user) {
  switch (req.action) {
    case 'login':       return { user: user };
    case 'getAll':      return { user: user, version: VERSION, fields: getFields_(), leads: getLeads_() };
    case 'saveLead':    return saveLead_(req.sr, req.changes || {}, req.photos || {}, user);
    case 'archive':     return setArchived_(req.sr, !!req.archived, user);
    case 'deleteLead':  requireAdmin_(user, 'Only the admin can delete leads. You can archive it instead.'); return deleteLead_(req.sr, user);
    case 'uploadPhoto': return uploadPhoto_(req.data, user);
    case 'getPhoto':    return getPhoto_(req.id);
    case 'history':     return { history: getHistory_(req.sr) };
    case 'addField':    requireAdmin_(user); return addField_(req.field || {}, user);
    case 'updateField': requireAdmin_(user); return updateField_(req.label, req.patch || {}, user);
    case 'reorderFields': requireAdmin_(user); return reorderFields_(req.labels || []);
    default: throw new Error('Unknown action: ' + req.action);
  }
}

/* ================================================================
 *  LOGIN
 * ================================================================ */
function auth_(a) {
  if (!a || !a.name || !a.pin) throw err_('Please log in.', 'AUTH');
  const name = String(a.name).trim().toLowerCase();
  const pin = String(a.pin).trim();
  const cache = CacheService.getScriptCache();
  const key = 'fail_' + name.replace(/\W/g, '_');
  const fails = Number(cache.get(key) || 0);
  if (fails >= 5) throw err_('Too many wrong PIN attempts. Try again after 15 minutes.', 'AUTH');

  const rows = sheet_(USERS).getDataRange().getDisplayValues();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (String(r[0]).trim().toLowerCase() === name && String(r[1]).trim() === pin) {
      if (String(r[3]).trim().toLowerCase() !== 'yes') throw err_('This user is not active. Ask the admin.', 'AUTH');
      cache.remove(key);
      return { name: String(r[0]).trim(), role: String(r[2]).trim().toLowerCase() === 'admin' ? 'Admin' : 'User' };
    }
  }
  cache.put(key, String(fails + 1), 900);
  throw err_('Wrong name or PIN.', 'AUTH');
}

function requireAdmin_(user, msg) {
  if (user.role !== 'Admin') throw err_(msg || 'Only the admin can change columns.');
}

/* ================================================================
 *  FIELDS (columns)
 * ================================================================ */
function getFields_() {
  const rows = sheet_(FIELDS).getDataRange().getDisplayValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!String(r[0]).trim()) continue;
    out.push({
      label: String(r[0]).trim(),
      type: FIELD_TYPES.indexOf(String(r[1]).trim()) >= 0 ? String(r[1]).trim() : 'text',
      section: String(r[2]).trim() || 'Other',
      options: splitOptions_(r[3]),
      card: yes_(r[4]),
      list: yes_(r[5]),
      required: yes_(r[6]),
      order: Number(r[7]) || (i * 10),
      active: String(r[8]).trim() === '' ? true : yes_(r[8])
    });
  }
  out.sort(function (a, b) { return a.order - b.order; });
  return out;
}

function addField_(fd, user) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const label = String(fd.label || '').trim().replace(/\s+/g, ' ');
    if (!label) throw err_('Column name is required.');
    if (label.length > 60) throw err_('Column name is too long.');
    if (SYSTEM_COLUMNS.indexOf(label) >= 0) throw err_('That name is reserved.');
    const fields = getFields_();
    if (fields.some(function (f) { return f.label.toLowerCase() === label.toLowerCase(); })) {
      throw err_('A column called "' + label + '" already exists.');
    }
    const type = FIELD_TYPES.indexOf(fd.type) >= 0 ? fd.type : 'text';
    const maxOrder = fields.reduce(function (m, f) { return Math.max(m, f.order); }, 0);
    const row = [label, type, String(fd.section || 'Other').trim() || 'Other',
      (fd.options || []).map(String).map(function (s) { return s.trim(); }).filter(String).join(', '),
      fd.card ? 'Yes' : 'No', fd.list === false ? 'No' : 'Yes', fd.required ? 'Yes' : 'No',
      String(maxOrder + 10), 'Yes'];
    const fs = sheet_(FIELDS);
    const r = fs.getLastRow() + 1;
    ensureRows_(fs, r);
    fs.getRange(r, 1, 1, row.length).setNumberFormat('@').setValues([row.map(safe_)]);

    ensureHeaders_(sheet_(LEADS), [label]);
    addHistory_([[now_(), '', user.name, 'Column added', label, '', type]]);
    return { fields: getFields_() };
  } finally {
    lock.releaseLock();
  }
}

function updateField_(label, patch, user) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const fs = sheet_(FIELDS);
    const rows = fs.getDataRange().getDisplayValues();
    let idx = -1;
    for (let i = 1; i < rows.length; i++) if (String(rows[i][0]).trim() === label) { idx = i; break; }
    if (idx < 0) throw err_('Column not found: ' + label);
    const row = rows[idx].slice();
    while (row.length < FIELD_HEADERS.length) row.push('');
    const before = row.join('|');
    if (patch.type !== undefined && FIELD_TYPES.indexOf(patch.type) >= 0) row[1] = patch.type;
    if (patch.section !== undefined) row[2] = String(patch.section).trim() || 'Other';
    if (patch.options !== undefined) row[3] = (patch.options || []).map(String).map(function (s) { return s.trim(); }).filter(String).join(', ');
    if (patch.card !== undefined) row[4] = patch.card ? 'Yes' : 'No';
    if (patch.list !== undefined) row[5] = patch.list ? 'Yes' : 'No';
    if (patch.required !== undefined) row[6] = patch.required ? 'Yes' : 'No';
    if (patch.active !== undefined) row[8] = patch.active ? 'Yes' : 'No';
    if (row.join('|') !== before) {
      fs.getRange(idx + 1, 1, 1, FIELD_HEADERS.length).setNumberFormat('@').setValues([row.map(safe_)]);
      addHistory_([[now_(), '', user.name, 'Column changed', label, '', '']]);
    }
    return { fields: getFields_() };
  } finally {
    lock.releaseLock();
  }
}

function reorderFields_(labels) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const fs = sheet_(FIELDS);
    const rows = fs.getDataRange().getDisplayValues();
    for (let i = 1; i < rows.length; i++) {
      const pos = labels.indexOf(String(rows[i][0]).trim());
      if (pos >= 0) fs.getRange(i + 1, 8).setValue(String((pos + 1) * 10));
    }
    return { fields: getFields_() };
  } finally {
    lock.releaseLock();
  }
}

/* ================================================================
 *  LEADS
 * ================================================================ */
function getLeads_() {
  const sh = sheet_(LEADS);
  if (sh.getLastRow() < 2) return [];
  const data = sh.getDataRange().getDisplayValues();
  const headers = data[0];
  const srCol = headers.indexOf(SYS.SR);
  const out = [];
  for (let i = 1; i < data.length; i++) {
    if (!String(data[i][srCol]).trim()) continue;
    const o = {};
    for (let c = 0; c < headers.length; c++) if (headers[c]) o[headers[c]] = data[i][c];
    out.push(o);
  }
  return out;
}

function saveLead_(sr, changes, photoOps, user) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_(LEADS);
    const fields = getFields_();
    const byLabel = {};
    fields.forEach(function (f) { byLabel[f.label] = f; });

    // Make sure every column exists
    const headers = ensureHeaders_(sh, SYSTEM_COLUMNS.concat(fields.map(function (f) { return f.label; })));
    const col = {};
    headers.forEach(function (h, i) { col[h] = i; });

    const data = sh.getDataRange().getDisplayValues();
    const now = now_();
    let rowIndex, row;
    const isNew = !sr;
    const hist = [];

    if (isNew) {
      // Sr. No. is never reused, even after a lead is deleted
      const props = PropertiesService.getScriptProperties();
      let max = Number(props.getProperty('LAST_SR') || 0);
      for (let i = 1; i < data.length; i++) max = Math.max(max, Number(data[i][col[SYS.SR]]) || 0);
      sr = max + 1;
      props.setProperty('LAST_SR', String(sr));
      rowIndex = sh.getLastRow() + 1;
      row = headers.map(function () { return ''; });
      row[col[SYS.SR]] = String(sr);
      row[col[SYS.CREATED_AT]] = now;
      row[col[SYS.CREATED_BY]] = user.name;
      row[col[SYS.ARCHIVED]] = 'No';
      hist.push([now, String(sr), user.name, 'Created', '', '', '']);
    } else {
      sr = Number(sr);
      for (let i = 1; i < data.length; i++) {
        if (Number(data[i][col[SYS.SR]]) === sr) { rowIndex = i + 1; row = data[i].slice(); break; }
      }
      if (!row) throw err_('Lead #' + sr + ' was not found. Please refresh.');
      while (row.length < headers.length) row.push('');
    }

    // Normal fields
    const newOptions = {};
    Object.keys(changes).forEach(function (label) {
      const f = byLabel[label];
      if (!f || f.type === 'photos' || col[label] === undefined) return;
      const nv = clean_(changes[label]);
      const ov = String(row[col[label]] || '');
      if (nv === ov) return;
      row[col[label]] = nv;
      if (!isNew) hist.push([now, String(sr), user.name, 'Updated', label, ov, nv]);
      if (f.type === 'picklist_custom' && nv && f.options.indexOf(nv) < 0) {
        newOptions[label] = (newOptions[label] || f.options.slice()).concat([nv]);
      }
    });

    // Photos (added / removed)
    Object.keys(photoOps).forEach(function (label) {
      const f = byLabel[label];
      if (!f || f.type !== 'photos' || col[label] === undefined) return;
      const ops = photoOps[label] || {};
      let list = String(row[col[label]] || '').split(',').map(function (s) { return s.trim(); }).filter(String);
      const removed = (ops.removed || []).filter(function (id) { return list.indexOf(id) >= 0; });
      list = list.filter(function (id) { return removed.indexOf(id) < 0; });
      const added = (ops.added || []).map(String).filter(function (id) { return id && list.indexOf(id) < 0; });
      added.forEach(function (id, n) {
        list.push(id);
        try { DriveApp.getFileById(id).setName('Lead-' + sr + '_' + (list.length) + '.jpg'); } catch (e) { /* ignore */ }
      });
      row[col[label]] = list.join(',');
      if (added.length) hist.push([now, String(sr), user.name, 'Photo added', label, '', added.length + ' photo(s)']);
      if (removed.length) hist.push([now, String(sr), user.name, 'Photo removed', label, removed.length + ' photo(s)', '']);
    });

    // Lead Status rules
    if (byLabel[LSTATUS] && col[LSTATUS] !== undefined) {
      if (!String(row[col[LSTATUS]] || '').trim()) {
        const def = defaultStatus_();
        if (!isNew) hist.push([now, String(sr), user.name, 'Updated', LSTATUS, '', def]);
        row[col[LSTATUS]] = def;
      }
      if (byLabel[REASON] && col[REASON] !== undefined) {
        const st = row[col[LSTATUS]], reason = String(row[col[REASON]] || '').trim();
        if (isNotConverted_(st) && !reason) throw err_('Please enter the reason why this lead was not converted.');
        if (!isNotConverted_(st) && reason) {
          if (!isNew) hist.push([now, String(sr), user.name, 'Updated', REASON, reason, '']);
          row[col[REASON]] = '';
        }
      }
    }

    row[col[SYS.UPDATED_AT]] = now;
    row[col[SYS.UPDATED_BY]] = user.name;

    ensureRows_(sh, rowIndex);
    sh.getRange(rowIndex, 1, 1, headers.length).setNumberFormat('@').setValues([row.map(safe_)]);
    addHistory_(hist);

    // New picklist options (e.g. a new vendor) are remembered for next time
    Object.keys(newOptions).forEach(function (label) {
      setFieldOptions_(label, newOptions[label]);
    });

    const lead = {};
    headers.forEach(function (h, i) { if (h) lead[h] = String(row[i] || ''); });
    return { lead: lead, fields: Object.keys(newOptions).length ? getFields_() : null };
  } finally {
    lock.releaseLock();
  }
}

function setArchived_(sr, archived, user) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_(LEADS);
    const headers = ensureHeaders_(sh, SYSTEM_COLUMNS);
    const data = sh.getDataRange().getDisplayValues();
    const srCol = headers.indexOf(SYS.SR);
    for (let i = 1; i < data.length; i++) {
      if (Number(data[i][srCol]) === Number(sr)) {
        const now = now_();
        sh.getRange(i + 1, headers.indexOf(SYS.ARCHIVED) + 1).setValue(archived ? 'Yes' : 'No');
        sh.getRange(i + 1, headers.indexOf(SYS.UPDATED_AT) + 1).setValue(now);
        sh.getRange(i + 1, headers.indexOf(SYS.UPDATED_BY) + 1).setValue(user.name);
        addHistory_([[now, String(sr), user.name, archived ? 'Archived' : 'Restored', '', '', '']]);
        const row = sh.getRange(i + 1, 1, 1, headers.length).getDisplayValues()[0];
        const lead = {};
        headers.forEach(function (h, c) { if (h) lead[h] = row[c]; });
        return { lead: lead };
      }
    }
    throw err_('Lead #' + sr + ' was not found.');
  } finally {
    lock.releaseLock();
  }
}

// Permanently removes the lead's row. A full copy of the lead is kept in the
// History tab ("Deleted" row, Old Value column) so it can be recovered by hand.
// Its photos stay in the Drive folder.
function deleteLead_(sr, user) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_(LEADS);
    const data = sh.getDataRange().getDisplayValues();
    const headers = data[0];
    const srCol = headers.indexOf(SYS.SR);
    for (let i = 1; i < data.length; i++) {
      if (Number(data[i][srCol]) === Number(sr) && String(data[i][srCol]).trim() !== '') {
        const snap = {};
        headers.forEach(function (h, c) { if (h && data[i][c] !== '') snap[h] = data[i][c]; });
        const props = PropertiesService.getScriptProperties();
        props.setProperty('LAST_SR', String(Math.max(Number(props.getProperty('LAST_SR') || 0), Number(sr))));
        sh.deleteRow(i + 1);
        addHistory_([[now_(), String(sr), user.name, 'Deleted', '', JSON.stringify(snap).slice(0, 45000), '']]);
        return { deleted: String(sr) };
      }
    }
    throw err_('Lead #' + sr + ' was not found. It may already be deleted. Please refresh.');
  } finally {
    lock.releaseLock();
  }
}

/* ================================================================
 *  PHOTOS  (stored in Google Drive → "Site Leads Photos")
 * ================================================================ */
function uploadPhoto_(dataUrl, user) {
  const m = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(String(dataUrl || ''));
  if (!m) throw err_('Invalid photo.');
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > 8 * 1024 * 1024) throw err_('Photo is too large.');
  const stamp = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd_HHmmss');
  const blob = Utilities.newBlob(bytes, m[1], 'photo_' + stamp + '_' + user.name.replace(/\W/g, '') + '.jpg');
  const file = photoFolder_().createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { /* app falls back to getPhoto */ }
  return { id: file.getId() };
}

function getPhoto_(id) {
  const file = DriveApp.getFileById(String(id));
  const folderId = photoFolder_().getId();
  const parents = file.getParents();
  let ok = false;
  while (parents.hasNext()) if (parents.next().getId() === folderId) ok = true;
  if (!ok) throw err_('Photo not found.');
  const blob = file.getBlob();
  return { dataUrl: 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()) };
}

function photoFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PHOTO_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* recreate below */ }
  }
  const folder = DriveApp.createFolder(PHOTO_FOLDER);
  props.setProperty('PHOTO_FOLDER_ID', folder.getId());
  return folder;
}

/* ================================================================
 *  HISTORY
 * ================================================================ */
function getHistory_(sr) {
  const rows = sheet_(HISTORY).getDataRange().getDisplayValues();
  const out = [];
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][1]) === String(sr)) {
      out.push({ at: rows[i][0], user: rows[i][2], action: rows[i][3], field: rows[i][4], old: rows[i][5], new: rows[i][6] });
    }
  }
  return out;
}

function addHistory_(rows) {
  if (!rows.length) return;
  const h = sheet_(HISTORY);
  const r = h.getLastRow() + 1;
  ensureRows_(h, r + rows.length - 1);
  h.getRange(r, 1, rows.length, HISTORY_HEADERS.length).setNumberFormat('@').setValues(rows.map(function (x) { return x.map(safe_); }));
}

/* ================================================================
 *  HELPERS
 * ================================================================ */
function sheet_(name) {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!s) throw err_('The "' + name + '" tab is missing. Run setup() in Apps Script.');
  return s;
}

function ensureHeaders_(sh, needed) {
  const lastCol = sh.getLastColumn();
  let headers = lastCol ? sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0] : [];
  const missing = needed.filter(function (n, i) { return headers.indexOf(n) < 0 && needed.indexOf(n) === i; });
  if (missing.length) {
    const need = lastCol + missing.length;
    if (sh.getMaxColumns() < need) sh.insertColumnsAfter(sh.getMaxColumns(), need - sh.getMaxColumns());
    sh.getRange(1, lastCol + 1, sh.getMaxRows(), missing.length).setNumberFormat('@');
    sh.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]).setFontWeight('bold').setBackground('#fff4e6');
    headers = headers.concat(missing);
  }
  return headers;
}

function ensureRows_(sh, rowNeeded) {
  const max = sh.getMaxRows();
  if (rowNeeded > max) {
    const add = Math.max(100, rowNeeded - max);
    sh.insertRowsAfter(max, add);
    sh.getRange(max + 1, 1, add, sh.getMaxColumns()).setNumberFormat('@');
  }
}

function setFieldOptions_(label, options) {
  const fs = sheet_(FIELDS);
  const rows = fs.getDataRange().getDisplayValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === label) {
      fs.getRange(i + 1, 4).setNumberFormat('@').setValue(options.join(', '));
      return;
    }
  }
}

function defaultStatus_() {
  try {
    const f = getFields_().filter(function (x) { return x.label === LSTATUS; })[0];
    if (f && f.options.length) return f.options[0];
  } catch (e) { /* Fields tab not ready yet */ }
  return 'Open';
}

function splitOptions_(s) {
  return String(s || '').split(',').map(function (x) { return x.trim(); }).filter(String);
}
function yes_(v) { return String(v).trim().toLowerCase() === 'yes'; }
function clean_(v) { return String(v === null || v === undefined ? '' : v).trim().slice(0, 5000); }
function safe_(v) {
  const s = String(v === null || v === undefined ? '' : v);
  return s.charAt(0) === '=' ? "'" + s : s;   // never let text become a formula
}
function now_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'); }
function err_(msg, code) { const e = new Error(msg); e.code = code || ''; return e; }
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
