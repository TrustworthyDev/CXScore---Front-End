import clsx from "clsx";
import accessbotLogoPath from "../../../images/accessbot-white-logo.png";

export const AccessbotLogo = (props: any) => {
  return (
    <img
      alt="Accessbot Logo"
      src={accessbotLogoPath}
      className={clsx("w-32 object-contain md:w-48", props.className)}
    />
  );
};
