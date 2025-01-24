import * as React from 'react';
import { X } from 'lucide-react';
import { LanguageSelectorProps } from './types';
import { Button } from '../button';

const AVAILABLE_LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'German', code: 'de' },
  { name: 'French', code: 'fr' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [interfaceLanguage, setInterfaceLanguage] = React.useState<
    string | null
  >(null);

  const handleLanguageSelect = (value: string) => {
    const languageExists = selectedLanguages.some(
      (lang) => lang.name === value,
    );

    if (!languageExists && value) {
      const selectedLanguage = AVAILABLE_LANGUAGES.find(
        (lang) => lang.name === value,
      );

      if (selectedLanguage) {
        onChange?.([
          ...selectedLanguages,
          {
            name: selectedLanguage.name,
            code: selectedLanguage.code,
          },
        ]);

        // Reset dropdown
        setSelectedValue('');
      }
    }
  };

  const handleLanguageRemove = (languageToRemove: string) => {
    onChange?.(
      selectedLanguages.filter((lang) => lang.name !== languageToRemove),
    );
  };

  const availableLanguages = AVAILABLE_LANGUAGES.filter(
    (lang) =>
      !selectedLanguages.some((selected) => selected.name === lang.name),
  );

  return (
    <div className="flex flex-col w-full">
      {/* Languages Spoken Fluently */}
      <label className="text-sm text-text-secondary mb-2">
        Languages Spoken Fluently
      </label>
      <div className="flex items-center">
        <select
          data-testid="language-selector"
          value={selectedValue}
          onChange={(e) => handleLanguageSelect(e.target.value)}
          className="flex p-2 pl-4 flex-col items-start rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700 w-[30%] text-base-white outline-none"
        >
          <option value="" disabled>
            Choose Language
          </option>
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.name}>
              {lang.name}
            </option>
          ))}
        </select>
        <div data-testid="selected-languages" className="flex items-center">
          {selectedLanguages.map((lang) => (
            <div
              id={`remove-language-container-${lang.name}`}
              key={lang.name}
              className="flex items-center rounded-full px-2 py-1"
            >
              <Button
                onClick={() => handleLanguageRemove(lang.name)}
                variant="text"
                size="medium"
                className="gap-2"
              >
                {lang.name} <X size={20} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Interface Language */}
      <div className="mt-6">
        <label className="text-sm text-text-secondary mb-2">
          Interface Language
        </label>
        <div className="flex items-center">
          <select
            data-testid="interface-language-selector"
            value={interfaceLanguage || 'English'}
            onChange={(e) => setInterfaceLanguage(e.target.value)}
            className="mt-2 flex p-2 pl-4 flex-col items-start rounded-lg bg-base-neutral-800 border-[1px] border-base-neutral-700 text-base-white outline-none w-[25%]"
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
