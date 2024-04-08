import { useViolationsDoDeduplicate } from "../../../lib/violations/dedupe";
import { Switch } from "@mantine/core";

export const ViolationsDedupeToggle = () => {
  const [doDeduplicate, setDoDeduplicate] = useViolationsDoDeduplicate();

  return (
    <div>
    <Switch
      size="lg"
      labelPosition="left"
      label="De-duplicate"
      checked={doDeduplicate}
      onChange={(e) => setDoDeduplicate(e.target.checked)}
    />
    </div>
  );
};

