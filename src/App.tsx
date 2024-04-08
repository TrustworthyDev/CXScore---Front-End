import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import FusionCharts from "fusioncharts";
// import Widgets from "fusioncharts/fusioncharts.widgets";
// import FusionCandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
// import FusionCarbonTheme from "fusioncharts/themes/fusioncharts.theme.carbon";
// import FusionFintTheme from "fusioncharts/themes/fusioncharts.theme.fint";
// import FusionDefaultTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// import FusionGammelTheme from "fusioncharts/themes/fusioncharts.theme.gammel";
// import FusionOceanTheme from "fusioncharts/themes/fusioncharts.theme.ocean";
// import FusionUmberTheme from "fusioncharts/themes/fusioncharts.theme.umber";
// import FusionZuneTheme from "fusioncharts/themes/fusioncharts.theme.zune";
// import ReactFC from "react-fusioncharts";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, reduxStore } from "@/reduxStore";
import theme from "~/theme";

import { initChartsConfigs } from "./features/shared/charts";
import { AppRoutes } from "./routes";

import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
import "./styles/reset.css";
import "./styles/toastify.css";

initChartsConfigs();
const queryClient = new QueryClient();
// ReactFC.fcRoot(
//   FusionCharts,
//   Widgets,
//   FusionCandyTheme,
//   FusionCarbonTheme,
//   FusionFintTheme,
//   FusionDefaultTheme,
//   // FusionGammelTheme,
//   // FusionOceanTheme,
//   // FusionUmberTheme,
//   FusionZuneTheme,
// );

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  return (
    <MantineProvider theme={theme}>
      <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ToastContainer
              position={toast.POSITION.TOP_CENTER}
              autoClose={3000}
              hideProgressBar
              closeOnClick
            />
            <div id="modal-root" />
            <AppRoutes />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </MantineProvider>
  );
}

export default App;
