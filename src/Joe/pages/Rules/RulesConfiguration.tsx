import { PageHeader } from "@/molecules/PageHeader";
import { useEffect, useState } from "react";
import { InfoCircleIcon } from "@/icons/InfoCircle";
import {
  LoadingOverlay,
  Radio,
  Tooltip,
  ActionIcon,
  Button,
  Group,
  Paper,
  rem,
  Title,
  CSSProperties,
  Box,
} from "@mantine/core";

// export const RulesConfigurationInfo: React.FC = () => {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2 text-2xl font-semibold text-gray-700">
//         What does Lightness contrast(L<sup>c</sup>) value mean?
//         <span>
//           <InfoCircleIcon size={32} className="!stroke-gray-700" />
//         </span>
//       </div>
//       <div>
//         The Accessible Perceptual Contrast Algorithm (APCA) is a new method for
//         calculating and predicting readability contrast. Is specifically related
//         to contrast of text and non text on self-illuminated RGB computer
//         displays & devices, with a focus on readability.
//         <br />
//         <br />
//         <strong className="text-gray-700">
//           Lightness contrast (L<sup>c</sup>)
//         </strong>
//         <br />
//         <br />
//         The APCA generates a lightness/darkness contrast value based on a
//         minimum font size and color pair, and this value is perceptually based:
//         that is, regardless of how light or dark the two colors are, a contrast
//         value of L<sup>c</sup>60 represents the same perceived readability
//         contrast. This is absolutely not the case with WCAG 2.x, which far
//         overstates contrast for dark colors to the point that 4.5:1 can be
//         functionally unreadable when one of the colors is near black. As a
//         result, WCAG 2.x contrast cannot be used for guidance when designing
//         “dark mode”.
//         <br />
//         <br />
//         The APCA contrast value is perceptually uniform, and pivots near the
//         point where the CS curve flattens due to contrast constancy. Halving or
//         doubling the APCA value relates to a halving or doubling of the
//         perceived contrast. There is a subtle weighting for higher contrasts to
//         smaller, thinner fonts.
//       </div>
//     </div>
//   );
// };

// export const APCAConfigurationRow = (props: {
//   severity: string;
//   color: string;
//   previousValue?: number;
//   value: number;
//   setValue: (value: number) => void;
//   error?: string;
//   min: number;
//   max: number;
//   disabled: boolean;
//   hideSlider?: boolean;
// }) => {
//   const {
//     min,
//     max,
//     disabled,
//     severity,
//     color,
//     previousValue,
//     value,
//     setValue,
//     error,
//     hideSlider,
//   } = props;

//   const marks = [
//     // { value: min, label: min },
//     // { value: max, label: max },
//   ];

//   return (
//     <tr>
//       <td>
//         <div
//           style={{
//             backgroundColor: color,
//           }}
//           className="flex h-full w-full items-center justify-center  py-6 text-lg font-semibold capitalize text-white"
//         >
//           {severity}
//         </div>
//       </td>
//       <td>
//         <div className="flex flex-col items-center justify-center text-lg font-semibold">
//           {previousValue && `>${previousValue}`} <br />{" "}
//           {!hideSlider && `<${value}`}
//         </div>
//       </td>
//       <td>
//         <div className="w-full">
//           {error && <div className="text-md text-red-500">{error}</div>}
//           {!hideSlider && (
//             <Slider
//               disabled={disabled}
//               min={previousValue ? previousValue + 5 : min}
//               max={(previousValue ?? min) + 15}
//               label={(value) => value.toFixed(1)}
//               step={0.5}
//               // marks={marks}
//               labelAlwaysOn
//               value={value}
//               onChange={setValue}
//             />
//           )}
//         </div>
//       </td>
//       <td>
//         <div className="flex items-center justify-center">
//           <Switch disabled={disabled} />
//         </div>
//       </td>
//     </tr>
//   );
// };

import { useSelector } from "react-redux";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { useApplicationData } from "~/Sameer/lib/application/use-application-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApp } from "@/api";

// type Severity = "minor" | "moderate" | "serious" | "critical";

// interface State {
//   [key: string]: {
//     min: number;
//     max: number;
//     value: number;
//     error?: string;
//   };
// }

// interface Action {
//   type: Severity;
//   payload: {
//     value?: number;
//     error?: string;
//   };
// }

// const initialState: State = {
//   minor: {
//     min: 5,
//     value: 5,
//     max: 20,
//     error: "",
//   },
//   moderate: {
//     min: 5,
//     value: 5,
//     max: 20,
//     error: "",
//   },
//   serious: {
//     min: 5,
//     value: 5,
//     max: 20,
//     error: "",
//   },
//   critical: {
//     min: 5,
//     value: 5,
//     max: 20,
//     error: "",
//   },
// };

