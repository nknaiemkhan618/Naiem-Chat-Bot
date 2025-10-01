/**
 * groupname_protect.js
 * Auto-save & auto-restore group name when changed.
 * Usage: this module auto-initializes — no manual setup required.
 *
 * Ensure:
 * 1) Bot has admin rights in the group (so it can setTitle).
 * 2) Place this file in your modules folder and restart the bot.
 * 3) Node version supporting fs.promises (modern Node).
 */

const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "groupname_protect",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Nk Naiem Khan",
  description: "Automatically save and restore group name when changed",
  commandCategory: "admin",
  usages: "auto (no prefix needed for protection — admin commands available)",
  cooldowns: 3
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "groupNames.json");

// ensure data dir & db exist
function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}), "utf8");
}

function readDB() {
  ensureDB();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("Error reading groupNames DB:", e);
    return {};
  }
}

function writeDB(db) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

// helper to check admin permission when using admin-only commands
async function isThreadAdmin(api, threadID, senderID) {
  try {
    const info = await new Promise((res, rej) =>
      api.getThreadInfo(threadID, (err, data) => (err ? rej(err) : res(data)))
    );
    if (!info || !info.adminIDs) return false;
    return info.adminIDs.some(a => a.id == senderID);
  } catch (e) {
    return false;
  }
}

// run: listens for manual commands like "protect name on/off" or "setgroupname" (admin-only)
// but main protection is in handleEvent (auto)
module.exports.run = async ({ api, event }) => {
  const { threadID, senderID, body = "" } = event;
  const text = (body || "").toLowerCase();

  // admin commands (optional)
  if (text.startsWith("protect name on") || text.startsWith("protect on")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ *𝐀𝐝𝐦𝐢𝐧 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐋𝐚𝐠𝐞:* আপনি অ্যাডমিন নেই, তাই করতে পারি না।", threadID);
    const db = readDB();
    if (!db[threadID]) db[threadID] = {};
    db[threadID].protected = true;
    // ensure saved name exists
    try {
      const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
      db[threadID].name = info.threadName || db[threadID].name || "Group";
    } catch (e) {}
    writeDB(db);
    return api.sendMessage("✅ *𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐎𝐍* — এখন থেকে নাম পরিবর্তন হলে বট আগের নাম রিস্টোর করবে।", threadID);
  }

  if (text.startsWith("protect name off") || text.startsWith("protect off")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ *𝐀𝐝𝐦𝐢𝐧 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐋𝐚𝐠𝐞:* আপনি অ্যাডমিন নেই, তাই করতে পারি না।", threadID);
    const db = readDB();
    if (!db[threadID]) db[threadID] = {};
    db[threadID].protected = false;
    writeDB(db);
    return api.sendMessage("⛔ *𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐎𝐅𝐅* — বট আর নাম ফিরিয়ে দেবে না।", threadID);
  }

  // manual force-save current group name (admin)
  if (text.startsWith("save group name") || text.startsWith("save name")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ অ্যাডমিন হওয়া দরকার।", threadID);
    try {
      const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
      const db = readDB();
      db[threadID] = db[threadID] || {};
      db[threadID].name = info.threadName || "Group";
      db[threadID].protected = true;
      writeDB(db);
      return api.sendMessage(`✅ *𝐍𝐚𝐦𝐞 𝐒𝐚𝐯𝐞𝐝:* *${db[threadID].name}*`, threadID);
    } catch (e) {
      return api.sendMessage("❌ এরর: গ্রুপ ইনফো নেয়া যায়নি।", threadID);
    }
  }

  // show status
  if (text === "group protect status" || text === "protect status") {
    const db = readDB();
    const entry = db[threadID] || {};
    const name = entry.name || "— (not saved)";
    const prot = entry.protected ? "ON" : "OFF";
    return api.sendMessage(`⚙️ *𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 𝐒𝐭𝐚𝐭𝐮𝐬*\n\n*Name:* ${name}\n*Protected:* ${prot}`, threadID);
  }
};

// handleEvent: automatic detection of thread-name change and restore if protected
module.exports.handleEvent = async ({ api, event }) => {
  try {
    // Some bot frameworks provide event.logMessageType === "log:thread-name" when name changed.
    // Others may not — so we check both: if logMessageType present OR fallback by comparing thread info.
    const { threadID, logMessageType, logMessageData } = event;
    // Only act on name-change logs
    if (logMessageType && logMessageType !== "log:thread-name") return;

    // load DB
    const db = readDB();
    const entry = db[threadID];
    if (!entry || !entry.protected) {
      // if no entry, auto-save current name for future protection
      try {
        const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
        const nameNow = info.threadName || "";
        db[threadID] = db[threadID] || {};
        if (!db[threadID].name && nameNow) {
          db[threadID].name = nameNow;
          db[threadID].protected = true; // auto enable protection for groups where module is used
          writeDB(db);
          // notify group (gentle)
          const msg = `✅ *𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 𝐒𝐚𝐯𝐞𝐝 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲!*\n\nআগে থেকে কোন নাম ছিল না, তাই বর্তমান নামকে সেভ করে দিয়েছি:\n*${nameNow}*`;
          api.sendMessage(msg, threadID);
        }
      } catch (e) {}
      return;
    }

    // if protected, restore saved name
    const savedName = entry.name;
    if (!savedName) return;

    // get current thread info to compare
    let info;
    try {
      info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
    } catch (e) {
      console.error("Failed to getThreadInfo:", e);
      return;
    }

    const currentName = info.threadName || "";
    if (currentName === savedName) return; // nothing changed (maybe false trigger)

    // attempt to set title back
    api.setTitle(savedName, threadID, (err) => {
      if (err) {
        console.error("Failed to restore group name:", err);
        return api.sendMessage("❌ *𝐄𝐫𝐫𝐨𝐫:* নাম রিস্টোর করতে পারছি না — বটকে অ্যাডমিন করা আছে কি দেখো।", threadID);
      }

      // notify group in styled font
      const notify = `
⚠️ *𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐞𝐃!*

কারো দ্বারা গ্রুপ নাম পরিবর্তিত হয়েছিল, তাই বট ফিরিয়ে দিল আগের নাম:
*${savedName}*

🛡️ অনুগ্রহ করে গ্রুপের নাম না বদলান — যদি দরকার হয়, অ্যাডমিনের সাথে আলোচনা করে নাও।
`;
      api.sendMessage(notify, threadID);
    });
  } catch (e) {
    console.error("handleEvent error:", e);
  }
};
