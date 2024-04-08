import { Button } from "@/atoms";
import { TextInput } from "@/atoms/TextInput";
import React, { Dispatch, FC, SetStateAction } from "react";
import { TrashIcon } from "@/icons/Trash";

export interface tableData {
  id: string;
  selector: any;
}

export interface ScanSettingsTableProps {
  settingsData: tableData[];
  setSettingsData: Dispatch<SetStateAction<any>>;
}

const ScanSettingsTable: FC<ScanSettingsTableProps> = ({
  setSettingsData,
  settingsData,
}) => {
  const handleSelectorInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedData = [...settingsData];
    updatedData[index].selector = event.target.value;
    setSettingsData(updatedData);
  };

  const handleDelete = (index: number) => {
    const updatedData = [...settingsData];
    updatedData.splice(index, 1);
    setSettingsData(updatedData);
  };

  const handleAddRow = () => {
    const newRow: tableData = {
      id: String(settingsData.length + 1),
      selector: "",
    };
    setSettingsData([...settingsData, newRow]);
  };

  return (
    <div>
      <table className="w-full border-separate border-0 border-slate-500 pt-4">
        <thead className="bg-[#35ACEF]">
          <tr>
            <th className="border-t-0 border-b-0 border-slate-600 py-1 font-bold text-white">
              Selector
            </th>
          </tr>
        </thead>
        <tbody>
          {settingsData.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="border border-slate-700">
                <TextInput
                  name="scanName"
                  value={row.selector}
                  onChange={(event) => handleSelectorInput(event, index)}
                  placeholder="Enter Selector"
                  className="h-10 w-full"
                />
              </td>
              <td>
                <button className="w-4" onClick={() => handleDelete(index)}>
                  <TrashIcon size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-2">
        <Button
          className="w-1/5 rounded-none"
          color="primaryFour"
          onClick={handleAddRow}
        >
          + Add
        </Button>
      </div>
    </div>
  );
};

export default ScanSettingsTable;