// function reducer(state: State, action: Action): State {
//   switch (action.type) {
//     case "minor":
//       return {
//         ...state,
//         minor: {
//           ...state.minor,
//           ...action.payload,
//         },
//       };
//     case "moderate":
//       return {
//         ...state,
//         moderate: {
//           ...state.moderate,
//           ...action.payload,
//         },
//       };
//     case "serious":
//       return {
//         ...state,
//         serious: {
//           ...state.serious,
//           ...action.payload,
//         },
//       };
//     case "critical":
//       return {
//         ...state,
//         critical: {
//           ...state.critical,
//           ...action.payload,
//         },
//       };
//     default:
//       return state;
//   }
// }

const updateAppInfo = async (args: {
  applicationId: string;
  apcaLeniency?: 1 | 2 | 3;
  focusVisibleLeniency?: 1 | 2 | 3;
}) => {
  const { applicationId, apcaLeniency, focusVisibleLeniency } = args;
  return updateApp(applicationId, {
    ...(apcaLeniency != null
      ? {
          apcaOptions: {
            lenience: apcaLeniency,
          },
        }
      : {}),
    ...(focusVisibleLeniency != null
      ? {
          focusVisibleConfig: {
            lenience: focusVisibleLeniency,
          },
        }
      : {}),
  });
};

