'use client';

import * as React from 'react';
import { language } from '@maany_shr/e-class-models';
import { Button } from './button';
import { IconClose } from './icons/icon-close';
import { Dropdown } from './dropdown';

export interface LanguageSelectorProps {
  text: {
    title?: string;
    choosetext?: string;
    interface?: string;
    chooseLanguage?: string;
    chooseColor?: string;
    chooseOptions?: string;
  };
  selectedLanguages: language.TLanguage[];
  onChange?: (languages: language.TLanguage[]) => void;
  onInterfaceLanguageChange?: (language: language.TLanguage | null) => void;
}

/**
 * A reusable LanguageSelector component for managing spoken and interface languages.
 *
 * @param text Object containing customizable labels and placeholder texts:
 *   - `title`: Label for the "Languages Spoken Fluently" section.
 *   - `interface`: Label for the "Interface Language" section.
 *   - `chooseLanguage`: Placeholder text for choosing a language.
 *   - `chooseOptions`: Placeholder text for multiple-choice dropdowns.
 * @param selectedLanguages The list of all available languages, each with:
 *   - `name`: The display name of the language (e.g., "English").
 *   - `code`: The unique code representing the language (e.g., "EN").
 * @param onChange Callback triggered when spoken languages change. Receives an updated array of selected languages.
 * @param onInterfaceLanguageChange Callback triggered when the interface language changes. Receives the new interface language or `null`.
 *
 * @example
 * <LanguageSelector
 *   text={{
 *     title: "Languages Spoken Fluently",
 *     interface: "Interface Language",
 *     chooseLanguage: "Select a language",
 *     chooseOptions: "Choose options",
 *   }}
 *   selectedLanguages={[
 *     { name: "English", code: "EN" },
 *     { name: "Spanish", code: "ES" },
 *   ]}
 *   onChange={(languages) => console.log("Spoken languages updated:", languages)}
 *   onInterfaceLanguageChange={(language) => console.log("Interface language changed:", language)}
 * />
 */

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  text,
  onChange,
  onInterfaceLanguageChange,
}) => {
  const [interfaceLanguage, setInterfaceLanguage] =
    React.useState<language.TLanguage | null>(null);
  const [spokenLanguages, setSpokenLanguages] =
    React.useState<language.TLanguage[]>(selectedLanguages);

  React.useEffect(() => {
    setSpokenLanguages(selectedLanguages);
  }, [selectedLanguages]);

  const handleSpokenLanguagesChange = (selected: string[] | string | null) => {
    if (!selected) return;

    const newLanguages = Array.isArray(selected)
      ? selectedLanguages.filter((lang) => selected.includes(lang.code as string))
      : selectedLanguages.filter((lang) => lang.code === selected);

    setSpokenLanguages(newLanguages);
    onChange?.(newLanguages);
  };

  const handleRemoveLanguage = (languageToRemove: language.TLanguage) => {
    const newLanguages = spokenLanguages.filter(
      (lang) => lang.code !== languageToRemove.code,
    );
    setSpokenLanguages(newLanguages);
    onChange?.(newLanguages);
  };

  const handleInterfaceLanguageChange = (
    selected: string | string[] | null,
  ) => {
    if (typeof selected === 'string') {
      const newLanguage =
        selectedLanguages.find((lang) => lang.code === selected) || null;
      setInterfaceLanguage(newLanguage);
      onInterfaceLanguageChange?.(newLanguage);
    } else {
      setInterfaceLanguage(null);
      onInterfaceLanguageChange?.(null);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Languages Spoken Fluently */}
      <div className="flex flex-col gap-2">
        <label className="text-sm flex items-start text-text-secondary leading-[100%]">
          {text?.title}
        </label>
        <div className="flex md:gap-6 flex-wrap">
          <Dropdown
            key={spokenLanguages.map((lang) => lang.code).join(',')}
            type="multiple-choice-and-search"
            options={selectedLanguages.map((lang) => ({
              label: lang.name as string,
              value: lang.code as string,
            }))}
            defaultValue={spokenLanguages.map((lang) => lang.code as string)}
            onSelectionChange={handleSpokenLanguagesChange}
            className="w-[200px]"
            text={{
              simpleText: text?.chooseLanguage,
              multiText: text?.chooseOptions,
              colorText: text?.chooseColor,
            }}
          />
          <div
            data-testid="selected-languages"
            className="flex items-center gap-2 flex-wrap"
          >
            {spokenLanguages.map((lang) => (
              <Button
                onClick={() => handleRemoveLanguage(lang)}
                variant="text"
                size="medium"
                className="gap-2"
                text={lang.name}
                hasIconRight
                key={lang.code}
                iconRight={<IconClose />}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interface Language */}
      <div className="flex flex-col gap-2">
        <label className="text-sm flex items-start text-text-secondary leading-[100%]">
          {text?.interface}
        </label>
        <Dropdown
          type="simple"
          options={selectedLanguages.map((lang) => ({
            label: lang.name as string,
            value: lang.code as string,
          }))}
          onSelectionChange={handleInterfaceLanguageChange}
          className="w-fit"
          text={{
            simpleText: text?.chooseLanguage,
            multiText: text?.chooseOptions,
            colorText: text?.chooseColor,
          }}
        />
      </div>
    </div>
  );
};
