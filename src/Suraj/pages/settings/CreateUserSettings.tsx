import {
  Box,
  Divider,
  Grid,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { CancelAndSave } from "./CancelAndSave";
import { ApiUser, RoleType } from "./settings-api.d";
import { useCreateEditUser, useUserById } from "./settings-query";

export const CreateEditUser = () => {
  const newUser = {
    _id: "",
    orgId: "",
    firstName: "",
    lastName: "",
    photo: null as File | null,
    role: "",
    department: "",
    designation: "",
    userName: "",
    assignedAssets: "",
    emailAddress: "",
    phoneNumber: "",
    country: "",
    language: "",
    timezone: "",
    password: "",
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ApiUser>(newUser);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const { id } = useParams<{ id: string }>();
  const user = useUserById(id ?? null);

  const { mutate: createEditUser } = useCreateEditUser();

  useEffect(() => {
    if (user?.data) {
      setFormData(user.data);
    }
  }, [user.data]);

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

  const handleChangeRoleType = (value: string | null) => {
    setFormData((prevData) => ({
      ...prevData,
      role: value || "",
    }));
  };

  const isRequiredFieldEmpty = () => {
    const requiredFields = ["role", "firstName", "userName", "password"];
    const emptyFields = [];
    for (const field of requiredFields) {
      if (!formData[field as keyof ApiUser]) {
        emptyFields.push(field);
      }
    }
    return emptyFields;
  };

  const handleSave = (): void => {
    const emptyRequiredFields = isRequiredFieldEmpty();
    if (emptyRequiredFields.length === 0) {
      createEditUser({
        ...formData,
      });
      setFormData(newUser);
      navigate("/settings/users/"); // Redirect to the specified absolute path
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
  };

  return (
    <Box>
      <Title order={3} mb="sm">
        Users
      </Title>
      <Text mb="lg" size="sm" c="secondary">
        This section allows you to change basic Profile & Personal Information.
      </Text>
      <Title order={4} mb="sm">
        Profile
      </Title>
      <Divider orientation="horizontal" my="md" />
      <form ref={formRef}>
        <Box className="container mx-auto p-6">
          <Grid>
            <Grid.Col span={6}>
              <Select
                id="role"
                name="role"
                label="Role"
                data={Object.values(RoleType)}
                value={formData.role}
                onChange={handleChangeRoleType}
                required
                error={highlightedFields.includes("role")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="First Name"
                required
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={highlightedFields.includes("firstName")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Department"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Designation"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Username"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                error={highlightedFields.includes("userName")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              {!id && (
                <PasswordInput
                  label="Password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={highlightedFields.includes("password")}
                />
              )}
            </Grid.Col>
          </Grid>
        </Box>
        <Title order={4} mb="sm">
          Personal information
        </Title>
        <Divider orientation="horizontal" my="md" />
        <Box className="container mx-auto p-6">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                type="email"
                label="Email Address"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                type="tel"
                label="Phone Number"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                type="text"
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
