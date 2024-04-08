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
import { useNavigate } from "react-router";

import { useUser } from "~/Sameer/lib/application/use-login";

import { CancelAndSave } from "./CancelAndSave";
import { ApiOrganisation } from "./settings-api";
import { createEditorganisation, useOrganisationById } from "./settings-query";

export const CreateEditOrg = () => {
  const newOrganisation = {
    photo: null as File | null,
    orgId: "",
    _id: "",
    organisationName: "",
    businessType: "",
    emailAddress: "",
    phone: "",
    address: "",
    country: "",
    language: "",
    timezone: "",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ApiOrganisation>(newOrganisation);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  // const { id } = useParams<{ id: string }>();
  const { data: user } = useUser();
  const editOrg = useOrganisationById(user?.orgId ?? null);
  useEffect(() => {
    if (editOrg?.data) {
      setFormData(editOrg.data);
    }
  }, [editOrg.data]);

  const businessTypes = [
    "banking",
    "trading",
    // Add more business types as needed
  ];

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

  const handleBusinessType = (value: string | null) => {
    setFormData((prevData) => ({
      ...prevData,
      businessType: value || "",
    }));
  };

  // const handleImageChange = (value: File | null) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     photo: value,
  //   }));
  // };
  const isRequiredFieldEmpty = () => {
    const requiredFields = ["organisationName", "businessType"];
    const emptyFields = [];
    for (const field of requiredFields) {
      if (!formData[field as keyof ApiOrganisation]) {
        emptyFields.push(field);
      }
    }
    return emptyFields;
  };
  function handleSave(): void {
    const emptyRequiredFields = isRequiredFieldEmpty();
    if (emptyRequiredFields.length === 0) {
      createEditorganisation({
        ...formData,
      });
      setFormData(newOrganisation);

      navigate("/settings/organisation/"); // Redirect to the specified absolute path
    } else {
      console.log("AppId is null or required fields are empty");
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
        Organization
      </Title>
      <Text mb="lg" size="sm" c="secondary">
        This section allows you to create your organisation and edit information
      </Text>

      <Title order={4}>Edit an Organization</Title>
      <Divider orientation="horizontal" />
      <form ref={formRef}>
        <Box className="container mx-auto py-6">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Organization Name"
                required
                id="organisationName"
                name="organisationName"
                value={formData.organisationName}
                onChange={handleChange}
                error={highlightedFields.includes("organisationName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Business Type"
                data={businessTypes}
                value={formData.businessType}
                onChange={handleBusinessType}
                error={highlightedFields.includes("businessType")}
                placeholder="Select a business type"
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Primary Email Address"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Country"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Language"
                id="language"
                name="language"
                value={"English"}
                onChange={handleChange}
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
          </Grid>
        </Box>
      </form>
      <CancelAndSave handleSave={handleSave} />
    </Box>
  );
};
