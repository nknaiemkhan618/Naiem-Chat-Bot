module.exports.config = {
  name: "autoreact",
  version: "1.1.4",
  hasPermission: 1, // শুধু অ্যাডমিন ব্যবহার করতে পারবে
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Bot Auto-React",
  commandCategory: "Admin",
  cooldowns: 0,
};

module.exports.handleEvent = async ({ api, event }) => {
  const threadData = global.data.threadData.get(event.threadID) || {};

  // ডিফল্টে সব গ্রুপে ON থাকবে
  if (typeof threadData["autoreact"] === "undefined") {
    threadData["autoreact"] = true;
    global.data.threadData.set(event.threadID, threadData);
  }

  // যদি অফ থাকে তাহলে রিয়েক্ট করবে না
  if (threadData["autoreact"] === false) return;

  // শুধু টেক্সট না → সব মেসেজে রিয়েক্ট দিবে
  const emojis = [
    "🥰","😗","🍂","💜","☺️","🖤","🤗","😇","🌺","🥹","😻","😘","🫣","😽","😺","👀",
    "❤️","🧡","💛","💚","💙","💜","🤎","🤍","💫","💦","🫶","🫦","👄","🗣️","💏","👨‍👩‍👦‍👦",
    "👨‍👨‍👦","😵","🥵","🥶","🤨","🤐","🫡","🤔"
  ];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  api.setMessageReaction(randomEmoji, event.messageID, (err) => {
    if (err) console.error("Error sending reaction:", err);
  }, true);
};

module.exports.run = async ({ api, event, Threads, permssion }) => {
  const { threadID, messageID, body } = event;

  // শুধু অ্যাডমিন ব্যবহার করতে পারবে
  if (permssion < 1) {
    return api.sendMessage("❌ এই কমান্ড শুধুমাত্র অ্যাডমিন ব্যবহার করতে পারবে!", threadID, messageID);
  }

  const threadData = await Threads.getData(threadID);

  if (body.toLowerCase() === "autoreact on") {
    threadData.data["autoreact"] = true;
    await Threads.setData(threadID, { data: threadData.data });
    global.data.threadData.set(threadID, threadData.data);
    return api.sendMessage("✅ Auto-react চালু করা হলো 🟢", threadID, messageID);
  }

  if (body.toLowerCase() === "autoreact off") {
    threadData.data["autoreact"] = false;
    await Threads.setData(threadID, { data: threadData.data });
    global.data.threadData.set(threadID, threadData.data);
    return api.sendMessage("❌ Auto-react বন্ধ করা হলো 🔴", threadID, messageID);
  }

  return api.sendMessage("⚙️ ব্যবহার: autoreact on / autoreact off", threadID, messageID);
};
