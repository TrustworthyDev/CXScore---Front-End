import { useCallback, useState } from "react";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => setIsCopied(true));
  }, []);
  return { isCopied, copyToClipboard };
};
