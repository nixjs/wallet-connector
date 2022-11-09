import * as React from "react";
import { providers } from "ethers";
import { BaseErrors, Interfaces, Types } from "@nixjs23n6/types";
import {
  WalletProvider,
  ProviderInstance,
  WALLET_TYPE,
  BaseProvider,
} from "@nixjs23n6/wc-core";
import * as providerTypes from "./types";
import { WalletContext } from "./useWallet";
import { useLocalStorage } from "./useLocalStorage";

export interface WalletProviderProps {
  children: React.ReactNode;
  wallets: Types.Class[];
  localStorageKey?: string;
  logger?: Interfaces.Logger;
}

const initialState: {
  provider: Types.Nullable<WalletProvider>;
  providerConnected: boolean;
} = {
  provider: null,
  providerConnected: false,
};

export const WalletConnectionProvider: React.FC<WalletProviderProps> = ({
  children,
  wallets = [],
  logger,
  localStorageKey = "@wc:walletName",
}) => {
  const [walletTypeStored, storeWalletType] =
    useLocalStorage<providerTypes.WalletName | null>(localStorageKey, null);
  const [{ provider, providerConnected }, setState] =
    React.useState(initialState);
  const [walletType, setWalletType] = React.useState<WALLET_TYPE | null>();

  const onConnectProvider = React.useCallback(async () => {
    if (wallets.length === 0) {
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "wallets" });
    }
    const wp: WalletProvider = new WalletProvider(wallets, {
      logger,
    });
    setState({
      provider: wp,
      providerConnected: true,
    });
  }, []);

  React.useEffect(() => {
    onConnectProvider();
  }, [onConnectProvider]);

  const onConnect = React.useCallback(
    async (
      wt: WALLET_TYPE,
      onSuccess?: (data: Interfaces.ResponseData<string>) => void,
      onFailure?: (error: any) => void
    ) => {
      console.log("awcsdcsd", wt);
      try {
        if (!provider)
          throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
            name: "provider",
          });
        if (!wt)
          throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
            name: "walletType",
          });
        storeWalletType(wt as providerTypes.WalletName);
        setWalletType(wt);
        provider.connect(wt);
        await provider.instance
          .connect()
          .then((e: Interfaces.ResponseData<string>) => {
            if (e.status === "SUCCESS") {
              onSuccess?.(e);
            }
          })
          .catch(onFailure);
      } catch (error) {
        storeWalletType(null);
      }
    },
    [provider]
  );

  React.useEffect(() => {
    if (walletTypeStored && provider) {
      onConnect(walletTypeStored as WALLET_TYPE);
    }
  }, [onConnect, provider, walletTypeStored]);

  const onDestroy = React.useCallback(
    (type: WALLET_TYPE): void => {
      if (!provider)
        throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "provider" });
      provider.destroy(type);
    },
    [provider]
  );

  const getTransaction = React.useCallback(
    async (transactionHash: string) => {
      if (!provider?.instance)
        throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "instance" });
      return await provider.instance.getTransaction(transactionHash);
    },
    [provider?.instance]
  );

  const sendTransaction = React.useCallback(
    async (transactionRequest: providers.TransactionRequest) => {
      if (!provider?.instance)
        throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
          name: "instance",
        });
      return await provider.instance.sendTransaction(transactionRequest);
    },
    [provider?.instance]
  );

  const signMessage = React.useCallback(
    async (message: string) => {
      if (!provider?.instance)
        throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
          name: "instance",
        });
      return await provider.instance.signMessage(message);
    },
    [provider?.instance]
  );

  return (
    <WalletContext.Provider
      value={{
        wallets,
        walletType: walletType || null,
        provider,
        storeWalletType,

        onConnect,
        onDestroy,
        providerConnected,
        instanceConnected: !!provider?.instance,

        getTransaction,
        sendTransaction,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
