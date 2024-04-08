import clsx from "clsx";

export const Skeleton = ({
  className,
  hideLoadingText = false,
}: {
  className?: string;
  hideLoadingText?: boolean;
}) => {
  return (
    <div role="status" className={"animate-pulse"}>
      <div
        className={clsx("h-2.5 w-48 rounded-full bg-gray-200", className)}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

