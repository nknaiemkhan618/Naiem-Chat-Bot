/**
 * groupname_protect.js
 * Auto-save & auto-restore group name when changed.
 * Features:
 *  - Auto-save first group name
 *  - Allow group/bot admin to change name (and save it)
 *  - Block non-admin name changes (restore old name + mention user)
 */

const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "groupname_protect",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Nk Naiem Khan",
  description: "Auto save & restore group name with admin rules",
  commandCategory: "admin",
  usages: "auto",
  cooldowns: 3
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "groupNames.json");

// === DB Functions ===
function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}), "utf8");
}

function readDB() {
  ensureDB();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8") || "{}");
  } catch {
    return {};
  }
}

function writeDB(db) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

// === Check admin ===
async function isThreadAdmin(api, threadID, senderID) {
  try {
    const info = await new Promise((res, rej) =>
      api.getThreadInfo(threadID, (err, data) => (err ? rej(err) : res(data)))
    );
    if (!info?.adminIDs) return false;
    return info.adminIDs.some(a => a.id == senderID);
  } catch {
    return false;
  }
}

// === Commands ===
module.exports.run = async ({ api, event }) => {
  const { threadID, senderID, body = "" } = event;
  const text = (body || "").toLowerCase();
  const db = readDB();

  // Protect ON
  if (text.startsWith("protect on")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ অ্যাডমিন হওয়া দরকার।", threadID);

    const info = await new Promise((res, rej) =>
      api.getThreadInfo(threadID, (err, d) => (err ? rej(err) : res(d)))
    );

    db[threadID] = {
      name: info.threadName || "Group",
      protected: true
    };
    writeDB(db);

    return api.sendMessage(
      `✅ গ্রুপ নাম প্রোটেকশন চালু!\nসেভড নাম: ${db[threadID].name}`,
      threadID
    );
  }

  // Protect OFF
  if (text.startsWith("protect off")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ অ্যাডমিন হওয়া দরকার।", threadID);

    if (!db[threadID]) db[threadID] = {};
    db[threadID].protected = false;
    writeDB(db);

    return api.sendMessage("⛔ গ্রুপ নাম প্রোটেকশন বন্ধ করা হয়েছে।", threadID);
  }

  // Status
  if (text === "protect status") {
    const entry = db[threadID] || {};
    return api.sendMessage(
      `⚙️ Group Protect Status\n\nনাম: ${entry.name || "Not saved"}\nProtected: ${
        entry.protected ? "ON" : "OFF"
      }`,
      threadID
    );
  }
};

// === Auto Protection & Restore ===
module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { threadID, type, logMessageType, logMessageData, author } = event;

    // Different frameworks send different event types
    if (!(type === "event" || logMessageType === "log:thread-name")) return;

    const db = readDB();
    const entry = db[threadID] || {};

    // --- First time auto-save ---
    if (!entry.name) {
      const info = await new Promise((res, rej) =>
        api.getThreadInfo(threadID, (err, d) => (err ? rej(err) : res(d)))
      );

      db[threadID] = {
        name: info.threadName || "Group",
        protected: true
      };
      writeDB(db);

      return api.sendMessage(
        `✅ প্রথমবার গ্রুপ নাম অটো-সেভ করা হয়েছে:\n${db[threadID].name}`,
        threadID
      );
    }

    if (!entry.protected) return;

    const savedName = entry.name;
    const newName = logMessageData?.name || "";

    const info = await new Promise((res, rej) =>
      api.getThreadInfo(threadID, (err, data) => (err ? rej(err) : res(data)))
    );

    const isAdmin = info.adminIDs.some(a => a.id == author);
    const isBotAdmin = info.adminIDs.some(a => a.id == api.getCurrentUserID());

    // If admin/bot changes → accept & save new
    if (isAdmin || isBotAdmin) {
      db[threadID].name = newName;
      writeDB(db);
      return api.sendMessage(
        `ℹ️ অ্যাডমিন নাম পরিবর্তন করেছেন। নতুন নাম সেভ হয়েছে:\n${newName}`,
        threadID
      );
    }

    // If normal user changes → restore old
    if (newName && newName !== savedName) {
      api.setTitle(savedName, threadID, (err) => {
        if (err) {
          return api.sendMessage("❌ বট অ্যাডমিন না হওয়ায় নাম রিস্টোর করতে পারছে না।", threadID);
        }

        const mentions = [{ id: author, tag: "@user" }];
        api.sendMessage(
          {
            body: `⚠️ @user, আপনি ${newName} নামে নাম পাল্টেছেন!\nকিন্তু প্রোটেকশন চালু আছে, তাই বট আগের নাম ফিরিয়ে দিল:\n✅ ${savedName}`,
            mentions
          },
          threadID
        );
      });
    }
  } catch (e) {
    console.error("handleEvent error:", e);
  }
};
