import { PropsWithChildren, useEffect, useState } from "react";
import { Paper } from "../../../atoms/paper";

import { ReactComponent as DropdownVector } from "./dropdown-vector.svg";
import clsx from "clsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  useAllApplicationData,
  useSelectedAppId,
  useSelectedApplicationData,
} from "../../../../lib/application/use-application-data";
import { Skeleton } from "../../../atoms/loading/skeleton";
import { HorizontalSeparator } from "../../../atoms/seperator/horizontal-separator";
import { useDispatch, useSelector } from "react-redux";
import { onChangeApplication } from "@/reduxStore/app/app.actions";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { SearchIcon } from "@/icons/Search";
import { VerticalSeparator } from "../../../atoms/seperator/vertical-separator";
import TickIcon from "@/icons/Tick";
import useThrottledValue from "../../../../lib/util/use-throttled-value";
import { all } from "axios";

interface AppSelectionBarProps {}

const AppSelectionAction = ({ onAppSelect }: { onAppSelect?: () => void }) => {
  const allApplicationDataQuery = useAllApplicationData();

  const dispatch = useDispatch();
  const selectedApplicationId = useSelector(selectApplicationInfo)?.appId;

  const [parent] = useAutoAnimate<HTMLUListElement>();

  const handleChangeApplication = (appInfo: any) => {
    dispatch(
      onChangeApplication({
        appInfo: {
          appId: appInfo.id,
          appName: appInfo.name,
        },
      })
    );

    onAppSelect?.();
  };

  useEffect(() => {
    if (
      allApplicationDataQuery.isLoading ||
      allApplicationDataQuery.isError ||
      !!selectedApplicationId ||
      !allApplicationDataQuery.data ||
      !allApplicationDataQuery.data.length ||
      !allApplicationDataQuery.data[0]
    ) {
      return;
    }
    handleChangeApplication(allApplicationDataQuery.data[0]);
  }, [allApplicationDataQuery, selectedApplicationId]);

  const [searchInput, setSearchInput] = useState("");

  const throttledSearchInputValue = useThrottledValue<string>({
    value: searchInput,
  });

  const [searchData, setSearchData] = useState<ApiApplicationInfo[]>(
    allApplicationDataQuery.data ?? []
  );

  useEffect(() => {
    if (!allApplicationDataQuery.data) return;
    if (!throttledSearchInputValue) {
      setSearchData(allApplicationDataQuery.data);
      return;
    }
    const filteredData = allApplicationDataQuery.data.filter((appInfo) => {
      if (!appInfo.name) {
        console.warn("Missing Name Application Found!!!", appInfo);
        return false;
      }
      return appInfo.name
        .toLowerCase()
        .includes(throttledSearchInputValue.toLowerCase());
    });
    setSearchData(filteredData);
  }, [allApplicationDataQuery.data, throttledSearchInputValue]);

  const selectedItem = allApplicationDataQuery.data?.find(
    (appInfo) => appInfo.id === selectedApplicationId
  );

  const searchDataWithoutSelectedItem = searchData.filter(
    (appInfo) => appInfo.id !== selectedApplicationId
  );

  if (allApplicationDataQuery.isLoading)
    return <Skeleton className="h-24 !w-full" />;

  if (allApplicationDataQuery.isError) return <div>Error</div>;

  return (
    <div className="my-2 rounded-xl shadow-xl">
      <div className="w-full p-2">
        <div
          className={clsx(
            "border-1 flex items-center space-x-2 rounded-3xl border border-gray-300 px-2"
          )}
        >
          {/* <GlobeVector /> */}
          {/* <VerticalSeparator /> */}
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            className="flex-grow rounded-l-3xl pl-2 focus:outline-none "
            placeholder="Quick Search"
          />
          <VerticalSeparator />
          <SearchIcon />
        </div>
      </div>

      <ul ref={parent} className="list-reset max-h-64 overflow-y-scroll">
        {selectedItem && (
          <li
            key={selectedItem.id}
            className={clsx(
              "block w-full cursor-pointer p-2 text-black hover:bg-blue-200",
              selectedApplicationId === selectedItem.id ? "bg-blue-100" : ""
            )}
            onClick={() => handleChangeApplication(selectedItem)}
          >
            <div className="flex items-center justify-start">
              <div className="h-4 w-8">
                {selectedApplicationId === selectedItem.id ? (
                  <TickIcon className="fill-current text-blue-500" />
                ) : (
                  <div role="presentation" className="h-4 w-4" />
                )}
              </div>
              <p>{selectedItem.name}</p>
            </div>
          </li>
        )}
        <HorizontalSeparator />
        {searchDataWithoutSelectedItem &&
          searchDataWithoutSelectedItem.map((app: any, index: number) => (
            <li
              key={app.id ?? index}
              className={clsx(
                "block w-full cursor-pointer p-2 text-black hover:bg-blue-200",
                selectedApplicationId === app.id ? "bg-blue-100" : ""
              )}
              onClick={() => handleChangeApplication(app)}
            >
              <div className="flex items-center justify-start">
                <div className="h-4 w-8">
                  {selectedApplicationId === app.id ? (
                    <TickIcon className="fill-current text-blue-500" />
                  ) : (
                    <div role="presentation" className="h-4 w-4" />
                  )}
                </div>
                <p>{app.name}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
  return (
    <div className="">
      {/* <HorizontalSeparator className="mt-4" />
      <h2 className="py-4 font-display text-xl font-semibold"></h2> */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {allApplicationDataQuery.data &&
          allApplicationDataQuery.data?.map((app: any, index: number) => (
            <div
              key={app.id ?? index}
              className={clsx(
                "space-y-2 rounded-md border p-2",
                selectedApplicationId === app.id
                  ? "border-brand-600"
                  : "border-gray-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="font-display text-xl">{app.name}</div>
                <div className="font-body text-xs uppercase">
                  {app.location}
                </div>
              </div>
              <div className="font-body text-sm text-gray-800">
                {app.subOrg} - {app.organization}
              </div>
              <div></div>
              <HorizontalSeparator />
              {selectedApplicationId === app.id ? (
                <div className="text-sm capitalize text-brand-600">
                  Currently Selected
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleChangeApplication(app);
                  }}
                  className="text-sm capitalize text-brand-600 underline-offset-2 hover:underline"
                >
                  Select
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export const AppSelectionBar = (
  _props: PropsWithChildren<AppSelectionBarProps>
) => {
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const selectedAppIdFromStore = useSelectedAppId();

  const [show, setShow] = useState(selectedAppIdFromStore ? false : true);

  const selectedApplicationDataQuery = useSelectedApplicationData();

  return (
    <Paper className="space-y-2 py-4">
      <div ref={parent} className="relative space-y-2">
        <button
          className={clsx(
            "block fill-gray-700 hover:fill-gray-800",
            selectedApplicationDataQuery.isLoading
              ? "cursor-not-allowed"
              : "cursor-pointer"
          )}
          aria-label="Toggle dropdown"
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center justify-start gap-x-2 text-lg">
            <h1>
              App:{" "}
              <strong className="font-display">
                {/* {selectedApplicationDataQuery.isLoading
                  ? "Loading"
                  : selectedApplicationDataQuery.data != null
                  ? selectedApplicationDataQuery.data.name
                  : "Select an Application"} */}

                {selectedApplicationDataQuery.isInitialLoading ? (
                  "Loading"
                ) : selectedApplicationDataQuery.isError ? (
                  <div className="m-0 inline p-0 text-red-500">Error</div>
                ) : selectedApplicationDataQuery.data != null ? (
                  selectedApplicationDataQuery.data.name
                ) : (
                  "Select an Application"
                )}
              </strong>
            </h1>{" "}
            <div>
              <DropdownVector
                className={clsx(
                  "transition-transform duration-300",
                  show ? "rotate-180 transform" : ""
                )}
              />
            </div>
          </div>
        </button>
        {show && <AppSelectionAction onAppSelect={() => setShow(false)} />}
      </div>
    </Paper>
  );
};

