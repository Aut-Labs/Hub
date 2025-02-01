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
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@store/graphql";
import "./App.scss";
import CssBaseline from "@mui/material/CssBaseline";
import { ConfirmDialogProvider } from "react-mui-confirm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WalletConnectorProvider, wagmiConfig } from "@aut-labs/connector";

const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container);
// const persistor = persistStore(store);

root.render(
  <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
    <QueryClientProvider client={queryClient}>
      <WalletConnectorProvider
        defaultChainId={+environment.defaultChainId}
        requestSig={false}
      >
        <ApolloProvider client={apolloClient}>
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
        </ApolloProvider>
      </WalletConnectorProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
ensureVariablesExist(environment, swEnvVariables);
reportWebVitals(null);
