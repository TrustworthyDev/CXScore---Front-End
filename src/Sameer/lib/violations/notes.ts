import { Api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useViolationById } from "./query";

const getUpdateViolationNoteFn = (id: string) => {
  return (note: string) => Api.post(`/violation/${id}`, { notes: note });
};

export const useViolationNote = (args: { violationId: string }) => {
  const updateFn = getUpdateViolationNoteFn(args.violationId);
  const queryClient = useQueryClient();
  const violationQuery = useViolationById(args);
  const mutation = useMutation<unknown, unknown, string>({
    mutationFn: updateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["violation-item", args.violationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["query-violation"],
      });
    },
    onError: () => {
      console.log("useViolationNote: onError");
    },
  });

  return {
    postNote: mutation.mutate,
    isPostNoteLoading: mutation.isLoading,
    isPostNoteError: mutation.isError,
    note: violationQuery.data?.notes ?? "",
    isNoteLoading: violationQuery.isLoading,
    isNoteFetching: violationQuery.isFetching,
  };
};
