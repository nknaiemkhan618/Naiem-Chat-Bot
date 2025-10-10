const axios = require("axios");
const fs = require("fs");
const path = require("path");
 
module.exports.config = {
 name: "faceswap",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "Ullash", 
 description: "Swap faces between two images",
 commandCategory: "image",
 usages: "[reply 2 images and type faceswap]",
 cooldowns: 5,
};
 
module.exports.run = async function ({ api, event }) {
 try {
 if (!event.messageReply || !event.messageReply.attachments) {
 return api.sendMessage("⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝟐 𝐢𝐦𝐚𝐠𝐞𝐬 𝐰𝐢𝐭𝐡 'faceswap'", event.threadID, event.messageID);
 }
 
 const attachments = event.messageReply.attachments;
 
 if (attachments.length < 2) {
 return api.sendMessage("⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐞𝐱𝐚𝐜𝐭𝐥𝐲 𝟐 𝐢𝐦𝐚𝐠𝐞𝐬!", event.threadID, event.messageID);
 }
 
 const baseUrl = attachments[0].url;
 const swapUrl = attachments[1].url;
 
 const apiUrl = `https://faceswap.cyberbot.top/faceswap?baseUrl=${encodeURIComponent(baseUrl)}&swapUrl=${encodeURIComponent(swapUrl)}`;
 
 const loadingMsg = await api.sendMessage("⏳ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐅𝐚𝐜𝐞𝐒𝐰𝐚𝐩... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭", event.threadID);
 
 const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
 
 const imgPath = path.join(__dirname, "faceswap_result.jpg");
 fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));
 
 api.unsendMessage(loadingMsg.messageID);
 
 api.sendMessage(
 {
 body: "✅ 𝐅𝐚𝐜𝐞𝐒𝐰𝐚𝐩 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞!",
 attachment: fs.createReadStream(imgPath),
 },
 event.threadID,
 () => fs.unlinkSync(imgPath),
 event.messageID
 );
 
 } catch (err) {
 console.error(err);
 return api.sendMessage("❌ 𝐅𝐚𝐜𝐞𝐒𝐰𝐚𝐩 𝐟𝐚𝐢𝐥𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.", event.threadID, event.messageID);
 }
};
