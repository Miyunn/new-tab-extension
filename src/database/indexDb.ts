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
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACu0lEQVR4nO2UT2jTYByG48F5c4ieFcdogqaVNkmXuJ7KDkILrcPN4y4y2KFnPYjebMCbc4JXT85Bq0IPWm1zsLVoFZFdNjfULV93kVHBuZJoP/lmo1lNmj/9K3wvvLfw6/skDyUIHBwcHBwcXcoez7ECRd0pkmSlQJI7BZIsFT2eaaLH+SHR06pEl5Q8vaPkvRU1T9+GWeqo9XiSXC1SFDToUnlkZLjbw2GWGVYkekmVvPCf5umVlhB7b954vNa1EkUx3Rqv5LyMKnnXDMf/7bw5AEluWQCg1gDPJTo9HvBcQpG8NYvxUMnTwByAouo2ACAQOCjz3MPPodCRdod/CQYPA4G7j25ajf8N4K2bHrMzXgNoQHzaHA/ybscDngkAgfug3bMDgNoxgEYVIHCXIUEccDK+IrCzgOdq+lv9AnCklF4Z0NS2AeYnZt65BbCjVLMywAXAq+zYa1OA4yKAk3OLap4+U3MD0EopI2WAA4DvOd/uzUy4Gk3HYUsA1MDVt/BeKP7TJcA+pVopA2wCrD8L1C49ikA03hYA6skbG/DKhWt1o79WO2MaEOuodp9XDcZnnozD8+nYn/G2AbROzi3WpdO+XTcATqvqhn/L+RQxM7FvuCsATak0G97qFcDmc/+2Xpm2ATSlkpHEClKqmwAvnvIfm5XpCIDW2ZmF90Dgql0AqC48Di+3Gt4RANSK4D8BePZlp8bLAvdmg/eP2hnfEQD0bJlhDso8K8oC15ZSMs/dXT03egjd7CmAFnCWiQGe3Xb+1tmv8hh7UX+rLwAoTpXSlCGa0jcAJ0rplRkoACuljJQZSAAjpcyUGVgAFKSJLLC3UM2UGWgAN4liABEDtJUoBkgCMPAAqbhsDiDK4qADRNKxpOmBU9eXh/YgLL5EPwAiqTiIpuLi1IOpoW79Pg4ODg4O8d/lF8QKnDLBCDeUAAAAAElFTkSuQmCC",
        url: "https://mail.google.com/mail/u/0",
        position: 0,
      },
      {
        id: crypto.randomUUID(),
        name: "Youtube",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACQ0lEQVR4nO2Yu2sUURjFTyImwSKSCGJja6GoRUDU+b4kapMiYiFpLCyiEV9gaSdCRA2xyT+QIo9GsVGiATHgu1C08IGPShK08RVxCUbYI3fcWXRJnJnM3Z0ZvT84sAyz3z2HOzP33g9wOBwOh+N/gLuwih4208NuKo5TMUDBGAUTFNyn4AUF76j45EswRwV9/fodXDf3PKfgnv9fxSgF56g45tc2Y2xFa3LDQD0FfRRMUVEom6mdCqWxDxKoi2d+PRoomEzBNBfRNbZhefQAggsZMM0KDUQz34EmCr5kwDArNMs2rAgP4KEzA2a5oNqxI0qA3tSN6iIS9EV5/vtTN6oJ3gMKxhMN8vAGuX9DtWbgcpQAtxINYvgxT14aIrtW2g7xJEqAx4kDBMx+IIdOkB31tgLMhAdQvLIWIODlI/LIdhsBvoeuyial9QCGYpGcukjuXZssRBcawx6hz1UJEDD3jRw+Te5sXFr9LWgOm4H5qgYImHlDnuqJX38bVmcjwPRr8mR3/PqCljw/QkX2YFl6L/HkCLlnzdJrK77+1XzmP6OC6douZB/fk4OH7C1kgqc13ko02zGuZd2t/mbuwQS5b51t4yzNwHi+t9OC/nwfaDz05vtI6aHz3z/UGygYzIBhVug8YjW2FNczYJq+TAsyTmPLDwHUUXEg5dbiTf+jEre1uGAgQQvbsZGCbioOU3GGihEqrlBw26ySVLwtN3H/DF347bq55xkVd6i4WmrunqXgqF9bsMlKc9fhcDgcDuSAn9VThUlTulWSAAAAAElFTkSuQmCC",
        url: "https://www.youtube.com",
        position: 1,
      },
      {
        id: crypto.randomUUID(),
        name: "Twitter",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2YT4hPURTHr3PmmYU/oSQWdiLlX5KFUogyIvmz8Cf5t8SGrGQWiixFGqWI/Oac22gkZkWyU6SRKAsiJZphfr93zhsy+T2950emZqb3e/e9N5v3qbt7797zPefce889xpSUlJSUlJQkxNbmI+kFZH2NJAGy1oDlObKcMbd19ki/eBVZbFzATt1o2kNwmqQ9hMhIJBlC1nDEQSpAejj+/k7fFCR/O7A+QtKL6Re2XyYjaTXymov9SHJlVMN5+ACSZ8jy848o+WRsdYbDwtr2n4cuGxtis3OAld1JjcfhEen3rC41t6rTsVPWpRIAVo4M8w7L3aY8EoYTkORt88bLELB2AetjJP3qWVmUTgDLsREm/4hW1if5v4WCFam8z3+HfEcbbDFpQQo2j5qrLN2my18wpgNIDzgI6Gshf5VxIj4NVMYIdR1I7kVCTU/YmiiCSTczyy6TBY1zO8mitUbenkAra01XbR6w7E0dgU5/WyYCzI1wErK+ccvlNAJ0g7PtQLIHSPd5FV0GLL1FCvDSnjyj5jDJYGECSOpR5J0FRBdJ4anD8SX2ymQFsDwpXoR0ZCbAs8Hyf7VJcRFoM1mCJDsLE0Hab2w40WRNVBYAy9P8Bcg5kwdIwVa0uglJriHJj5yMHzSVYE5OAvRSAZv3vMkN689E1s85ps4Hc7N/an4Con1QCVYi67ccPP8raYnuTlSkkT7MUgBYPW2KJrofgLQdWB84ps716OVWuIBoUWA9iKQDTsbb5t/ZbvSErWB1P7C+cDC8DqSncvW8R7okSpMW8lej9XcA6UlguY+kvmPKvEOSNSZ3ugemIcvZRgctg2NSq7HXsyiTm6Iis4DkOLC+THXCsPQCydHIIWbcsf5CsHoISa7GZXbU84k7d1KP7weS93E7kKUjbhPawbnjbXJJSUlJSUmJyZHfxnHsrRJKPnUAAAAASUVORK5CYII=",
        url: "https://www.twitter.com",
        position: 2,
      },
      {
        id: crypto.randomUUID(),
        name: "Google Drive",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADW0lEQVR4nO1Zb0iTQRx+LXrfNCskSVchVFIYEZUfhKCgQtLdbXer9kEK7EsgVJ9yKkUWFEERfZCCCEwoqJB2N22KabJ3OqFMw5mIKaRBpCSB/wJXuYuVU9DW3vfcbgR74Pf1eJ7fPXf33J0kxRFHHHH81zDaLaC5cUs7cytMd6myMabkrdVWGRDch6h5yOdOnNYvQh5g9ZISMwGQomJIMQtUhTNb5ZoFt2yLCXmL3bIeUjQWFAApmhx1rRnRbyNlgrmTDMIFQIoq58n/qbM1h1o510KVUPJmh3kPoGhmoQBIsL+rydDDMQt+1pKYI4Y9kxIgwS2LyM/WcQfsnXGtnOEQ0cGYtCzq/IHdciIU+WA9acjis5JbORVV8rAWJgGCP4YTYKLoy6QreZxjRxphTdLaqAkAFF0LRz5Y5c59fNuqqtyMCnlYCzMAwd+0CgAU+Qab133gEOBjHnl75AVQZNdKPlgnHfmdnIdbY0TJGx3mg3rJzx5uTuZW6mKak6zV1uWAYK9e8gEL5RO8jbmUTOZWYpeToN1yhrP714NjBBZmTHIScIIUQPCobvIEf7JWW5PnBHik1UyVPwvPSYCiOzzdNxFcsHCswCElNCeZHeYdkOAfHN73BOLGIgFMSmCq/EpYTgIUveAg/9NI0e5QY7LWFdlMVaKfk4wEH+WxDiD4brixA5aIak7Kq89TIEX9HLvOV1gLU8MKeLkqjbmVsajlJEjwRa5tk+AiTR36vaBlW1RyEngONgKKJjms8zZw4GkW0CPJTFX6Ip6TIEWPODrvNzrMB7SSnxOhKrkRz0mQ4Da9Ag4/Pu0xlHQzYWXzOkMLsFv2/vWuG9I6aCrjUsuwKPLpNq9vg83776gNCK7SKiDn/hVVZPfTbd03wnrTVGNKgwSPh+2+/diQoaxzWqB1RlJKO7RdNwFFpeEE7Lz1sF1o90u8hZKeN09I0ftQ5HOfFr4WSd5g6+6QLjN9Ty4mglGIvOPbXN40KE6A1592vovv0QsS3LBQwP7KMpdQ69i8DyReGAnOghR9n1+4luFNZW+mBHZ/IvVC79IefiHBFUEBu27faxPa/ZJ3xdJSEbxWHnlW4DWUdvkFWmcg81x/ZD4/8gku2nq1rk+s97tj+/0URxxxxCFpwS8h3yc9WR5nfQAAAABJRU5ErkJggg==",
        url: "https://drive.google.com/drive/u/0/my-drive",
        position: 3,
      },
      {
        id: crypto.randomUUID(),
        name: "Github",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFfUlEQVR4nO2Z20sjVxzHR0tLu/QG7fZp2z9ACoVOHDNJdJI4mcxkotgWr9UnFQQv9cFL8RbxwY24also26UPImjFiu2DVBHRBx/ESx+sbkFQtGIsqHW90EQTSU75HXZCms3EyWXcF7/wgzAz0e/n/H5zzvmdEMSd7nSnhJWfn/9KdnY2bTabW8xm84TJZPrTZDI9MxqNPgiGYZ5lZWU9zczMnDAYDC16vV5LEEQq8bLFcdyHFovFybKsKzs7G0GYzWYcJpMJGY1GHAzD4MjKykKZmZk49Hr9vsFgeEhR1INbN87z/H2O456wLOu1WCyIZVkUK4DBYMCh1+u9NE0/Zhjm/Vsxz3FcicViOeE4DoH5JAAgnU4H8Q9N00WqGSdJ8lWe53+0Wq0IzKsAgGiahvgB/ldSzdvt9ntWq3WK53l0CwBIq9X+RpLkvWSOPDZ/iwCIoqjZtLS01xIGgLIRBAGbhwDjklkIMJ8IgE6nQxkZGThCAZ5fe5yo+S/BfCgAjHhPTw+amZlB/f39KDc3F5sF0xKAZD7UeDgAGBUEAfX29qKpqSnU1taGjYcBII1GUxiX+by8vPcEQTgOBwCD29vbSNLl5SUaGRnBpSUZLioqQpWVlai+vh5HRUUFKigoCJYLZGx0dBR5vd7g31lbW4OyeQEgPT39hCTJ2KdYURSf2Gw2FA4A4ff7UbgODw/R+vo6BpKTx+PBRo+Pj1+4d3V1FREArlEU9X1M5nmef2Cz2byRAHJycpBaouQBvCRJfhTL6DtFUUSRAOAljjbK8er8/BzKRQ4A3oWHisw7HI5UURT35QDgHdjY2Eg6wPLycrQMAIALNo03AtjtdhrMRwKA0W9tbUWBQCDpAIFAANXV1WHzkQAgOyRJUkrKp0UOAKbQ/f19pJb29vaw6SgAXyvJwC+RAGCabG5uRmqruro6aD4cQKPRjCvJwNNIAFA+Y2NjqgMMDQ1hwzIA60oycBIJAMpnYWFBdYDZ2VlsVgbgWEkGvJEAYPVcWVlRHWBxcTEawJUSALdcBubn51UHmJ6ejgbwr5IS+kvuHRgfH1cdYHh4WPYdIElyVwnA73KzUGdnp+oAjY2N0WahZSUA43LrAGyd3W63aubdbjde6aOsA2NKAOqiLWSQYrU0ODgYdSHTaDTVNwKIoviJHIDUTsK2Odna3NwMNjpRAD6OazMnmZf2Q1BKS0tLSd3IcRwXsSMLAdgjCCKFUCKbzdYqAYBp6LBqamqCTTwE1KrD4UBbW1txG9/Z2UEdHR1B4xF64lCAm/dBoSdvoiheAgCM/MDAAO7CoHRqa2vxoiY199D7lpSU4GcmJyfR6emprGG4B89AL11YWIiNSicS4acSYQBXNE1/QMQiURS/k0oIRryhoSHYEpaWlv4vGwACjTxch9ZQTj6fD5WVleHe+KZjlYwQgPT09G9iMv88C28LguAKXcicTic6OjrCWwooMciEBACZgFX0Js3NzWGzMQD8TZLkO0Q8EgThi0j9wMHBAYaA+i0uLsbR1dWFLi4ubgQ4OzvDBmMAyIvLfEgmHoV2ZO3t7bh7glhdXUW7u7vI5XLhXaQSwfeUAlAU5SSSoBRBEH6SemIol+7u7oRWZIUAPyftR5D8/Pw3eJ6fkNYDgIDPTU1NqK+vD5+uQbemtFdWADDOMMzrRJKVYrVaO0MPd0PPReHYMBkAWq32W1V/frJarZ9zHOcKP51OAsC+Vqv9jLgN5ebmvsVxXD/LsleJAuh0ukudTveIYZg3idsWwzDvsiz7ldls3q2qqkJKVV5eDuVyoNfrOw0Gw33iZQshlHp0dPTp6elpg8fj+dXn861fX18f+P1+DwR89vl8f8A9eAaehe8Qd7rTnYhE9R+kV7M+FoRFRQAAAABJRU5ErkJggg==",
        url: "https://www.github.com",
        position: 4,
      },
      {
        id: crypto.randomUUID(),
        name: "Spotify",
        src: "data:image/png;base64,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",
        url: "https://open.spotify.com/",
        position: 5,
      },
      {
        id: crypto.randomUUID(),
        name: "Reddit",
        src: "data:image/png;base64,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",
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
