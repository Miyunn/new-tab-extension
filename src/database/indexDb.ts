import Dexie from "dexie";

const db = new Dexie("new-tab");
db.version(1).stores({
  icons: "id, name, url, src, position",
});

// Remove this later, no need to auto populate icons in prod
db.on("populate", async () => {
  // @ts-ignore
  await db.icons.bulkAdd([
    {
      id: crypto.randomUUID(),
      name: "Gmail",
      src: "https://img.icons8.com/color/48/gmail-new.png",
      url: "https://mail.google.com/mail/u/0",
      position: 0,
    },
    {
      id: crypto.randomUUID(),
      name: "Youtube",
      src: "https://img.icons8.com/color/48/youtube-play.png",
      url: "https://www.youtube.com",
      position: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Twitter",
      src: "https://img.icons8.com/color/48/twitter--v1.png",
      url: "https://www.twitter.com",
      position: 2,
    },
    {
      id: crypto.randomUUID(),
      name: "Google Drive",
      src: "https://img.icons8.com/color/48/google-drive--v1.png",
      url: "https://drive.google.com/drive/u/0/my-drive",
      position: 3,
    },
    {
      id: crypto.randomUUID(),
      name: "Github",
      src: "https://img.icons8.com/fluency/48/github.png",
      url: "https://www.github.com",
      position: 4,
    },
    {
      id: crypto.randomUUID(),
      name: "Spotify",
      src: "https://img.icons8.com/fluency/48/spotify.png",
      url: "https://www.spotify.com",
      position: 5,
    },
    {
      id: crypto.randomUUID(),
      name: "Reddit",
      src: "https://img.icons8.com/color/48/reddit.png",
      url: "https://www.reddit.com",
      position: 6,
    },
    {
      id: crypto.randomUUID(),
      name: "WhatsApp",
      src: "https://img.icons8.com/color/48/whatsapp--v1.png",
      url: "https://web.whatsapp.com/",
      position: 7,
    },
  ]);
});

export default db;
