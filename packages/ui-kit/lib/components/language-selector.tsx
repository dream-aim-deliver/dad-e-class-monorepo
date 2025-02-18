import * as React from 'react';
import { language } from '@maany_shr/e-class-models';
import { Button } from './button';
import { IconClose } from './icons/icon-close';
import { Dropdown } from './dropdown';

export interface LanguageSelectorProps {
  text: {
    title?: string,
    choosetext?: string,
    interface?: string,
    chooseLanguage?: string,
    chooseColor?: string,
    chooseOptions?: string,
  },
  selectedLanguages: language.TLanguage[];
  onChange?: (languages: language.TLanguage[]) => void;
  onInterfaceLanguageChange?: (language: language.TLanguage | null) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  text,
  onChange,
  onInterfaceLanguageChange
}) => {
  const [interfaceLanguage, setInterfaceLanguage] = React.useState<language.TLanguage | null>(null);
  const [spokenLanguages, setSpokenLanguages] = React.useState<language.TLanguage[]>(selectedLanguages);

  React.useEffect(() => {
    setSpokenLanguages(selectedLanguages);
  }, [selectedLanguages]);

  const handleSpokenLanguagesChange = (selected: string[] | string | null) => {
    if (!selected) return;

    const newLanguages = Array.isArray(selected)
      ? selectedLanguages.filter(lang => selected.includes(lang.code))
      : selectedLanguages.filter(lang => lang.code === selected);

    setSpokenLanguages(newLanguages);
    onChange?.(newLanguages);
  };

  const handleRemoveLanguage = (languageToRemove: language.TLanguage) => {
    const newLanguages = spokenLanguages.filter(lang => lang.code !== languageToRemove.code);
    setSpokenLanguages(newLanguages);
    onChange?.(newLanguages);
  };

  const handleInterfaceLanguageChange = (selected: string | string[] | null) => {
    if (typeof selected === 'string') {
      const newLanguage = selectedLanguages.find(lang => lang.code === selected) || null;
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
        <div className="flex gap-6">
          <Dropdown
            key={spokenLanguages.map(lang => lang.code).join(',')}
            type="multiple-choice-and-search"
            options={selectedLanguages.map(lang => ({
              label: lang.name,
              value: lang.code
            }))}
            defaultValue={spokenLanguages.map(lang => lang.code)}
            onSelectionChange={handleSpokenLanguagesChange}
            className="w-[200px]"
            text={{
              simpleText: text?.chooseLanguage,
              multiText: text?.chooseOptions,
              colorText: text?.chooseColor
            }}
          />
          <div data-testid="selected-languages" className="flex items-center gap-2 flex-wrap">
            {spokenLanguages.map(lang => (

              <Button
                onClick={() => handleRemoveLanguage(lang)}
                variant="text"
                size="medium"
                className="gap-2 px-0"
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
          options={selectedLanguages.map(lang => ({
            label: lang.name,
            value: lang.code
          }))}
          onSelectionChange={handleInterfaceLanguageChange}
          className="w-fit"
          text={{
            simpleText: text?.chooseLanguage,
            multiText: text?.chooseOptions,
            colorText: text?.chooseColor
          }}
        />

      </div>
    </div>
  );
};