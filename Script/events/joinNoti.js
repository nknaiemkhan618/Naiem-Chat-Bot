module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Welcome message with optional image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;
  
  const botPrefix = global.config.PREFIX || "/";
  const botName = global.config.BOTNAME || "𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁";

 
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());

    api.sendMessage("চ্ঁলে্ঁ এ্ঁসে্ঁছি্ঁ আ্ঁশ্ঁরা্ঁফু্ঁল্ঁ এ্ঁর্ঁ ফে্ঁমা্ঁস্ঁ এঁখঁনঁ তোঁমাঁদেঁরঁ সাঁথেঁ আঁড্ডাঁ দিঁবঁ..!", threadID, () => {
      const randomGifPath = path.join(__dirname, "cache", "randomgif");
      const allFiles = fs.readdirSync(randomGifPath).filter(file =>
        [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
      );

      const selected = allFiles.length > 0 
        ? fs.createReadStream(path.join(randomGifPath, allFiles[Math.floor(Math.random() * allFiles.length)])) 
        : null;

      const messageBody = `╭•┄┅═══❁🌺❁═══┅┄•╮
     আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯

𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐢-𝐠𝐫𝐨𝐮𝐩-🖤🤗
𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐚𝐡𝐚𝐥𝐥𝐚𝐡 🌺❤️

𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:
${botPrefix}Help
${botPrefix}Info
${botPrefix}Admin

★ যেকোনো অভিযোগ অথবা হেল্প এর জন্য এডমিন 𝗦𝗮𝗶𝗳𝘂𝗹 কে নক করতে পারেন ★
➤𝐌𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫: https://m.me/61581203436353
➤𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: 01908143017

❖⋆═══════════════════════⋆❖
          𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➢ 𝐀𝐒𝐇𝐑𝐀𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌`;

      if (selected) {
        api.sendMessage({ body: messageBody, attachment: selected }, threadID);
      } else {
        api.sendMessage(messageBody, threadID);
      }
    });

    return;
  }

 
  try {
    const { createReadStream, readdirSync } = global.nodemodule["fs-extra"];
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    let msg = (typeof threadData.customJoin === "undefined") ? `
╭──────༺♡༻──────╮
💚 আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ  💚
╰──────༺♡༻──────╯
প্রিয় নতুন মেম্বার,  
প্রথমেই আমাদের এই গ্রুপে আপনাকে স্বাগতম জানাচ্ছি! 🌸  

হাসি, আনন্দ আর ঠাট্টায় গড়ে উঠুক  
চিরস্থায়ী বন্ধুত্বের বন্ধন~🌺  
ভালোবাসা আর সম্পর্ক থাকুক আজীবন~💞  

🌸কিছু নিয়ম মেনে চলুন🌼

➤ আশা করি আপনি এখানে হাসি-মজা করে
আড্ডা দিতে ভালোবাসবেন!🌺
➤ উস্কানিমূলক কথা বা খারাপ ব্যবহার করবেন না!🚫
➤ গ্রুপে কোন প্রকার ১৮+ ভিডিও ফটো কথা বার্তা বলবেন না !⚠️
➤ অপ্রয়োজনে বারবার ট্যাগ করবেন না!❗
➤ এডমিন পারমিশন ছাড়া কোন প্রকার কিছু প্রমোশন করবেন না! ‼️
➤ রুলস না মানলে রিমুভ করলে কিছু বলতে পারবেন না!📛
➤ কুনো প্রকার সমস্যা হলে কিংবা প্রেম করতে ইচ্ছে হলে আশরাফুল বছের ইনবক্সে চলে যাবেন।💐
➤ গ্রুপ এডমিনের কথা শুনবেন ও রুলস মেনে চলবেন!✅
➤ কোন সমস্যা হলে ছেলে রা ছেলে এডমিন & মেয়েরা মেয়ে এডমিন এর সাথে যোগাযোগ করবেন!❤️‍🩹
➤ এডমিন এর পারমিসন ব্যতিত কেও কারো ইনবক্সে গেলে বিনা নোটিশে কিক দেওয়া হবে!☠️
                ⫷✪⫸ ধ͢͢͢ন্যবা͢͢͢দ ⫷✪⫸

›› প্রিয় {name},  
আপনি এই গ্রুপের {soThanhVien} নম্বর মেম্বার!

›› গ্রুপ: {threadName}

🌷🌟 ✿ W E L C O M E ✿ 🌟🌷
╭─╼╾─╼🌹╾─╼╾───╮
─꯭─⃝‌‌আ্ঁশ্ঁরা্ঁফু্ঁল্ঁ এ্ঁর্ঁ ফে্ঁমা্ঁস্ঁ 🌺
╰───╼╾─╼🌹╾─╼╾─╯

❖⋆══════════════════════════⋆❖` : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(__dirname, "cache", "joinGif");
    const files = readdirSync(joinGifPath).filter(file =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
    );
    const randomFile = files.length > 0 
      ? createReadStream(path.join(joinGifPath, files[Math.floor(Math.random() * files.length)])) 
      : null;

    return api.sendMessage(
      randomFile ? { body: msg, attachment: randomFile, mentions } : { body: msg, mentions },
      threadID
    );
  } catch (e) {
    console.error(e);
  }
};
