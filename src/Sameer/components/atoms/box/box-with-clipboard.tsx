import { ClipboardIcon } from "@/icons/Clipboard";
import { useCopyToClipboard } from "../../../lib/util/use-copy-to-clipboard";

export const BoxWithClipboard = ({
  toCopy,
  title,
  children,
}: {
  toCopy: string;
  title: string;
  children: React.ReactElement;
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-semibold">
        <div className="text-md font-display uppercase">{title}</div>
        <button
          onClick={() => copyToClipboard(toCopy)}
          aria-label="Copy to Clipboard"
        >
          {isCopied ? (
            <ClipboardIcon className="h-5 w-5 stroke-green-700" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="bg-slate-100 p-2">{children}</div>
    </div>
  );
};
