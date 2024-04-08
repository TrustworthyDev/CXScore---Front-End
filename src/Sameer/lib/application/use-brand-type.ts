import { useEffect } from "react";
import { useLocalStorageState } from "../util/use-local-storage-state";
import { useUser } from "./use-login";
import { BrandType } from "@/types/enum";

export const BRANDTYPE_KEY = "api/brandtype" as const;

export const usePersistedBrandType = () => {
  const [brandType, setBrandType] = useLocalStorageState<BrandType | "">(
    BRANDTYPE_KEY,
    ""
  );
  const { data, isLoading } = useUser();

  useEffect(() => {
    if (data?.brandType) {
      setBrandType(data.brandType);
    }
  }, [data]);

  return { brandType, isLoading };
};
