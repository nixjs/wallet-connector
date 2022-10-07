import * as ethers from "ethers";
import { Types } from "@nixjs23n6/wc-types";
import { JsonFragment } from "@ethersproject/abi";
import {
  WALLET_TYPE,
  CHAIN_TYPE_MAINNET,
  CHAIN_TYPE_TESTNET,
  NETWORK_WALLET,
  FEE_CONFIG,
  TOKEN_TYPE,
} from "../constants";
import { Helpers } from "./helpers";

type WalletInstalledType = {
  walletType: Types.Nullable<WALLET_TYPE>;
  installed: boolean;
};

type ChainIdType<T> = T | number | string;

export class Utils {
  static onGetWalletInstalledBy(
    walletType: Types.Nullable<WALLET_TYPE>
  ): WalletInstalledType {
    let walletInstalled: WalletInstalledType;
    switch (walletType) {
      case WALLET_TYPE.META_MASK:
        walletInstalled = {
          walletType: WALLET_TYPE.META_MASK,
          installed: Helpers.isMetaMaskInstalled(),
        };
        break;
      case WALLET_TYPE.BINANCE_CHAIN_WALLET:
        walletInstalled = {
          walletType: WALLET_TYPE.BINANCE_CHAIN_WALLET,
          installed: Helpers.isBinanceInstalled(),
        };
        break;
      case WALLET_TYPE.COIN98:
        walletInstalled = {
          walletType: WALLET_TYPE.COIN98,
          installed: Helpers.isCoin98Installed(),
        };
        break;
      default:
        walletInstalled = {
          walletType: null,
          installed: false,
        };
        break;
    }
    return walletInstalled;
  }

  static onGetWalletInstalled(
    walletType: Types.Nullable<WALLET_TYPE>
  ): (WalletInstalledType | "")[] {
    if (walletType) {
      return [this.onGetWalletInstalledBy(walletType)];
    }

    return Object.keys(WALLET_TYPE).map(
      (w: string) =>
        w && this.onGetWalletInstalledBy(WALLET_TYPE[w as WALLET_TYPE])
    );
  }

  static onGetNetwork(chainId: any): Types.Nullable<NETWORK_WALLET> {
    if (!chainId) {
      return null;
    }
    if (chainId && chainId.host) {
      return chainId.host;
    }
    const cId: ChainIdType<[number, string]> =
      (Helpers.isHex(chainId) && Helpers.toNumberFromHex(chainId)) || chainId;
    let network: Types.Nullable<NETWORK_WALLET>;
    switch (cId) {
      case CHAIN_TYPE_MAINNET.ETHERUM_MAINNET:
      case CHAIN_TYPE_TESTNET.ETH_GOERLI:
      case CHAIN_TYPE_TESTNET.ETH_KOVAN:
      case CHAIN_TYPE_TESTNET.ETH_RINKEBY:
      case CHAIN_TYPE_TESTNET.ETH_ROPSTEN:
        network = NETWORK_WALLET.ETH;
        break;
      case CHAIN_TYPE_MAINNET.BINANCE_CHAIN_WALLET:
      case CHAIN_TYPE_TESTNET.BINANCE_CHAIN_WALLET:
        network = NETWORK_WALLET.BSC;
        break;
      case CHAIN_TYPE_MAINNET.BINANCE_CHAIN:
      case CHAIN_TYPE_TESTNET.BINANCE_CHAIN:
        network = NETWORK_WALLET.BNB;
        break;
      default:
        network = null;
        break;
    }
    return network;
  }

  static onGetFunctionAbi(
    abi: JsonFragment[],
    functionName: string
  ): ethers.utils.FunctionFragment {
    const iface: ethers.utils.Interface = new ethers.utils.Interface(abi);
    return iface.getFunction(functionName);
  }

  static onGetEventAbi(
    abi: JsonFragment[],
    eventName: string
  ): ethers.utils.EventFragment {
    const iface: ethers.utils.Interface = new ethers.utils.Interface(abi);
    return iface.getEvent(eventName);
  }

  static onDecodeTransactionLog(
    ABIs: Types.Object<JsonFragment[]>,
    receipt: ethers.providers.TransactionReceipt
  ): ethers.utils.LogDescription[] {
    if (!ABIs || Object.keys(ABIs).length === 0 || !receipt) return [];
    const events: ethers.utils.LogDescription[] = [];
    receipt.logs.forEach((log: { topics: Array<string>; data: string }) => {
      Object.keys(ABIs).forEach((key: string) => {
        try {
          const fragment: JsonFragment[] = ABIs[key];
          const iface: ethers.utils.Interface = new ethers.utils.Interface(
            fragment
          );
          const event: ethers.utils.LogDescription = iface.parseLog(log);
          if (event) {
            events.push(event);
          }
        } catch (error) {
          // event not found, find in next abi
        }
      });
    });
    return events;
  }

  static onEstimateFee(
    network: NETWORK_WALLET,
    type: TOKEN_TYPE
  ): Types.Nullable<number> {
    const state: Record<TOKEN_TYPE, Record<string, number>> = FEE_CONFIG[
      network as Exclude<NETWORK_WALLET, NETWORK_WALLET.BNB>
    ];
    if (!network || !type || !state || !state[type]) return null;
    const config: Types.Object<number> = state[type];
    return (config.gasPrice * config.gas) / 1e9;
  }
}
