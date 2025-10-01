/**
 * groupname_protect.js
 * Auto-save & auto-restore group name when changed.
 * Usage: auto-initializes — no manual setup required.
 *
 * Ensure:
 * 1) Bot has admin rights in the group (so it can setTitle).
 * 2) Place this file in your modules folder and restart the bot.
 */

const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "groupname_protect",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Nk Naiem Khan",
  description: "Automatically save and restore group name when changed, with user mention",
  commandCategory: "admin",
  usages: "auto",
  cooldowns: 3
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "groupNames.json");

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

module.exports.run = async ({ api, event }) => {
  const { threadID, senderID, body = "" } = event;
  const text = body.toLowerCase();

  if (text.startsWith("protect name on") || text.startsWith("protect on")) {
    if (!(await isThreadAdmin(api, threadID, senderID)))
      return api.sendMessage("⚠️ অ্যাডমিন পারমিশন লাগবে।", threadID);

    const db = readDB();
    db[threadID] = db[threadID] || {};
    db[threadID].protected = true;

    try {
      const info = await new Promise((res, rej) =>
        api.getThreadInfo(threadID, (err, d) => (err ? rej(err) : res(d)))
      );
      db[threadID].name = info.threadName || "Group";
    } catch {}

    writeDB(db);
    return api.sendMessage("✅ Group Name Protection ON", threadID);
  }

  if (text.startsWith("protect name off") || text.startsWith("protect off")) {
    if (!(await isThreadAdmin(api, threadID, senderID)))
      return api.sendMessage("⚠️ অ্যাডমিন পারমিশন লাগবে।", threadID);

    const db = readDB();
    db[threadID] = db[threadID] || {};
    db[threadID].protected = false;
    writeDB(db);
    return api.sendMessage("⛔ Group Name Protection OFF", threadID);
  }

  if (text.startsWith("save group name") || text.startsWith("save name")) {
    if (!(await isThreadAdmin(api, threadID, senderID)))
      return api.sendMessage("⚠️ অ্যাডমিন পারমিশন লাগবে।", threadID);

    try {
      const info = await new Promise((res, rej) =>
        api.getThreadInfo(threadID, (err, d) => (err ? rej(err) : res(d)))
      );
      const db = readDB();
      db[threadID] = db[threadID] || {};
      db[threadID].name = info.threadName || "Group";
      db[threadID].protected = true;
      writeDB(db);
      return api.sendMessage(`✅ Name Saved: ${db[threadID].name}`, threadID);
    } catch {
      return api.sendMessage("❌ এরর: গ্রুপ ইনফো নেয়া যায়নি।", threadID);
    }
  }

  if (text === "group protect status" || text === "protect status") {
    const db = readDB();
    const entry = db[threadID] || {};
    return api.sendMessage(
      `⚙️ Group Name Status\n\nName: ${entry.name || "—"}\nProtected: ${
        entry.protected ? "ON" : "OFF"
      }`,
      threadID
    );
  }
};

// === Updated handleEvent with mention ===
module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { threadID, logMessageType, logMessageData, author } = event;

    if (logMessageType !== "log:thread-name") return;

    const db = readDB();
    const entry = db[threadID];
    if (!entry?.protected || !entry.name) return;

    const savedName = entry.name;
    const newName = logMessageData?.name || "";

    if (newName && newName !== savedName) {
      api.setTitle(savedName, threadID, (err) => {
        if (err) {
          console.error("Failed to restore name:", err);
          return api.sendMessage(
            "❌ নাম রিস্টোর করতে পারছি না — বটকে অ্যাডমিন দিন।",
            threadID
          );
        }

        // mention তৈরি
        const mentions = [
          {
            id: author,
            tag: "@user"
          }
        ];

        api.sendMessage(
          {
            body: `⚠️ ${newName} নামে গ্রুপ চেঞ্জ করেছিলেন!\n\n👉 @user, আপনি নাম বদলেছেন, কিন্তু বট আগের নাম ফিরিয়ে দিল:\n✅ ${savedName}`,
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
