// group_logo_protect.js
// Messenger Group Logo Protect System
// Credits: NK NAIEM KHAN

const fs = require("fs");
const path = require("path");

// লোগো সেভ করার লোকেশন
const logoPath = path.join(__dirname, "group_logo.jpg");

module.exports.config = {
  name: "grouplogo",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "NK NAIEM KHAN",
  description: "Protect group logo (only admin can change)",
  commandCategory: "group",
  usages: "Auto restore logo if changed by non-admin",
  cooldowns: 5,
};

module.exports.onLoad = async function ({ api, event }) {
  // প্রথমে গ্রুপ লোগো সেভ করা
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    if (threadInfo.imageSrc) {
      const response = await global.nodemodule["axios"]({
        url: threadInfo.imageSrc,
        method: "GET",
        responseType: "arraybuffer",
      });
      fs.writeFileSync(logoPath, Buffer.from(response.data, "utf-8"));
      console.log("✅ গ্রুপ লোগো সেভ হয়েছে");
    }
  } catch (e) {
    console.log("লোগো সেভ করতে সমস্যা:", e.message);
  }
};

// ইভেন্ট লিসেনার (যখন কেউ লোগো চেঞ্জ করবে)
module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType === "log:thread-image") {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const isAdmin = threadInfo.adminIDs.some(item => item.id === event.author);

      // যদি এডমিন হয় → নতুন লোগো সেভ
      if (isAdmin) {
        const response = await global.nodemodule["axios"]({
          url: threadInfo.imageSrc,
          method: "GET",
          responseType: "arraybuffer",
        });
        fs.writeFileSync(logoPath, Buffer.from(response.data, "utf-8"));
        api.sendMessage("✅ এডমিন লোগো পরিবর্তন করেছেন, নতুন লোগো সেভ হলো।", event.threadID);
      } else {
        // নন-এডমিন হলে → পুরানো লোগো রিস্টোর
        if (fs.existsSync(logoPath)) {
          api.changeGroupImage(fs.createReadStream(logoPath), event.threadID);
          api.sendMessage(
            `⚠️ ${event.senderID} এডমিন ছাড়া লোগো চেঞ্জ করতে চেয়েছিল, আগের লোগো ফিরিয়ে দেওয়া হলো।`,
            event.threadID
          );
        }
      }
    } catch (e) {
      console.log("লোগো রিস্টোর করতে সমস্যা:", e.message);
    }
  }
};

module.exports.run = async function () {};
