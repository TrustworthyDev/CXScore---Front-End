import {
  Box,
  Divider,
  Grid,
  Select,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { CancelAndSave } from "./CancelAndSave";
import { ApiAsset } from "./settings-api";
import { useAssetById, useCreateEditAsset } from "./settings-query";

export const CreateEditDigitalAsset = () => {
  const newAsset = {
    _id: "",
    orgId: "",
    assetName: "",
    domainName: "",
    department: "",
    versionNumber: "",
    assetType: "",
    language: "",
    timezone: "",
    description: "",
  };
  const assetTypes = [
    "web application",
    "mobile application",
    "document",
    // Add more business types as needed
  ];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ApiAsset>(newAsset);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const { id } = useParams<{ id: string }>();
  const asset = useAssetById(id ?? null);
  const { mutate: createEditAsset } = useCreateEditAsset();
  useEffect(() => {
    if (asset?.data) {
      setFormData(asset.data);
    }
  }, [asset.data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectAssetType = (value: string | null) => {
    setFormData((prevData) => ({
      ...prevData,
      assetType: value || "",
    }));
  };

  const isRequiredFieldEmpty = () => {
    const requiredFields = ["assetType", "assetName"];
    const emptyFields = [];
    for (const field of requiredFields) {
      if (!formData[field as keyof ApiAsset]) {
        emptyFields.push(field);
      }
    }
    return emptyFields;
  };

  function handleSave(): void {
    const emptyRequiredFields = isRequiredFieldEmpty();
    if (emptyRequiredFields.length === 0) {
      createEditAsset({
        ...formData,
      });
      setFormData(newAsset);
      navigate("/settings/digital_assets/"); // Redirect to the specified absolute path
    } else {
      console.error("AppId is null or required fields are empty");
      setHighlightedFields(emptyRequiredFields);
      if (formRef.current && emptyRequiredFields.length > 0) {
        // Scroll to the first empty required field
        const firstEmptyField = document.getElementById(emptyRequiredFields[0]);
        if (firstEmptyField) {
          firstEmptyField.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }

  return (
    <Box>
      <Title order={3} mb="sm">
        Assets
      </Title>
      <Text c="secondary" mb="lg" size="sm">
        This section allows you to change basic Profile & Personal Information.
      </Text>

      <Title order={4}>Create a Digital Asset</Title>
      <Divider orientation="horizontal" />
      <form ref={formRef}>
        <Box className="container mx-auto p-6">
          <Grid>
            <Grid.Col span={6}>
              <Select
                placeholder="Select a business type"
                label="Asset Type"
                required
                id="assetType"
                name="assetType"
                value={formData.assetType}
                onChange={handleSelectAssetType}
                error={highlightedFields.includes("assetType")}
                data={assetTypes}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Asset Name"
                required
                id="assetName"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                error={highlightedFields.includes("assetName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Domain Name"
                id="domainName"
                name="domainName"
                value={formData.domainName}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Ownership / Departments"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Version Number (for documents, mention date of creation)"
                id="versionNumber"
                name="versionNumber"
                value={formData.versionNumber}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Language"
                id="language"
                name="language"
                value={"English"}
                disabled
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Time Zone"
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Description"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid.Col>
          </Grid>
        </Box>
      </form>
      <CancelAndSave handleSave={handleSave} />
    </Box>
  );
};
