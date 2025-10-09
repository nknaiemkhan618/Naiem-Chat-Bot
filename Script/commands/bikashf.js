const axios = require("axios");

module.exports.config = {
 name: "bkashf",
 version: "1.0",
 hasPermssion: 0,
 credits: "ULLASH",
 description: "Create a fake Bkash screenshot",
 usePrefix: true,
 prefix: true,
 commandCategory: "Fun",
 usages: "<number> - <transaction ID> - <amount>",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
 const input = args.join(" ");
 if (!input.includes("-")) {
 return api.sendMessage(
 `❌| Wrong format!\nUse: ${global.config.PREFIX}bkashf 017xxxxxxxx - TXN12345 - 1000`,
 event.threadID,
 event.messageID
 );
 }

 const [numberRaw, transactionRaw, amountRaw] = input.split("-");
 const number = numberRaw.trim();
 const transaction = transactionRaw.trim();
 const amount = amountRaw.trim();

 const url = `https://masterapi.site/api/bkashf.php?number=${encodeURIComponent(number)}&transaction=${encodeURIComponent(transaction)}&amount=${encodeURIComponent(amount)}`;

 api.sendMessage(
 `📤 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗳𝗮𝗸𝗲 𝗕𝗸𝗮𝘀𝗵 𝘀𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁... 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 🕐`,
 event.threadID,
 (err, info) =>
 setTimeout(() => {
 api.unsendMessage(info.messageID);
 }, 4000)
 );

 try {
 const response = await axios.get(url, { responseType: "stream" });
 const attachment = response.data;

 api.sendMessage(
 {
 body: `━━━━━━━━━━━━━━━━━━\n📸 𝗙𝗮𝗸𝗲 𝗕𝗞𝗔𝗦𝗛 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 ✅\n━━━━━━━━━━━━━━━━━━\n\n📱 𝗠𝗼𝗯𝗶𝗹𝗲 𝗡𝘂𝗺𝗯𝗲𝗿 : ${number}\n🧾 𝐓𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐈𝐃: ${transaction}\n💵 𝐀𝐦𝐨𝐮𝐧𝐭: ৳${amount}\n\n📤 𝗬𝗼𝘂𝗿 𝗳𝗮𝗸𝗲 𝗕𝗸𝗮𝘀𝗵 𝗿𝗲𝗰𝗲𝗶𝗽𝘁 𝗶𝘀 𝗿𝗲𝗮𝗱𝘆!\n\n━━━━━━━━━━━━━━━━━━\n\n🛠 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆: আ্ঁশ্ঁরা্ঁফু্ঁল্ঁ এ্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁট্ঁ\n━━━━━━━━━━━━━━━━━━`,
 attachment,
 },
 event.threadID,
 event.messageID
 );
 } catch (err) {
 console.error(err);
 api.sendMessage(
 "❌ An error occurred while generating the screenshot.",
 event.threadID,
 event.messageID
 );
 }
};
