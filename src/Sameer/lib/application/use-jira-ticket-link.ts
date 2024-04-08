import { Api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../lookup/query-keys";

const getFetchJiraTicketLinkFn = (ticketId: string) => {
  return () =>
    Api.get<unknown, ApiTicketLinkResult>(`/ticket-link/${ticketId}`);
};

export const useJiraTicketLink = (args: {
  ticketId: string;
  enabled: boolean;
}) => {
  const queryResult = useQuery({
    queryKey: QueryKeys.jiraTicketLink(args.ticketId),
    queryFn: getFetchJiraTicketLinkFn(args.ticketId),
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnMount: false,
    enabled: args.enabled,
  });

  return queryResult;
};
