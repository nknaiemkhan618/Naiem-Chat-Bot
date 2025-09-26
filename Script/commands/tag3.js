module.exports.config = {
  name: "everyone",
  version: "2.1.0",
  hasPermission: 1, // শুধু অ্যাডমিন চালাতে পারবে
  credits: "NK Naiem Khan",
  description: "everyone লিখলেই গ্রুপের সবাইকে রিয়েল মেনশন করবে",
  commandCategory: "group",
  usages: "[সংখ্যা] [মেসেজ]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const members = threadInfo.participantIDs; // সব মেম্বার আইডি

  let num = parseInt(args[0]);
  if (isNaN(num)) num = 1;
  if (num > 50) num = 50; // লিমিট রাখা হলো

  let customMsg = args.slice(1).join(" ");
  if (!customMsg) customMsg = "everyone"; // ডিফল্ট হিসেবে "everyone"

  // রিয়েল মেনশন অ্যারে বানানো
  let mentions = members.map(id => ({
    id: id,
    tag: "everyone"
  }));

  for (let i = 0; i < num; i++) {
    setTimeout(() => {
      api.sendMessage({
        body: customMsg,
        mentions: mentions
      }, event.threadID);
    }, i * 1000); // প্রতি ১ সেকেন্ড পর পর
  }
};
