export interface InputFieldProps {
  label: string;
  value: string;
  isOptional?: boolean;
  onChange?: (value: string) => void;
}

export interface PasswordFieldProps {
  value: string;
  onChangeClick: () => void;
}

export interface ProfilePictureProps {
  imageSrc: string;
  fileName: string;
  fileSize: string;
  actionIconSrc: string;
  onUpload?: (value: string) => void;
}

export interface LanguageProps {
  name: string;
  code: string;
}

export interface LanguageSelectorProps {
  selectedLanguages: LanguageProps[];
  onChange: (languages: LanguageProps[]) => void;
}
