import { useGuidedDoDeduplicate } from "../../../lib/guided/dedupe";
import { Switch } from "@mantine/core";

export const GuidedDedupeToggle = () => {
  const [doDeduplicate, setDoDeduplicate] = useGuidedDoDeduplicate();

  return (
    <Switch
      size="lg"
      labelPosition="left"
      label="De-duplicate"
      checked={doDeduplicate}
      onChange={(e) => setDoDeduplicate(e.target.checked)}
    />
  );
};
