import Dexie, { Table } from "dexie";

export interface Icon {
  id: string;
  name: string;
  url: string;
  src: string;
  position: number;
}

export interface Wallpaper {
  id: number;
  data: string;
}

class NewTabDB extends Dexie {
  icons!: Table<Icon, string>;
  wallpaper!: Table<Wallpaper, number>;

  constructor() {
    super("new-tab");

    this.version(1).stores({
      icons: "id, name, url, src, position",
      wallpaper: "id, data",
    });

    this.version(2)
      .stores({
        icons: "id, name, position",
        wallpaper: "id",
      })
      .upgrade(async (tx) => {
        const icons = tx.table("icons");

        const all = await icons.toArray();

        let pos = 0;
        for (const icon of all.sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        )) {
          icon.position = pos++;
        }
        await icons.bulkPut(all);
      });

    this.on("populate", () => this.seed());
  }

  private async seed() {
    await this.icons.bulkAdd([
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
        url: "https://open.spotify.com/",
        position: 5,
      },
      {
        id: crypto.randomUUID(),
        name: "Reddit",
        src: "https://img.icons8.com/color/48/reddit.png",
        url: "https://www.reddit.com",
        position: 6,
      },
    ]);

    await this.wallpaper.add({
      id: 1,
      data: "",
    });
  }
}

const db = new NewTabDB();
export default db;
