import React, { useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import "./assets/css/App.css";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import { Alert, ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, WagmiConfig, configureChains, useAccount } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [mainnet, polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://mainnet.gateway.tenderly.co/${process.env.REACT_APP_TENDERLY_GATEWAY_RPC}`,
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "BlockNotify",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const { address } = useAccount();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <React.StrictMode>
            <HashRouter>
              <Switch>
                <Route path={`/admin`} component={AdminLayout} />
                <Route path={`/auth`} component={AuthLayout} />
                <Redirect from="/" to="/admin" />
              </Switch>
            </HashRouter>
          </React.StrictMode>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
