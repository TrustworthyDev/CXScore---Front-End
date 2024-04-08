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
import { useNavigate } from "react-router";

import { EditPen } from "@/icons/EditPen";
import { PlusIcon } from "@/icons/PlusIcon";
import { TrashIcon } from "@/icons/Trash";

import { ApiAsset } from "./settings-api";
import { useAsset, useDeleteAsset } from "./settings-query";

export const DigitalAssetsSettings = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useAsset();

  const { mutate: deleteAsset } = useDeleteAsset();

  function groupByField(data: ApiAsset[] | undefined) {
    if (!data || !data.length) {
      return {
        "web application": [],
        "mobile application": [],
        document: [],
      };
    }

    const groups: Record<string, ApiAsset[]> = {
      "web application": [],
      "mobile application": [],
      document: [],
    };

    data.forEach((item: ApiAsset) => {
      const value = item["assetType"];
      if (value === "web application") {
        groups["web application"].push(item);
      } else if (value === "mobile application") {
        groups["mobile application"].push(item);
      } else if (value === "document") {
        groups["document"].push(item);
      }
    });

    return groups;
  }

  const groupedAssets = groupByField(data?.result);

  const handleEditAssestItemClick = (itemId: string | number) => {
    navigate(`edit/${itemId}`, { state: { itemId } });
  };
  const handleDeleteItem = (itemId: string) => {
    deleteAsset(itemId);
  };

  const handleCreateAssetClick = () => {
    navigate("create");
  };
  return (
    <>
      <Box>
        <Title order={3} mb="sm">
          Digital Assets
        </Title>
        <Text mb="lg" size="sm" c="secondary">
          This section allows you to manage your Digital Assets
        </Text>
        <Button
          variant="transparent"
          leftSection={<PlusIcon size={22} />}
          onClick={handleCreateAssetClick}
        >
          Create a digital asset
        </Button>
        <Divider orientation="horizontal" my="md" />

        <Box px="lg">
          <Title order={4}>Web Applications</Title>
          <Divider orientation="horizontal" my="sm" />
          <List
            styles={{
              itemWrapper: { width: "100%" },
              itemLabel: { width: "100%" },
            }}
          >
            {!isLoading ? (
              groupedAssets["web application"].map((item, index) => (
                <List.Item
                  key={index}
                  px="md"
                  py="xs"
                  mb="md"
                  className="border border-solid border-[#D9D9D9]"
                >
                  <Group justify="space-between">
                    <Text>{item.assetName}</Text>
                    <Group>
                      <Button
                        variant="transparent"
                        leftSection={<EditPen size={21} />}
                        onClick={() => {
                          handleEditAssestItemClick(item._id);
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
          <Title order={4}>Mobile Applications</Title>
          <Divider orientation="horizontal" my="sm" />
          <List
            styles={{
              itemWrapper: { width: "100%" },
              itemLabel: { width: "100%" },
            }}
          >
            {!isLoading ? (
              groupedAssets["mobile application"].map((item, index) => (
                <List.Item
                  key={index}
                  px="md"
                  py="xs"
                  mb="md"
                  className="border border-solid border-[#D9D9D9]"
                >
                  <Group justify="space-between">
                    <Text>{item.assetName}</Text>
                    <Group>
                      <Button
                        variant="transparent"
                        leftSection={<EditPen size={21} />}
                        onClick={() => {
                          handleEditAssestItemClick(item._id);
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
          <Title order={4}>Documents</Title>
          <Divider orientation="horizontal" my="sm" />
          <List
            styles={{
              itemWrapper: { width: "100%" },
              itemLabel: { width: "100%" },
            }}
          >
            {!isLoading ? (
              groupedAssets["document"].map((item, index) => (
                <List.Item
                  key={index}
                  px="md"
                  py="xs"
                  mb="md"
                  className="border border-solid border-[#D9D9D9]"
                >
                  <Group justify="space-between">
                    <Text>{item.assetName}</Text>
                    <Group>
                      <Button
                        variant="transparent"
                        leftSection={<EditPen size={21} />}
                        onClick={() => {
                          handleEditAssestItemClick(item._id);
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
