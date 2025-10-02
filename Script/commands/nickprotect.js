const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "nickprotect",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Nk Naiem Khan",
  description: "Nickname auto-protect system (only admin can change).",
  commandCategory: "admin",
  usages: "/nickprotect on | off | status",
  cooldowns: 3
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "nickprotect.json");

// === DB helper ===
function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}), "utf8");
}
function readDB() {
  ensureDB();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return {};
  }
}
function writeDB(db) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

// === Command Run ===
module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;
  const db = readDB();

  if (!db[threadID]) db[threadID] = { protected: false, nicks: {} };

  switch ((args[0] || "").toLowerCase()) {
    case "on":
      db[threadID].protected = true;
      writeDB(db);
      return api.sendMessage("✅ Nickname Protection চালু হয়েছে!", threadID);

    case "off":
      db[threadID].protected = false;
      writeDB(db);
      return api.sendMessage("⛔ Nickname Protection বন্ধ করা হলো।", threadID);

    case "status":
      return api.sendMessage(
        `⚙️ Nickname Protection: ${db[threadID].protected ? "ON ✅" : "OFF ❌"}`,
        threadID
      );

    default:
      return api.sendMessage(
        "ℹ️ ব্যবহার:\n/nickprotect on\n/nickprotect off\n/nickprotect status",
        threadID
      );
  }
};

// === Event Listener ===
module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (event.logMessageType !== "log:user-nickname") return;

    const { threadID, author, logMessageData } = event;
    const targetID = logMessageData.participant_id;
    const newNick = logMessageData.nickname || "";

    const db = readDB();
    if (!db[threadID] || !db[threadID].protected) return;

    const threadInfo = await new Promise((res, rej) =>
      api.getThreadInfo(threadID, (err, d) => (err ? rej(err) : res(d)))
    );
    const adminIDs = threadInfo.adminIDs.map(a => a.id);

    // এডমিন হলে nick save হবে
    if (adminIDs.includes(author)) {
      db[threadID].nicks[targetID] = newNick;
      writeDB(db);
      return;
    }

    // non-admin হলে restore
    const savedNick = db[threadID].nicks[targetID] || "";
    if (savedNick !== newNick) {
      await api.changeNickname(savedNick, threadID, targetID);
      api.sendMessage(
        `⚠️ শুধুমাত্র এডমিন nickname পরিবর্তন করতে পারবে!\n🔄 Restore করা হলো: ${savedNick || "ডিফল্ট নাম"}`,
        threadID
      );
    }
  } catch (e) {
    console.error("nickprotect error:", e);
  }
};
