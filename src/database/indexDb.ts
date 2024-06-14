import Dexie from "dexie";

const db = new Dexie("new-tab");
db.version(1).stores({
  icons: "++id, name, url, src",
});

// Remove this later, no need to auto populate icons in prod 
db.on("populate", async () => {
  // @ts-ignore
  await db.icons.bulkAdd([
    {
      name: "Gmail",
      src: "https://img.icons8.com/color/48/gmail-new.png",
      url: "https://mail.google.com/mail/u/0",
    },
    {
      name: "Youtube",
      src: "https://img.icons8.com/color/48/youtube-play.png",
      url: "https://www.youtube.com",
    },
    {
      name: "Twitter",
      src: "https://img.icons8.com/color/48/twitter--v1.png",
      url: "https://www.twitter.com",
    },
    {
      name: "Google Drive",
      src: "https://img.icons8.com/color/48/google-drive--v1.png",
      url: "https://drive.google.com/drive/u/0/my-drive",
    },
    {
      name: "Github",
      src: "https://img.icons8.com/fluency/48/github.png",
      url: "https://www.github.com",
    },
    {
      name: "Spotify",
      src: "https://img.icons8.com/fluency/48/spotify.png",
      url: "https://www.spotify.com",
    },
    {
      name: "Reddit",
      src: "https://img.icons8.com/color/48/reddit.png",
      url: "https://www.reddit.com",
    },
    {
      name: "Telegram",
      src: "https://img.icons8.com/color/48/telegram-app--v1.png",
      url: "https://web.telegram.org/a/",
    },
    {
      name: "WhatsApp",
      src: "https://img.icons8.com/color/48/whatsapp--v1.png",
      url: "https://web.whatsapp.com/",
    },
  ]);
});

export default db;
