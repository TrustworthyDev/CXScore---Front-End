import { List, Paper, Text, Title } from "@mantine/core";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

interface sideMenuObject {
  id: string;
  title: string;
  desc: string;
}

export enum SettingsTypes {
  organisation = "organisation",
  digital_assets = "digital_assets",
  users = "users",
}

const sideMenuList: sideMenuObject[] = [
  {
    id: SettingsTypes.organisation,
    title: "Organization",
    desc: "View your digital assets settings. Change Information, add or remove assets",
  },
  {
    id: SettingsTypes.digital_assets,
    title: "Digital Assets",
    desc: "View all applications created for your digital assets",
  },
  {
    id: SettingsTypes.users,
    title: "Users",
    desc: "View your profile settings. Change Information, Reset Password and etc.",
  },
];

export const SettingsSideMenu = () => {
  const navigate = useNavigate();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleMenuItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    navigate(itemId, { state: { itemId } });
  };
  return (
    <List>
      {sideMenuList.map((item: sideMenuObject, index: number) => (
        <List.Item
          key={index}
          onClick={() => {
            handleMenuItemClick(item.id);
          }}
          className={clsx({ active: selectedItemId === item.id })}
        >
          <Link to={`${item.id}`}>
            <Paper shadow="lg" mb="xl" p="lg">
              <Title order={4}>{item.title}</Title>
              <Text>{item.desc}</Text>
            </Paper>
          </Link>
        </List.Item>
      ))}
    </List>
  );
};
