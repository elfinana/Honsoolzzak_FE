import { Dispatch, SetStateAction } from 'react';

interface SelectorProps {
  title: string;
  selections: string[];
  displayedSelections: string[];
  selectedOption: string;
  handleOptionClick: Dispatch<SetStateAction<string>>;
}
export const HorizontalSelector = ({
  title,
  selections,
  displayedSelections,
  selectedOption,
  handleOptionClick,
}: SelectorProps) => {
  console.log(selectedOption);
  return (
    <section className="f-col mt-3">
      <p className="text-lg font-bold mb-2 text-[#454545]">{title}</p>
      <div className="f-ic w-full justify-between gap-3">
        {selections.map((option, index) => (
          <div
            role="none"
            key={option}
            className={`text-sm text-center w-full border-2 px-3 py-1 border-[#929292] rounded-lg cursor-pointer ${
              selectedOption === option
                ? 'bg-primary-50 text-primary-200 border-primary-200'
                : ''
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {displayedSelections[index]}
          </div>
        ))}
      </div>
    </section>
  );
};
