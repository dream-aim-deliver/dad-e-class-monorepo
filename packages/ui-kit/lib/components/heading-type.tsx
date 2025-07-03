import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { ReactNode, useState } from "react";
import { InputField } from "./input-field";
import { Dropdown } from "./dropdown";
import { HeadingOptions } from "../utils/constants";

interface HeadingLessonProps extends isLocalAware {
  onChange?: (value: HeadingType) => void;
  initialHeadingValue?: string;
  initialHeadingType?: string;

}
/**
 * HeadingLesson Component
 * Renders a heading input field with a dropdown for selecting heading type
 * 
 * @param onChange - Callback function to handle changes in heading value
 * @param locale - The locale for translation
 */


export type HeadingType = {
  heading: string;
  type: string;
}

const HeadingLesson = ({ initialHeadingValue, initialHeadingType, onChange, locale }: HeadingLessonProps) => {
  const dictionary = getDictionary(locale);
  const [headingValue, setHeadingValue] = useState<HeadingType>({
    heading: initialHeadingValue || "",
    type: initialHeadingType || "h1"
  });


  const handleChange = (newValue: HeadingType) => {
    setHeadingValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex gap-2">
      <InputField
        setValue={(value: string) => handleChange({ ...headingValue, heading: value })}
        value={headingValue.heading}
        type="text"
        className="w-full"
        inputText={dictionary.components.lessons.headingPlaceholder}
      />
      <Dropdown
        defaultValue={headingValue.type}
        position="bottom"
        type="simple"

        text={{
          simpleText: 'Select an option'
        }}
        options={HeadingOptions}
        onSelectionChange={(selected: string | string[] | null) => {
          if (!selected || typeof selected !== 'string') return;
          handleChange({ ...headingValue, type: selected })}
        }
      />
    </div>
  );
};

/**
 * HeadingLessonPreview Component
 * Renders a preview of the heading input field with the selected heading type
 * 
 * @param headingValue - The current heading value and type
 */
const HeadingLessonPreview = ({ headingValue }: { headingValue: HeadingType }) => {
  const renderHeading = (): ReactNode => {

    switch (headingValue.type) {
      case "h1":
        return <h1>{headingValue.heading}</h1>;
      case "h2":
        return <h2>{headingValue.heading}</h2>;
      case "h3":
        return <h3>{headingValue.heading}</h3>;
      case "h4":
        return <h4>{headingValue.heading}</h4>;
      case "h5":
        return <h5>{headingValue.heading}</h5>;
      case "h6":
        return <h6>{headingValue.heading}</h6>;
      default:
        return <h1>{headingValue.heading}</h1>;
    }

  }
  return (
    <div className="flex gap-2">
      {renderHeading()}
    </div>
  );

};

export { HeadingLesson, HeadingLessonPreview };

