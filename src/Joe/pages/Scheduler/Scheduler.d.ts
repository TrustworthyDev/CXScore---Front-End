type SchedulerPageContextData = {
  refetchSchedulers?: () => void;
  onUpdateSchedulerActiveStatus?: ({
    schedulerId,
    active,
  }: {
    schedulerId: string;
    active: boolean;
  }) => void;
  curActiveStatus: Record<string, boolean>;
};
