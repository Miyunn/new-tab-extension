import React, { KeyboardEvent } from "react";
import GoogleIcon from "../../assets/icons/search-engine/icons8-google.svg";
import BingIcon from "../../assets/icons/search-engine/icons8-bing.svg";
import DuckDuckGoIcon from "../../assets/icons/search-engine/icons8-duckduckgo.svg";

interface Props {
  searchEngine: string;
  searchBarWidth: number;
}

const EngineIcon: React.FC<{ searchEngine: string }> = ({ searchEngine }) => {
  switch (searchEngine) {
    case "duckduckgo":
      return (
        <img src={DuckDuckGoIcon} alt="DuckDuckGo" height={25} width={25} />
      );
    case "bing":
      return <img src={BingIcon} alt="Bing" height={20} width={20} />;
    default:
      return <img src={GoogleIcon} alt="Google Icon" height={20} width={20} />;
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
    const searchText = (document.getElementById("search") as HTMLInputElement)
      .value;
    if (searchText) {
      let searchUrl = "";
      switch (searchEngine) {
        case "duckduckgo":
          searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`;
          break;
        case "bing":
          searchUrl = `http://www.bing.com/search?q=${encodeURIComponent(searchText)}`;
          break;
        default:
          searchUrl = `http://www.google.com/search?q=${encodeURIComponent(searchText)}`;
          break;
      }
      window.location.href = searchUrl;
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
