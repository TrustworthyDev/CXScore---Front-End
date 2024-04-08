const fetchBase64DataFromImageUrl = async (imageUrl: string) => {
  const headers = new Headers();
  const authToken = localStorage.getItem(ACCESSTOKEN_KEY);
  headers.set("Authorization", `Bearer ${authToken}`);

  if (!imageUrl.startsWith(cxscoreApiUrl)) {
    if (!imageUrl.startsWith("/")) {
      imageUrl = "/" + imageUrl;
    }
    imageUrl = cxscoreApiUrl + imageUrl;
  }

  const res = await fetch(imageUrl, {
    method: "GET",
    headers: headers,
  });

  const blob = await res.blob();
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data?.toString());
    };
  });

  return base64 as string;
};

import { QueryKeys } from "../../lookup/query-keys";
import { useQuery } from "@tanstack/react-query";
import { drawViolationBoundsOverBase64Image } from "@/utils";
import { cxscoreApiUrl } from "@/api";
import { ACCESSTOKEN_KEY } from "./use-login";

export const useSnapshotImage = (url: string, bounds: BoundingBox) => {
  const query = useQuery({
    queryKey: QueryKeys.snapshotImage(url),
    queryFn: () => fetchBase64DataFromImageUrl(url),
    select: (data) => drawViolationBoundsOverBase64Image(data, bounds),
    cacheTime: Infinity,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
  };
};
