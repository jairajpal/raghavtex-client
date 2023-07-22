import React from "react";

interface SuggestionItem {
  name: string;
}

interface Props {
  suggestions: SuggestionItem[];
  handleInputForEditChallan: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const SuggestionListEdit: React.FC<Props> = ({
  suggestions,
  handleInputForEditChallan,
}) => {
  return (
    <ul className="py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded">
      {suggestions &&
        suggestions.map((option) => (
          <li
            key={option.name}
            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
            value={option.name}
            onClick={(event) =>
              handleInputForEditChallan({
                target: { name: "date", value: option.name },
              })
            }
          >
            {option.name}
          </li>
        ))}
    </ul>
  );
};

export default SuggestionListEdit;
