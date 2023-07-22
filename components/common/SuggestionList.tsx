import React, { useRef, useEffect } from "react";

interface SuggestionItem {
  name: string;
}

interface Props {
  suggestions: SuggestionItem[];
  index: number;
  setShowDropdown: ({}: any) => void;
  handleSelectSuggestion: (name: string, index: number) => void;
}

const SuggestionList: React.FC<Props> = ({
  suggestions,
  index,
  setShowDropdown,
  handleSelectSuggestion,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown({
          from: false,
          color: false,
          type: false,
          index: 0,
          edit: false,
        });
      }
    };

    // const handleClickInside = (event: MouseEvent) => {
    //   if (
    //     dropdownRef.current &&
    //     dropdownRef.current.contains(event.target as Node)
    //   ) {
    //     setShowDropdown(true);
    //   }
    // };

    document.addEventListener("mousedown", handleClickOutside);
    // document.addEventListener("click", handleClickInside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // document.removeEventListener("click", handleClickInside);
    };
  }, []);
  return (
    <div ref={dropdownRef}>
      <ul className="py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded">
        {suggestions &&
          suggestions.map((option) => (
            <li
              key={option.name}
              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              value={option.name}
              onClick={() => handleSelectSuggestion(option.name, index || 0)}
            >
              {option.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SuggestionList;
