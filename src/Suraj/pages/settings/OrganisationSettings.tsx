import {
  Box,
  Button,
  Divider,
  Group,
  List,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { EditPen } from "@/icons/EditPen";

import { ApiOrganisation } from "./settings-api.d";
import { useOrganisation } from "./settings-query";
import { useSelectedAppId } from "../../../Sameer/lib/application/use-application-data";

export const OrganisationSettings = () => {
  const navigate = useNavigate();

  const selectedAppId = useSelectedAppId();

  const organisations = useOrganisation(selectedAppId ?? null);

  const handleCreateOrgClick = () => {
    navigate("create");
  };

  const handleEditOrgItemClick = (itemId: string | number) => {
    navigate(`edit/${itemId}`, { state: { itemId } });
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
        <Button variant="transparent" onClick={handleCreateOrgClick}>
          Create an Organization
        </Button>
        <Divider orientation="horizontal" my="md" />
        <Box px="lg">
          <List
            styles={{
              itemWrapper: { width: "100%" },
              itemLabel: { width: "100%" },
            }}
          >
            {organisations.data?.result ? (
              organisations.data?.result.map(
                (item: ApiOrganisation, index: number) => (
                  <List.Item
                    key={index}
                    px="md"
                    py="xs"
                    mb="md"
                    className="border border-solid border-[#D9D9D9]"
                  >
                    <Group justify="space-between">
                      <Text>{item.organisationName}</Text>
                      <Button
                        variant="transparent"
                        leftSection={<EditPen size={21} />}
                        onClick={() => {
                          handleEditOrgItemClick(item._id);
                        }}
                      >
                        Edit
                      </Button>
                    </Group>
                  </List.Item>
                ),
              )
            ) : (
              <Loader />
            )}
          </List>
        </Box>
      </Box>
    </>
  );
};
