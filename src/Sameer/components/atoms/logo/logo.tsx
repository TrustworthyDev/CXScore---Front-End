import { BrandType } from "@/types/enum";
import { usePersistedBrandType } from "../../../lib/application/use-brand-type";
import { AccessbotLogo } from "./accessbot-logo";
import { CXScoreLogo } from "./cxscore-logo";

export const Logo = (props: any) => {
  const { brandType } = usePersistedBrandType();

  switch (brandType) {
    case BrandType.accessbot:
      return <AccessbotLogo {...props} />;
    case BrandType.cxscore:
      return <CXScoreLogo {...props} />;
    default:
      return <CXScoreLogo {...props} />;
  }
};