export const RulesConfiguration: React.FC = () => {
  // const [type, setType] = useState<"default" | "custom">("default");

  // const [state, dispatch] = useReducer(reducer, initialState);type

  const queryClient = useQueryClient();

  const applicationUpdate = useMutation(updateAppInfo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["application"]);
    },
  });

  const [apcaLeniency, setApcaLeniency] = useState<1 | 2 | 3>(2);
  const [focusVisibleLeniency, setFocusVisibleLeniency] = useState<1 | 2 | 3>(
    2
  );

  const currentSelectedAppId = useSelector(selectApplicationInfo)?.appId;

  const currentSelectedAppQuery = useApplicationData({
    appId: currentSelectedAppId || "",
  });

  useEffect(() => {
    if (currentSelectedAppQuery.data != null) {
      if (currentSelectedAppQuery.data.apcaOptions?.lenience != null) {
        setApcaLeniency(currentSelectedAppQuery.data.apcaOptions.lenience);
      } else {
        setApcaLeniency(2);
      }

      if (currentSelectedAppQuery.data.focusVisibleConfig?.lenience != null) {
        setFocusVisibleLeniency(
          currentSelectedAppQuery.data.focusVisibleConfig.lenience
        );
      } else {
        setFocusVisibleLeniency(2);
      }
    } else {
      return;
    }
  }, [currentSelectedAppQuery.data]);

  const CurrentFocusVisibleLeniency =
    currentSelectedAppQuery.data?.focusVisibleConfig?.lenience ?? 2;

  const CurrentApcaLeniency =
    currentSelectedAppQuery.data?.apcaOptions?.lenience ?? 2;

  const isLoadingSave =
    currentSelectedAppQuery.isFetching || applicationUpdate.isLoading;

  const isDisabledSave =
    currentSelectedAppQuery.isFetching ||
    (CurrentApcaLeniency === apcaLeniency &&
      CurrentFocusVisibleLeniency === focusVisibleLeniency);

  const handleSave = () => {
    if (currentSelectedAppId == null) {
      return;
    }

    applicationUpdate.mutate({
      applicationId: currentSelectedAppId,
      apcaLeniency,
      focusVisibleLeniency,
    });
  };

  return (
    <Box>
      <PageHeader title="Rule Configuration" />
      {/* CC */}
      {/* <div className="flex-1">
          Define scan sensitivity for each severity. Changes made to these
          values will have direct impact on the scan results.{" "}
          <span className="text-red-500">(For Advanced Users Only)</span>
        </div> */}

      <Paper style={configurationCardStyle} withBorder>
        <LoadingOverlay
          visible={currentSelectedAppQuery.isInitialLoading}
          overlayProps={{ blur: 2 }}
        />
        {/* <div className="flex items-center gap-2">
            {type === "custom" && (
              <>
                <div role="none" className="h-8 w-8 bg-[#FF9029]"></div>
                <div role="none">
                  Represents the minimum allowed value for the severity. <br />
                  Decrease the threshold of the lower severity to modify.
                </div>
              </>
            )}
          </div> */}
        <Group align="center">
          <Title order={3}>APCA Color Contrast Configuration </Title>
          <Tooltip
            multiline
            w={rem(320)}
            p="lg"
            withArrow
            label={
              'The default option is Recommended, which sets the minimum required visibility thresholds for Focus Visible violations (and severity levels) at levels appropriate for a typical user. The Lenient option moves the minimum required visibility thresholds to lower levels, meaning we\'d get fewer violations/less severe violations than the "Recommended" option. The Strict option moves the minimum required visibility thresholds to higher levels, meaning we\'d get more violations/more severe violations than the "Recommended" option.'
            }
            events={{ hover: true, focus: true, touch: true }}
          >
            <ActionIcon aria-label="Circle info button" variant="transparent">
              <InfoCircleIcon size={24} className="!stroke-gray-700" />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Radio.Group
          value={`${apcaLeniency}`}
          onChange={(value) => {
            setApcaLeniency(Number(value) as 1 | 2 | 3);
          }}
          name="apcaLeniency"
          withAsterisk
        >
          <Group mt="xs">
            <Radio value="1" label="Lenient" />
            <Radio value="2" label="Recommended" />
            <Radio value="3" label="Strict" />
            <Radio value="0" label="Custom" disabled />
          </Group>
        </Radio.Group>

        {/* <div className="w-full rounded bg-white px-2 py-4"> */}
        {/* <Table>
              <thead>
                <tr>
                  <th>
                    <Text size="md">Severity</Text>
                  </th>
                  <th>
                    <Text size="md">
                      Expected Value - Current L<sup>c</sup> Value
                    </Text>
                  </th>
                  <th>
                    <Text size="md">Threshold Slider </Text>
                  </th>
                  <th>
                    <Text size="md">Create JIRA </Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                <APCAConfigurationRow
                  value={state.minor.value}
                  setValue={(value: number) =>
                    dispatch({ type: "minor", payload: { value } })
                  }
                  severity="minor"
                  color="#AD99F7"
                  // here previous value is the minimum value
                  min={state.minor.min}
                  max={state.minor.max}
                  disabled={type === "default"}
                  error={state.minor.error}
                />
                <APCAConfigurationRow
                  previousValue={state.minor.value}
                  value={state.moderate.value}
                  setValue={(value: number) =>
                    dispatch({ type: "moderate", payload: { value } })
                  }
                  severity="moderate"
                  color="#AD99F7"
                  min={state.moderate.min}
                  max={state.moderate.max}
                  disabled={type === "default"}
                  error={state.moderate.error}
                />
                <APCAConfigurationRow
                  previousValue={state.moderate.value}
                  value={state.serious.value}
                  setValue={(value: number) =>
                    dispatch({ type: "serious", payload: { value } })
                  }
                  severity="serious"
                  color="#AD99F7"
                  min={state.serious.min}
                  max={state.serious.max}
                  disabled={type === "default"}
                  error={state.serious.error}
                />
                <APCAConfigurationRow
                  hideSlider
                  previousValue={state.serious.value}
                  value={state.critical.value}
                  setValue={(value: number) =>
                    dispatch({ type: "critical", payload: { value } })
                  }
                  severity="critical"
                  color="#AD99F7"
                  min={state.critical.min}
                  max={state.critical.max}
                  disabled={type === "default"}
                  error={state.critical.error}
                />
              </tbody>
            </Table> */}
        {/* </div> */}

        {/* <div className="flex w-full items-center justify-end gap-4"> */}
        {/* <Button className="bg-red-500 text-white">Cancel</Button> */}
        {/* <Button disabled={type === "default"}>Save</Button> */}
        {/* </div> */}
      </Paper>

      <Paper style={configurationCardStyle} withBorder>
        <LoadingOverlay
          visible={currentSelectedAppQuery.isInitialLoading}
          overlayProps={{ blur: 2 }}
        />
        <Group>
          <Title order={3}>Focus Visible Configuration</Title>
          <Tooltip
            multiline
            w={rem(320)}
            p="lg"
            withArrow
            label={
              'The default option is Recommended, which sets the minimum required visibility thresholds for Focus Visible violations (and severity levels) at levels appropriate for a typical user. The Lenient option moves the minimum required visibility thresholds to lower levels, meaning we\'d get fewer violations/less severe violations than the "Recommended" option. The Strict option moves the minimum required visibility thresholds to higher levels, meaning we\'d get more violations/more severe violations than the "Recommended" option.'
            }
            events={{ hover: true, focus: true, touch: true }}
          >
            <ActionIcon aria-label="Circle info button" variant="transparent">
              <InfoCircleIcon size={24} className="!stroke-gray-700" />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Radio.Group
          value={`${focusVisibleLeniency}`}
          onChange={(e) => {
            setFocusVisibleLeniency(Number(e) as 1 | 2 | 3);
          }}
          name="focusVisibleLeniency"
          withAsterisk
        >
          <Group mt="sm">
            <Radio value="1" label="Lenient" />
            <Radio value="2" label="Recommended" />
            <Radio value="3" label="Strict" />
          </Group>
        </Radio.Group>
      </Paper>
      <Button
        disabled={isDisabledSave}
        loading={isLoadingSave}
        mt="lg"
        onClick={handleSave}
      >
        Save
      </Button>

      {/* <HorizontalSeparator /> */}

      {/* <RulesConfigurationInfo /> */}
    </Box>
  );
};

const configurationCardStyle: CSSProperties = {
  background: "var(--mantine-color-gray-1)",
  marginTop: "var(--mantine-spacing-lg)",
  position: "relative",
  padding: "var(--mantine-spacing-lg)",
};
