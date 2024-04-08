import { GuidedActions, GuidedSelectors } from "@/reduxStore/guided/guided";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGuidedDoDeduplicate = () => {
  const doDeDuplicate = useSelector(GuidedSelectors.selectDoDeDuplicate);

  const dispatch = useDispatch();
  const setDoDeDuplicate = useCallback(
    (doDeDuplicate: boolean) => {
      dispatch(
        GuidedActions.SET_GUIDED_DO_DEDUPLICATE.action({
          doDeDuplicate,
        })
      );
    },
    [dispatch]
  );

  return [doDeDuplicate, setDoDeDuplicate] as const;
};
