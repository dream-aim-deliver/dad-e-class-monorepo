'use client';

import * as React from 'react';
import { language } from '@maany_shr/e-class-models';
import { Button } from './button';
import { IconClose } from './icons/icon-close';
import { Dropdown } from './dropdown';

export interface LanguageSelectorProps {
  text: {
    title?: string;
    chooseText?: string;
    interface?: string;
    chooseLanguage?: string;
    chooseColor?: string;
    chooseOptions?: string;
  };
  selectedLanguages: language.TLanguage[];
  availableLanguages: language.TLanguage[];
  availableInterfaceLanguages?: language.TLanguage[];
  selectedInterfaceLanguage: language.TLanguage | null;
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
 * @param selectedLanguages The list of currently selected spoken languages by the user.
 * @param availableLanguages (Optional) The list of all available languages to choose from. If not provided, `selectedLanguages` is used.
 *   Each language should have:
 *   - `id`: The unique identifier of the language (string or number).
 *   - `name`: The display name of the language (e.g., "English").
 *   - `code`: The unique code representing the language (e.g., "EN").
 *   - `state`: The state of the language (always "created").
 *   - `createdAt`: The date when the language was created.
 *   - `updatedAt`: The date when the language was last updated.
 * @param selectedInterfaceLanguage (Optional) The currently selected interface language.
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
 *     { id: 1, name: "English", code: "EN", state: "created", createdAt: new Date(), updatedAt: new Date() },
 *   ]}
 *   availableLanguages={[
 *     { id: 1, name: "English", code: "EN", state: "created", createdAt: new Date(), updatedAt: new Date() },
 *     { id: 2, name: "Spanish", code: "ES", state: "created", createdAt: new Date(), updatedAt: new Date() },
 *   ]}
 *   selectedInterfaceLanguage={{ id: 1, name: "English", code: "EN", state: "created", createdAt: new Date(), updatedAt: new Date() }}
 *   onChange={(languages) => console.log("Spoken languages updated:", languages)}
 *   onInterfaceLanguageChange={(language) => console.log("Interface language changed:", language)}
 * />
 */

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  availableLanguages,
  availableInterfaceLanguages,
  selectedInterfaceLanguage,
  text,
  onChange,
  onInterfaceLanguageChange,
}) => {
  const languageOptions = availableLanguages;
  const interfaceLanguageOptions = availableInterfaceLanguages ?? availableLanguages;

  const [interfaceLanguage, setInterfaceLanguage] =
    React.useState<language.TLanguage | null>(selectedInterfaceLanguage || null);
  const [spokenLanguages, setSpokenLanguages] =
    React.useState<language.TLanguage[]>(selectedLanguages);

  React.useEffect(() => {
    setSpokenLanguages(selectedLanguages);
  }, [selectedLanguages]);

  React.useEffect(() => {
    setInterfaceLanguage(selectedInterfaceLanguage || null);
  }, [selectedInterfaceLanguage]);

  const handleSpokenLanguagesChange = (selected: string[] | string | null) => {
    if (!selected) return;

    const newLanguages = Array.isArray(selected)
      ? languageOptions.filter((lang) => selected.includes(lang.code as string))
      : languageOptions.filter((lang) => lang.code === selected);

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
        interfaceLanguageOptions.find((lang) => lang.code === selected) || null;
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
            type="multiple-choice-and-search"
            options={languageOptions.map((lang) => ({
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
          options={interfaceLanguageOptions.map((lang) => ({
            label: lang.name as string,
            value: lang.code as string,
          }))}
          defaultValue={interfaceLanguage?.code as string}
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
