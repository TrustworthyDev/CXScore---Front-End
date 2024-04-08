import { Api, submitScanRequest } from "@/api";
import { ManualTestResult, TicketStatus } from "@/types/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ApiCreateTicketResultItem = {
  violationId: string;
  ticketId: string;
  status: TicketStatus;
  error: string;
};

const createNewTicketFn = async (args: { violationIds?: string[] }) => {
  return Api.post<unknown, ApiCreateTicketResultItem[]>("/create-ticket", {
    violations: args.violationIds ?? [],
  });
};

export const useCreateNewTicket = (handleSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(createNewTicketFn, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["query-violation"],
      });
      queryClient.invalidateQueries({
        queryKey: ["count-violation"],
      });
      handleSuccess?.();
    },
    onError: () => {
      console.log("useCreateNewTicket: onError");
    },
  });

  return mutation;
};

type PostViolationBody = {
  manualTestResult?: ManualTestResult;
  ticketStatus?: TicketStatus;
  notes?: string;
};

const postViolationFn = async (args: {
  violationIds?: string[];
  payload: PostViolationBody;
}) => {
  return Promise.all(
    (args.violationIds ?? []).map((violationId) => {
      return Api.post<unknown, unknown>(`/violation/${violationId}`, {
        ...args.payload,
      });
    })
  );
};

export const usePostViolation = (handleSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(postViolationFn, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["query-violation"],
      });
      queryClient.invalidateQueries({
        queryKey: ["count-violation"],
      });
      handleSuccess?.();
    },
    onError: () => {
      console.log("usePostViolation: onError");
    },
  });

  return mutation;
};

export const useSubmitScanRequest = (handleSuccess?: (res: any) => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(submitScanRequest, {
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({
        queryKey: ["ScansData"],
      });
      handleSuccess?.(res);
    },
    onError: () => {
      console.log("useSubmitScanRequest: onError");
    },
  });

  return mutation;
};
