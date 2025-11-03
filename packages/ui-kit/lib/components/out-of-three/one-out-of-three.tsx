'use client';

import {InputField} from "../input-field";
import  { FC, useState } from "react";
import HeaderAdmin from "./header-admin";
import RowHeader from "./row-admin";
import {Button} from "../button";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { RadioButton } from "../radio-button";
import { IconTrashAlt } from "../icons/icon-trash-alt";
import { IconButton } from "../icon-button";

interface OneOutOfThreeData {
  tableTitle: string;
  columns: {
    id?: string;
    columnTitle: string;
    selected: boolean;
  }[];
  rows: {
    id?: string;
    rowTitle: string;
    columns: {
      id?: string;
      columnTitle: string;
      selected: boolean;
    }[];
  }[];
}

interface OneOutOfThreeProps extends isLocalAware {
  data?: OneOutOfThreeData;
  onUpdate: (updatedData: OneOutOfThreeData) => void;
}

const OneOutOfThree: FC<OneOutOfThreeProps> = ({ data, onUpdate,locale }) => {
  const dictionary = getDictionary(locale);

  // Ensure data has the required columns property for backward compatibility
  if (data && !data.columns) {
    // Initialize columns from first row or create empty columns
    const initialColumns = data.rows[0]?.columns || [
      { columnTitle: "", selected: false },
      { columnTitle: "", selected: false },
      { columnTitle: "", selected: false }
    ];
    // Update data to include columns property
    onUpdate({ ...data, columns: initialColumns });
    return null; // Let the component re-render with the updated data
  }

  // Change table title
  const handleTableTitleChange = (value: string) => {
    if (!data) return;
    onUpdate({ ...data, tableTitle: value });
  };

  // Delete a row
  const deleteRow = (rowIndex: number) => {
    if (!data) return;
    const updatedRows = data.rows.filter((_, index) => index !== rowIndex);
    onUpdate({ ...data, rows: updatedRows });
  };

  // Change column header (update both data.columns and sync to all rows)
  const handleHeaderChange = (colIndex: number, value: string) => {
    if (!data) return;

    // Update the main columns array (ensure 3 columns)
    const updatedColumns = [0, 1, 2].map(i =>
      data.columns[i] ?? { columnTitle: "", selected: false }
    );
    updatedColumns[colIndex] = {
      columnTitle: value,
      selected: updatedColumns[colIndex]?.selected ?? false,
    };

    // Update all rows to sync with the new column title
    const updatedRows = data.rows.map(row => {
      const columns = [0, 1, 2].map(i =>
        row.columns[i] ?? { columnTitle: "", selected: false }
      );
      columns[colIndex] = {
        columnTitle: value,
        selected: columns[colIndex]?.selected ?? false,
      };
      return { ...row, columns };
    });

    onUpdate({ ...data, columns: updatedColumns, rows: updatedRows });
  };
  

  // Change row title
  const handleRowTitleChange = (rowIndex: number, value: string) => {
    if (!data) return;
    const updatedRows = [...data.rows];
    const row = updatedRows[rowIndex];
    if (row && row.columns) {
      updatedRows[rowIndex] = {
        rowTitle: value,
        columns: row.columns,
      };
      onUpdate({ ...data, rows: updatedRows });
    }    
  };

  // Select correct column for a row (radio button logic)
  const handleSelectColumn = (rowIndex: number, colIndex: number) => {
    if (!data) return;
    const updatedRows = data.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      // Ensure 3 columns
      const columns = [0, 1, 2].map(i =>
        row.columns[i] ?? { columnTitle: "", selected: false }
      );
      const newColumns = columns.map((col, cIdx) => ({
        ...col,
        selected: cIdx === colIndex,
      }));
      return { ...row, columns: newColumns };
    });
    onUpdate({ ...data, rows: updatedRows });
  };
  
  // Add a new row with same columns structure
  const addRow = () => {
    if (!data) return;
    // Use data.columns as template instead of data.rows[0]?.columns
    const columnTemplates = data.columns || [];
    // Ensure 3 columns
    const columns = [0, 1, 2].map(i => ({
      columnTitle: columnTemplates[i]?.columnTitle || "",
      selected: false,
    }));
    const newRow = {
      rowTitle: "",
      columns,
    };
    onUpdate({ ...data, rows: [...data.rows, newRow] });
  };

  return (
    <div className="flex p-4 flex-col items-start  border-[1px] border-divider rounded-medium w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-[15px] mt-4">
          <InputField
            inputText={dictionary.components.oneOutOfThreeLesson.tableTitle}
            value={data?.tableTitle || ""}
            setValue={(value) => handleTableTitleChange(value)}
          />
          <HeaderAdmin
            headers={data?.columns || []}
            onHeaderChange={handleHeaderChange}
            locale={locale}
          />
          {data?.rows && data.rows.length > 0 && data.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <RowHeader
                  row={row}
                  rowIndex={rowIndex}
                  onRowTitleChange={handleRowTitleChange}
                  onSelectColumn={handleSelectColumn}
                  locale={locale}
                />
              </div>
              <IconButton
                icon={<IconTrashAlt />}
                onClick={() => deleteRow(rowIndex)}
                styles="text"
                size="small"
                title={dictionary.components.formRenderer.delete}

              />
            </div>
          ))}
          <Button 
              variant="secondary" 
              onClick={addRow}
              text={dictionary.components.lessons.addChoice}
              className="w-full"
          />
        </div>
      </div>
    </div>
  );
};



