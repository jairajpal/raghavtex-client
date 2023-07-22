import { DropDown } from "@/pages/api/types";
import React, { useState, useRef, useEffect } from "react";

interface MultiSelectDropdownProps {
  options: DropDown[];
  type: string;
  selectedValues: string[];
  handleSelectOption: (value: string, type: string) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  type,
  handleSelectOption,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    const handleClickInside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickInside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickInside);
    };
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-36 bg-inherit px-2 py-3 rounded-[12px] outline-none text-neutral-50 text-14 transition duration-200 border border-neutral-750"
        onClick={toggleDropdown}
      >
        <span className="flex-1">
          {selectedValues.length === 0 ? "Select an option" : ""}
          {selectedValues.length > 0 &&
            selectedValues.map((value) => (
              <span
                key={value}
                className="mr-1 px-1 border border-neutral-400 rounded-md"
              >
                {value}{" "}
                <button
                  type="button"
                  onClick={() => handleSelectOption(value, type)}
                  className="ml-1 text-xs leading-none bg-red-500 text-black px-1 rounded-md hover:bg-red-600"
                >
                  x
                </button>
              </span>
            ))}
        </span>
        <button onClick={() => handleSelectOption("", type)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 bg-black"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 7.293a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414L11.414 10l2.293 2.293a1 1 0 0 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 0-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {showDropdown && (
        <div className="absolute w-32 max-h-36 bg-white border border-neutral-400 rounded-md shadow-md mt-2 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option._id}
              className={`cursor-pointer hover:bg-green-300 ${
                selectedValues.includes(option.name)
                  ? "bg-green-300"
                  : "bg-slate-700"
              } text-neutral-50 text-14 py-2 px-4 border-b border-neutral-400 last:border-b-0`}
              onClick={() => handleSelectOption(option.name, type)}
            >
              <span className="mr-2 text-12">
                {selectedValues.includes(option.name) ? "✓" : ""}
              </span>
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
