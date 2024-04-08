import { CircleClose } from "@/icons/CircleClose";
import { CirclePlusIcon } from "@/icons/CirclePlus";
import { ScanIcon } from "@/icons/ScanIcon";
import { Table } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { HorizontalSeparator } from "../../../Sameer/components/atoms/seperator/horizontal-separator";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Group,
  Popover,
  Text,
} from "@mantine/core";

export const ColumnSelectionDropdown = <T extends object>({
  table,
  initialColumnVisibility = {},
  excludeColumns = [],
  showSearchIndicator = true,
}: {
  table: Table<T>;
  initialColumnVisibility?: Record<string, boolean>;
  excludeColumns?: string[];
  showSearchIndicator?: boolean;
}) => {
  const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

  const resetColumnVisibilityHandler = useCallback(() => {
    table.setColumnVisibility(initialColumnVisibility);
  }, [initialColumnVisibility, table]);

  const toggleColumnVisibiltyHandler =
    table.getToggleAllColumnsVisibilityHandler();

  const handleClickChangeMenu = useCallback(() => setIsColumnSelectionOpen(v => !v), []);
  const closeMenu = useCallback(() => setIsColumnSelectionOpen(false), []);

  const isAllSelected = Object.entries(table.getState().columnVisibility).every(
    ([, value]) => value
  );

  return (
    <Popover
      opened={isColumnSelectionOpen}
      onChange={setIsColumnSelectionOpen}
      shadow="md"
      trapFocus
    >
      <Popover.Target>
        <Button
          leftSection={
            <CirclePlusIcon stroke="var(--mantine-color-primary-4)" />
          }
          variant="subtle"
          onClick={handleClickChangeMenu}
        >
          Add column
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        style={{ borderRadius: "var(--mantine-radius-sm)", padding: 0 }}
      >
        <Box
          className="flex items-center justify-between gap-2 py-3 px-2"
          style={{
            background: "var(--mantine-color-primary-4)",
            borderRadius:
              "var(--mantine-radius-sm) var(--mantine-radius-sm) 0 0",
          }}
        >
          <Box className="whitespace-nowrap font-display text-lg font-bold text-white">
            Select columns to show
          </Box>

          <Box className="flex flex-row flex-wrap justify-center gap-2">
            <Button
              variant="white"
              size="xs"
              onClick={toggleColumnVisibiltyHandler}
            >
              {isAllSelected ? "De-select" : "Select All"}
            </Button>
            <Button
              variant="white"
              size="xs"
              onClick={resetColumnVisibilityHandler}
            >
              Reset
            </Button>
            <ActionIcon
              aria-label="Close button"
              variant="transparent"
              onClick={closeMenu}
            >
              <CircleClose size={20} stroke="white" fill="white" />
            </ActionIcon>
          </Box>
        </Box>
        {showSearchIndicator && (
          <Group px="sm" py="xs" gap={0}>
            <Text color="red">Note:</Text>
            <ScanIcon aria-label="Searchable" height={"14px"} fill="black" />
            <Text color="red">Indicates that the field is searchable</Text>
          </Group>
        )}
        <HorizontalSeparator />
        <ul
          className="columns-2 space-y-1 p-2 text-left text-sm text-gray-700"
          aria-labelledby="dropdownDefaultButton"
        >
          {table.getAllLeafColumns().map((column) => {
            if (excludeColumns.includes(column.id)) {
              return null;
            }
            return (
              <li key={column.id} className="">
                <Checkbox
                  label={
                    <Group gap="0.1rem">
                      <Text size="sm">{column.columnDef.footer as string}</Text>
                      {showSearchIndicator && column.id.includes("*") && (
                        <ScanIcon
                          aria-label="Searchable"
                          height={"14px"}
                          fill="black"
                        />
                      )}
                    </Group>
                  }
                  styles={{ body: { alignItems: "center" } }}
                  size="xs"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
              </li>
            );
          })}
        </ul>
      </Popover.Dropdown>
    </Popover>
  );
};
