import React from "react";

export type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export const Image: React.FC<ImageProps> = ({ ...props }) => {
  return <img {...props} />;
};
