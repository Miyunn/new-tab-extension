import React, { KeyboardEvent } from "react";
import GoogleIcon from "../../assets/icons/search-engine/icons8-google.svg";
import BingIcon from "../../assets/icons/search-engine/icons8-bing.svg";
import DuckDuckGoIcon from "../../assets/icons/search-engine/icons8-duckduckgo.svg";
import chromeSearch from "../../assets/icons/search-engine/chrome-svgrepo-com.svg";

interface Props {
  searchEngine: string;
  searchBarWidth: number;
}

const EngineIcon: React.FC<{ searchEngine: string }> = ({ searchEngine }) => {
  switch (searchEngine) {
    case "chromeSearch":
      return (
        <img src={chromeSearch} alt="Browser Default" height={20} width={20} />
      );
    case "duckduckgo":
      return (
        <img src={DuckDuckGoIcon} alt="DuckDuckGo" height={25} width={25} />
      );
    case "bing":
      return <img src={BingIcon} alt="Bing" height={20} width={20} />;
    default:
      return <img src={GoogleIcon} alt="Google" height={20} width={20} />;
  }
};

const SearchBar: React.FC<Props> = ({ searchEngine, searchBarWidth }) => {
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search(searchEngine);
    }
  };

  const handleClick = () => {
    search(searchEngine);
  };

  const search = (searchEngine: string) => {
    const searchText = (
      document.getElementById("search") as HTMLInputElement
    )?.value.trim();
    if (!searchText) return;

    const searchUrls: Record<string, string> = {
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(searchText)}`,
    };

    if (searchEngine === "chromeSearch" && chrome?.search) {
      chrome.search.query({ text: searchText });
      return;
    }

    const searchUrl =
      searchUrls[searchEngine] ||
      `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;

    if (typeof chrome == "undefined") {
      window.location.href = searchUrl;
    } else {
      if (chrome?.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          activeTab?.id
            ? chrome.tabs.update(activeTab.id, { url: searchUrl })
            : chrome.tabs.create({ url: searchUrl });
        });
      }
    }
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <EngineIcon searchEngine={searchEngine} />
        </div>
        <input
          type="text"
          id="search"
          className="bg-gray-50 border border-gray-300 text-gray-900 
          text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
          placeholder="Search"
          style={
            searchBarWidth
              ? { width: `${searchBarWidth}px` }
              : { width: "300px" }
          }
          required
          onKeyDown={handleKeyPress}
        />
        <button
          type="button"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
          onClick={handleClick}
        >
          <svg
            className="w-4 h-4 text-gray-500 hover:text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.or￼g/2000/svg"
            fill="none"
            viewBox="0 0 22 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
