import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Stack,
  Title,
  TextInput,
  Button,
  Group,
  Divider,
  Skeleton,
  LoadingOverlay,
} from "@mantine/core";
import { Api } from "@/api";

const parseQuery = (search: string) => {
  return new URLSearchParams(search);
};

export const SEORoute = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSEOData = async (currentUrl: string) => {
    console.log("Fetching SEO data for", currentUrl);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // const response = await Api.post("/url-descriptive-suitability", {
    //   url: currentUrl,
    // });
    // console.log(response);
    // return response;
    return {
      data: {
        message: "success",
      },
    };
  };

  const seoQuery = useQuery({
    queryKey: ["seoData", url],
    queryFn: () => fetchSEOData(url),
    enabled: false,
  });

  const handleStartScan = () => {
    navigate(`?url=${encodeURIComponent(url)}`);
  };

  useEffect(() => {
    const queryParams = parseQuery(location.search);
    const urlParam = queryParams.get("url");
    if (urlParam) {
      setUrl(decodeURIComponent(urlParam));
      setTimeout(() => {
        seoQuery.refetch();
      }, 500);
    }
  }, [location.search, seoQuery.refetch]);

  const isLoading = seoQuery.isFetching;
  const isDataReady = !!seoQuery.data;

  return (
    <div className="container mx-auto py-4">
      <Stack>
        <Title order={1}>SEO Dashboard</Title>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStartScan();
          }}
        >
          <Group align="end" className="mb-4 max-w-lg">
            <TextInput
              label="Enter URL to scan"
              placeholder="https://example.com"
              value={url}
              className="flex-1"
              onChange={(event) => setUrl(event.currentTarget.value)}
              required
            />
            <Button type="submit">Start Scan</Button>
          </Group>
        </form>

        {isLoading && <LoadingOverlay visible></LoadingOverlay>}

        {isDataReady && (
          <Stack>
            <Divider />
            <h2>Showing results for {url}</h2>
            <div>{JSON.stringify(seoQuery.data, null, 2)}</div>
          </Stack>
        )}
      </Stack>
    </div>
  );
};

