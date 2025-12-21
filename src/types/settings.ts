export type BackgroundType = "unsplash" | "color" | "image" | "url";

export interface Settings {
  // background settings
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundUrl: string;
  backgroundTintIntensity: number;
  blurValue: number;
  unsplashQuery: string;
  unsplashAutoRefresh: boolean;
  unsplashFrequency: number;
  unsplashQuality: number;

  // searchbar
  searchBar: boolean;
  searchEngine: string;
  searchBarWidth: number;
  customSearchEngineUrl: string;

  // icon settings
  iconVisibility: boolean;
  iconSize: number;
  iconLabel: boolean;
  iconColumns: number;
  iconGap: number;
  iconOrder: string;
  iconBackground: boolean;
  iconBackgroundColor: string;
  iconBackgroundOpacity: number;
  iconBackgroundRadius: number;
  hideAddIconShortcut: boolean;
}
