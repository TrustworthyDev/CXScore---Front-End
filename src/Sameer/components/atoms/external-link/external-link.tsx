import { Tooltip } from "@mantine/core";
import clsx from "clsx";

export const ExternalLink = ({
  labelMaxCharacters = 70,
  ...props
}: {
  href: string;
  label: string;
  // uses the max characters to limit the width of the label
  labelMaxCharacters?: number;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Tooltip label={props.label} withArrow>
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        href={props.href}
        // dynamic style to limit the width of the label
        style={{
          maxWidth: `${labelMaxCharacters}ch`,
        }}
        className={clsx(
          "inline-block overflow-hidden text-ellipsis whitespace-nowrap hover:underline focus:underline",
          props.className
        )}
      >
        {props.label}
      </a>
    </Tooltip>
  );
};
