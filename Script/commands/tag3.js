module.exports.config = {
  name: "tag",
  version: "1.1.0",
  hasPermission: 1, // শুধু অ্যাডমিন চালাতে পারবে
  credits: "NK Naiem Khan",
  description: "বারবার everyone মেনশন কাস্টম মেসেজসহ",
  commandCategory: "group",
  usages: "[সংখ্যা] [মেসেজ]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  let num = parseInt(args[0]);
  if (isNaN(num)) {
    num = 1; // সংখ্যা না দিলে 1 ধরা হবে
  }

  if (num > 50) num = 50; // লিমিট রাখা হলো

  let customMsg = args.slice(1).join(" ");
  if (!customMsg) customMsg = ""; // মেসেজ না দিলে শুধু @everyone যাবে

  for (let i = 0; i < num; i++) {
    setTimeout(() => {
      api.sendMessage(`@everyone ${customMsg}`, event.threadID, event.messageID);
    }, i * 1000); // প্রতি ১ সেকেন্ড পর পর
  }
};
