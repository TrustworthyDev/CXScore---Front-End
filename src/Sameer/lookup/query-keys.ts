import { CountViolationsFetchArgs } from "../lib/violations/count";
import {
  QueryViolationFetchArgs,
  ToQueryViolationFieldMatchQueryArgs,
  ToQueryViolationOutputArgs,
} from "../lib/violations/query";

export const QueryKeys = {
  jiraTicketLink: (ticketId: string) => ["ticket-link", ticketId],
  stateSummary: (
    doDedupe: boolean,
    opts: ToQueryViolationFieldMatchQueryArgs,
  ) => [
    "state-summary",
    opts?.appId,
    opts?.scanId,
    opts?.stateIds?.sort() ?? [],
    doDedupe,
    opts?.wcagFilters?.sort() ?? [],
    opts?.checkedFilters?.sort() ?? [],
    opts?.overrideFieldMatchQuery ?? [],
  ],
  user: () => ["user"],
  reportPermission: () => ["reportPermission"],
  application: (appId: string) => ["application", appId],
  discoveryByScanId: (scanId: string) => ["discovery", scanId],
  healthScoreByScanId: (scanId: string) => ["health-score", scanId],
  snapshotImage: (snapshotUrl: string) => ["snapshot-image", snapshotUrl],
  violationItem: (violationId: string) => ["violation-item", violationId],
  queryViolation: (args: QueryViolationFetchArgs) => {
    const {
      appId,
      scanId,
      stateIds,
      wcagFilters,
      checkedFilters,
      profile,
      overrideFieldMatchQuery,
      ...restFieldMatchQueryArgs
    } = args.fieldMatchQueryOpts ?? {};

    const {
      textSearch,
      sort,
      pagination,
      getAllViolations,
      deDuplicate,
      overrideOutput,
      ...restOutputOpts
    } = args.outputOpts ?? {};

    return [
      "query-violation",
      appId,
      scanId,
      stateIds?.sort() ?? [],
      wcagFilters?.sort() ?? [],
      checkedFilters?.sort() ?? [],
      profile,
      overrideFieldMatchQuery ?? [],
      { ...restFieldMatchQueryArgs },
      textSearch,
      sort,
      pagination,
      getAllViolations,
      deDuplicate,
      overrideOutput,
      { ...restOutputOpts },
    ];
  },
  countViolation: (args: CountViolationsFetchArgs) => {
    const {
      appId,
      scanId,
      stateIds,
      wcagFilters,
      checkedFilters,
      overrideFieldMatchQuery,
      ...restFieldMatchQueryOpts
    } = args.fieldMatchQueryOpts ?? {};

    const { textSearch, deDuplicate, overrideOutput, ...restOutputOpts } =
      args.outputOpts ?? {};

    return [
      "count-violation",
      appId,
      scanId,
      stateIds?.sort() ?? [],
      wcagFilters?.sort() ?? [],
      checkedFilters?.sort() ?? [],
      overrideFieldMatchQuery ?? [],
      { ...restFieldMatchQueryOpts },
      args.countByFields?.sort() ?? [],
      textSearch,
      deDuplicate,
      overrideOutput,
      { ...restOutputOpts },
    ];
  },
  mutation: {
    setSelectedApplication: () => ["selected-application"],
  },
};

