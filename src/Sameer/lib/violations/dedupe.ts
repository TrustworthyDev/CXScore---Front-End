import {
  ViolationsActions,
  ViolationsSelectors,
} from "@/reduxStore/violations/violations";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useViolationsDoDeduplicate = () => {
  const doDeDuplicate = useSelector(ViolationsSelectors.selectDoDeDuplicate);

  const dispatch = useDispatch();
  const setDoDeDuplicate = useCallback(
    (doDeDuplicate: boolean) => {
      dispatch(
        ViolationsActions.SET_VIOLATIONS_DO_DEDUPLICATE.action({
          doDeDuplicate,
        })
      );
    },
    [dispatch]
  );

  return [doDeDuplicate, setDoDeDuplicate] as const;
};
