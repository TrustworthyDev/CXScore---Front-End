import { TicketStatus } from "@/types/enum";
import { useJiraTicketLink } from "../../../../lib/application/use-jira-ticket-link";
import { ExternalLink } from "@/icons/ExternalLink";
import { SmallSpinner } from "../../../atoms/loading";
import clsx from "clsx";

export const TicketLink = (args: {
  ticketStatus: TicketStatus;
  ticketId?: string;
}) => {
  const queryResult = useJiraTicketLink({
    ticketId: args.ticketId ?? "",
    enabled: args.ticketId != undefined,
  });

  if (args.ticketId == null) {
    return (
      <span className="capitalize text-gray-800">{args.ticketStatus}</span>
    );
  }

  return (
    <a
      href={queryResult.data?.link ?? "#"}
      target={queryResult.data?.link ? "_blank" : undefined}
      aria-label="Open ticket in Jira"
      aria-disabled={queryResult.isLoading || queryResult.isError}
      className={clsx(
        "flex cursor-default items-center gap-2 capitalize text-gray-800",
        queryResult.data?.link &&
          "!cursor-pointer  text-blue-600 hover:underline",
        queryResult.isLoading && "cursor-wait",
        queryResult.isError && "cursor-not-allowed"
      )}
    >
      <div>{args.ticketStatus}</div>
      {queryResult.isLoading && <SmallSpinner />}
      {queryResult.data?.link && <ExternalLink className="h-4 w-4" />}
    </a>
  );
};
