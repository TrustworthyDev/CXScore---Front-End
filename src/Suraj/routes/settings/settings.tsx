import { Box, Grid, Title } from "@mantine/core";
import { Route, Routes } from "react-router-dom";

import { CreateEditDigitalAsset } from "~/Suraj/pages/settings/CreateEditDigitalAsset";
import { CreateEditOrg } from "~/Suraj/pages/settings/CreateEditOrg";
import { CreateEditUser } from "~/Suraj/pages/settings/CreateUserSettings";
import { DigitalAssetsSettings } from "~/Suraj/pages/settings/DigitalAssetsSettings";
import { OrganisationSettings } from "~/Suraj/pages/settings/OrganisationSettings";
import { SettingsSideMenu } from "~/Suraj/pages/settings/SettingsSideMenu";
import { UsersSettings } from "~/Suraj/pages/settings/UserSettings";

export interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = () => {
  return (
    <Box px="lg">
      {/* <HeadingOne className="text-[#545454]" text="Admin settings" /> */}
      <Title order={3}>Admin settings</Title>
      <Grid columns={5}>
        <Grid.Col span={1} px="md">
          <SettingsSideMenu />
        </Grid.Col>
        <Grid.Col span={4} px="md">
          <Routes>
            <Route path="/organisation/edit/:id" element={<CreateEditOrg />} />
            <Route path="/organisation/*" element={<CreateEditOrg />} />
            <Route
              path="/digital_assets/edit/:id"
              element={<CreateEditDigitalAsset />}
            />
            <Route
              path="/digital_assets/*"
              element={<CreateEditDigitalAsset />}
            />
            <Route path="/users/edit/:id" element={<CreateEditUser />} />
            <Route path="/users/*" element={<CreateEditUser />} />
            {/* <Route path="/organisation" element={<OrganisationSettings />} /> */}
            <Route path="/digital_assets" element={<DigitalAssetsSettings />} />
            <Route path="/users" element={<UsersSettings />} />
            <Route path="/" element={<OrganisationSettings />} />
          </Routes>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
