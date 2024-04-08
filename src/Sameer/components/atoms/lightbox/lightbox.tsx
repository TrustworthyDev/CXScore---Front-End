import { createPortal } from "react-dom";
import { useSnapshotImage } from "../../../lib/application/use-snapshot-image";
import { useEffect } from "react";
// @ts-ignore
import { Lightbox as LB } from "react-modal-image";

const LightboxRoot = document.getElementById("lightbox-root");

const LightboxPortal = ({ children }: { children: React.ReactNode }) => {
  const el = document.createElement("div");

  useEffect(() => {
    LightboxRoot?.appendChild(el);
    return () => {
      LightboxRoot?.removeChild(el);
    };
  }, [el]);

  return createPortal(children, el);
};

export const Lightbox = ({
  onClose,
  url,
  bounds,
}: {
  onClose: () => void;
  url: string;
  bounds: Rectangle;
}) => {
  const query = useSnapshotImage(url, bounds);

  return (
    <LightboxPortal>
      <LB medium={query.data} large={query.data} onClose={onClose} />
    </LightboxPortal>
  );
};
