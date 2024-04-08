import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  List,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router";

import { EditPen } from "@/icons/EditPen";
import { PlusIcon } from "@/icons/PlusIcon";
import { TrashIcon } from "@/icons/Trash";
import { useUser } from "~/Sameer/lib/application/use-login";

import { useDeleteUser, useOrgUser } from "./settings-query";

export const UsersSettings = () => {
  const navigate = useNavigate();

  const currentUser = useUser();
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const users = useOrgUser(currentUser.data?.orgId);
  const { mutate: deleteUser } = useDeleteUser();

  const handleUserItemClick = (itemId: string) => {
    navigate(`edit/${itemId}`, { state: { itemId } });
  };
  const handleDeleteItem = async (itemId: string) => {
    setDeletingUser(itemId);
    try {
      await deleteUser(itemId);
      setDeletingUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setDeletingUser(null);
    }
  };

  const handleCreateUserClick = () => {
    navigate("create");
  };

  return (
    <>
      <Box>
        <Title order={3} mb="sm">
          Users
        </Title>
        <Text mb="lg" size="sm" c="secondary">
          This section allows you to manage your Users.
        </Text>
        <Button
          variant="transparent"
          leftSection={<PlusIcon size={22} />}
          onClick={handleCreateUserClick}
        >
          Create a User
        </Button>
        <Divider orientation="horizontal" my="md" />
        <Box px="lg">
          <Title order={4}>Manage User</Title>

          <List
            styles={{
              itemWrapper: { width: "100%" },
              itemLabel: { width: "100%" },
            }}
          >
            {users.data?.result ? (
              users.data?.result.map((item, index) => (
                <List.Item
                  key={index}
                  px="md"
                  py="xs"
                  mb="md"
                  className="border border-solid border-[#D9D9D9]"
                >
                  <Group justify="space-between">
                    <Text>{`${item.firstName} ${
                      item.lastName ? item.lastName : ""
                    }`}</Text>

                    <Group>
                      <Button
                        variant="transparent"
                        leftSection={<EditPen size={21} />}
                        onClick={() => {
                          handleUserItemClick(item._id);
                        }}
                      >
                        Edit
                      </Button>
                      <ActionIcon
                        aria-label="Delete"
                        variant="transparent"
                        onClick={() => {
                          handleDeleteItem(item._id);
                        }}
                        loading={deletingUser === item._id}
                      >
                        <TrashIcon fill="red" size={21} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </List.Item>
              ))
            ) : (
              <Loader />
            )}
          </List>
        </Box>
      </Box>
    </>
  );
};
