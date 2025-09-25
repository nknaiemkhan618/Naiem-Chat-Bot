module.exports.config = {
  name: "needbf",
  version: "1.0.0",
  hasPermission: 0,
  credits: "NK Naiem Khan",
  description: "একবারে র‍্যান্ডম একটি FB লিঙ্ক দেখাবে",
  links: [
    { url: "https://www.facebook.com/md.shohan.632504", profilePic: "https://graph.facebook.com/md.shohan.632504/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100095076037065", profilePic: "https://graph.facebook.com/100095076037065/picture?type=large" },
    { url: "https://www.facebook.com/king.3.434869", profilePic: "https://graph.facebook.com/king.3.434869/picture?type=large" },
    { url: "https://www.facebook.com/hm.amirul.islam.158026", profilePic: "https://graph.facebook.com/hm.amirul.islam.158026/picture?type=large" },
    { url: "https://www.facebook.com/sivaneshwaran900", profilePic: "https://graph.facebook.com/sivaneshwaran900/picture?type=large" },
    { url: "https://www.facebook.com/ubaydur.rahman.859384", profilePic: "https://graph.facebook.com/ubaydur.rahman.859384/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100090971083752", profilePic: "https://graph.facebook.com/100090971083752/picture?type=large" },
    { url: "https://www.facebook.com/nk.naiem.khan.641816", profilePic: "https://graph.facebook.com/nk.naiem.khan.641816/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100001039692046", profilePic: "https://graph.facebook.com/100001039692046/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=61580432392618", profilePic: "https://graph.facebook.com/61580432392618/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=61578109236102", profilePic: "https://graph.facebook.com/61578109236102/picture?type=large" },
    { url: "https://www.facebook.com/saim68647", profilePic: "https://graph.facebook.com/saim68647/picture?type=large" },
    { url: "https://www.facebook.com/arakashiam", profilePic: "https://graph.facebook.com/arakashiam/picture?type=large" },
    { url: "https://www.facebook.com/gntojkuangamrimphmy", profilePic: "https://graph.facebook.com/gntojkuangamrimphmy/picture?type=large" },
    { url: "https://www.facebook.com/tanvir.tanvir.114329", profilePic: "https://graph.facebook.com/tanvir.tanvir.114329/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=61554892945411", profilePic: "https://graph.facebook.com/61554892945411/picture?type=large" },
    { url: "https://www.facebook.com/CYBER.ULLASH", profilePic: "https://graph.facebook.com/CYBER.ULLASH/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100089333960673", profilePic: "https://graph.facebook.com/100089333960673/picture?type=large" },
    { url: "https://www.facebook.com/A.k.Alone101", profilePic: "https://graph.facebook.com/A.k.Alone101/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100088997406813", profilePic: "https://graph.facebook.com/100088997406813/picture?type=large" },
    { url: "https://www.facebook.com/md.mahbubur.rahman.953626", profilePic: "https://graph.facebook.com/md.mahbubur.rahman.953626/picture?type=large" },
    { url: "https://www.facebook.com/md.riyaj.281739", profilePic: "https://graph.facebook.com/md.riyaj.281739/picture?type=large" },
    { url: "https://www.facebook.com/hm.rohmotullah.2024", profilePic: "https://graph.facebook.com/hm.rohmotullah.2024/picture?type=large" },
    { url: "https://www.facebook.com/prince.sumon.ahmed.278915", profilePic: "https://graph.facebook.com/prince.sumon.ahmed.278915/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100083848163777", profilePic: "https://graph.facebook.com/100083848163777/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100083749642854", profilePic: "https://graph.facebook.com/100083749642854/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=100090438926034", profilePic: "https://graph.facebook.com/100090438926034/picture?type=large" },
    { url: "https://www.facebook.com/kudduskug", profilePic: "https://graph.facebook.com/kudduskug/picture?type=large" },
    { url: "https://www.facebook.com/nk.naiem.khan.641816", profilePic: "https://graph.facebook.com/nk.naiem.khan.641816/picture?type=large" },
    { url: "https://www.facebook.com/profile.php?id=61580432392618", profilePic: "https://graph.facebook.com/61580432392618/picture?type=large" },
    { url: "https://www.facebook.com/tanvir.tanvir.114329", profilePic: "https://graph.facebook.com/tanvir.tanvir.114329/picture?type=large" },
    // ডুপ্লিকেট করে ১০০ পর্যন্ত লিঙ্ক বসানো হয়েছে
  ]
};

module.exports.run = async function({ api, event }) {
  const links = module.exports.config.links;
  const randomIndex = Math.floor(Math.random() * links.length);
  const randomUser = links[randomIndex];

  const message = `💌 Facebook Link: ${randomUser.url}\n📸 Profile Picture: ${randomUser.profilePic}`;
  
  api.sendMessage(message, event.threadID, event.messageID);
};
