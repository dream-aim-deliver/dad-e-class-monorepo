import {InputField} from "../input-field";
import {RadioButton} from "../radio-button";
import  { FC } from "react";

interface RowHeaderProps {
  row: {
    rowTitle: string;
    columns: { columnTitle: string; selected: boolean }[];
  };
  rowIndex: number;
  onRowTitleChange: (rowIndex: number, value: string) => void;
  onSelectColumn: (rowIndex: number, colIndex: number) => void;
  disabled?: boolean;
}

const RowHeader: FC<RowHeaderProps> = ({
  row,
  rowIndex,
  disabled=false,
  onRowTitleChange,
  onSelectColumn,
}) => {
  // Always show 3 columns, fill with defaults if missing
  const columns = [0, 1, 2].map(i =>
    row.columns[i] ?? { columnTitle: "", selected: false }
  );

  return (
    <div className="flex gap-2 items-center w-full">
      <div className="flex-1">
        <InputField
          inputPlaceholder="Row Title"
          value={row.rowTitle}
          setValue={(value) => onRowTitleChange(rowIndex, value)}
        />
      </div>
      {columns.map((col, colIndex) => (
        <div className="flex-1 flex justify-center items-center" key={colIndex}>
          <RadioButton
            value={col.columnTitle}
            name={`row-radio-${rowIndex}`}
            checked={col.selected}
            onChange={() => onSelectColumn(rowIndex, colIndex)}
            disabled={true}
          />
        </div>
      ))}
    </div>
  );
};

export default RowHeader;