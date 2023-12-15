import { BrowserRouter as Router } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "@store/store";
import { swEnvVariables, environment } from "@api/environment";
import { ensureVariablesExist } from "@utils/env";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import App from "./App";
import AutTheme from "./theme/theme";
import "./App.scss";
// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";
// import AutLoading from "@components/AutLoading";
import CssBaseline from "@mui/material/CssBaseline";
import markerSDK from "@marker.io/browser";

// markerSDK.loadWidget({
//   project: `${process.env.REACT_APP_MARKER}`,
//   reporter: {
//     email: "frontend@aut.id",
//     fullName: "Nova Showcase"
//   }
// });

const container = document.getElementById("root");
const root = createRoot(container);
import { ConfirmDialogProvider } from "react-mui-confirm";

// const persistor = persistStore(store);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={AutTheme}>
      <CssBaseline />
      <Provider store={store}>
        {/* <PersistGate loading={<AutLoading />} persistor={persistor}> */}
        <Router>
          {/* @ts-ignore */}
          <ConfirmDialogProvider
            dialogProps={{
              PaperProps: {
                sx: {
                  borderRadius: "16px",
                  borderColor: "divider"
                }
              }
            }}
            dialogTitleProps={{
              variant: "subtitle1",
              color: "white"
            }}
            confirmButtonProps={{
              color: "error",
              variant: "outlined"
            }}
            confirmButtonText="Delete"
            cancelButtonProps={{
              color: "offWhite",
              variant: "outlined"
            }}
            cancelButtonText="Dismiss"
          >
            <App />
          </ConfirmDialogProvider>
        </Router>
        {/* </PersistGate> */}
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>
);
ensureVariablesExist(environment, swEnvVariables);
reportWebVitals(null);
