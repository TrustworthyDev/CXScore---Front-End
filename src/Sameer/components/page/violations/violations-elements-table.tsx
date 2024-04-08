import { useViolationsCountByElement } from "../../../lib/violations/count";
import { ElementsTable } from "../common/table/elements-table";

export const ViolationsElementsTable = () => {
  const { data, isLoading, isError } = useViolationsCountByElement();

  if (isError) {
    return <div className="text-red-500">Error in fetching elements</div>;
  }

  return <ElementsTable data={data ?? []} isLoading={isLoading} />;
};
