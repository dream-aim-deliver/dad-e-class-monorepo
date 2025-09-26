import {InputField} from "../input-field";
import React, { FC } from "react";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

interface HeaderAdminProps extends isLocalAware {
  headers: { columnTitle: string; selected: boolean }[];
  onHeaderChange: (index: number, value: string) => void;
}

const HeaderAdmin: FC<HeaderAdminProps> = ({ headers, onHeaderChange, locale }) => {
  const dictionary = getDictionary(locale);
  // Always show 3 columns, fill with defaults if missing
  const columns = [0, 1, 2].map(i =>
    headers[i] ?? { columnTitle: "", selected: false }
  );

  return (
    <div className="flex gap-2 items-center w-full justify-between">
      <div className="flex-1"></div>
      {columns.map((header, index) => (
        <div className="flex-1" key={index}>
          <InputField
            inputText={dictionary.components.oneOutOfThreeLesson.columnTitle}
            value={header.columnTitle}
            setValue={(value) => onHeaderChange(index, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default HeaderAdmin;