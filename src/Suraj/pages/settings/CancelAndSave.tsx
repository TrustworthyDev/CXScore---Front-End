import { Button, Group } from "@mantine/core";

interface CancelAndSaveProps {
  handleSave: () => void;
}

export const CancelAndSave: React.FC<CancelAndSaveProps> = ({ handleSave }) => {
  const handleCancel = () => {
    // Navigate back to the previous page or URL
    window.history.back();
  };

  return (
    <Group justify="end">
      <Button color="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Save</Button>
    </Group>
  );
};