export interface OneOutOfThreePreviewProps  {
  data: OneOutOfThreeData;
  displayOnly: boolean;
  onChange?: (updatedData: OneOutOfThreeData) => void;
  required: boolean;
 }
 
 const OneOutOfThreePreview: FC<OneOutOfThreePreviewProps> = ({
   data,
   displayOnly,
   onChange,
   required,
 }) => {
   // Ensure data has columns property for backward compatibility
   const dataWithColumns = data.columns ? data : {
     ...data,
     columns: data.rows[0]?.columns || [
       { columnTitle: "", selected: false },
       { columnTitle: "", selected: false },
       { columnTitle: "", selected: false }
     ]
   };

   // We need to keep track of selected columns for each row if displayOnly is false
   const [rows, setRows] = useState(dataWithColumns.rows);
 
   const handleChange = (rowIdx: number, colIdx: number) => {
     if (displayOnly) return; // Do nothing if displayOnly is true
 
     // Update the rows state to select only the clicked column in the row
     const updatedRows = rows.map((row, rIdx) => {
       if (rIdx !== rowIdx) return row;
       return {
         ...row,
         columns: row.columns.map((col, cIdx) => ({
           ...col,
           selected: cIdx === colIdx,
         })),
       };
     });
     
     // Call onChange only if it exists
     if (onChange) {
       // Create a new OneOutOfThreeData object with updated rows
       const updatedData: OneOutOfThreeData = {
         tableTitle: dataWithColumns.tableTitle,
         columns: dataWithColumns.columns,
         rows: updatedRows
       };
       onChange(updatedData);
     }
     
     setRows(updatedRows);
   };
 
   return (
     <div className="flex flex-col gap-4">
       <div className="flex flex-col gap-4">
         <h3>
           {dataWithColumns.tableTitle}
           {required && <span className="text-feedback-error-primary ml-1 text-sm">*</span>}
         </h3>
         <div className="flex flex-col gap-[18px]">
           {/* Headers */}
           <div className="grid grid-cols-[repeat(4,_1fr)_0.2fr] gap-2 w-full">
             <div className="flex items-center justify-center"></div>
             {dataWithColumns.columns.map((col, idx) => (
               <div key={idx} className="flex items-center justify-center">
                 <p className="md:text-lg text-text-primary text-sm leading-[150%] text-center">
                   {col.columnTitle}
                 </p>
               </div>
             ))}
             <div className="flex items-center justify-center"></div>
           </div>
           {/* Rows */}
           {rows.map((row, rowIdx) => (
             <div 
             className="grid grid-cols-[repeat(4,_1fr)_0.2fr] gap-2 w-full items-center" 
             key={rowIdx}
           >
             <div className="flex items-center">
               <p className="text-md text-text-primary leading-[150%]">
                 {row.rowTitle}
               </p>
             </div>
             {row.columns.map((col, colIdx) => (
               <div
                className="flex-1 flex justify-center items-center" 
                 key={colIdx}
               >
                 
                   <RadioButton
                     name={`row-${rowIdx}`}
                     value={`col-${colIdx}`}
                     checked={col.selected}
                     disabled={displayOnly}
              
                     onChange={() => handleChange(rowIdx, colIdx)}
                   />
               
               </div>
             ))}
             <div className="flex items-center justify-center"></div>
           </div>
           ))}
         </div>
       </div>
     </div>
   );
 };
 
export { OneOutOfThree, OneOutOfThreePreview, type OneOutOfThreeData };