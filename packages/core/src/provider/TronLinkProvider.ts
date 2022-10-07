import * as ethers from "ethers";
import { JsonFragment } from "@ethersproject/abi";
import { Types, Interfaces, BaseErrors } from "@nixjs23n6/wc-types";
import { BaseProvider } from "./BaseProvider";
import { PLATFORM_CONTEXT, NETWORK_WALLET, WALLET_TYPE } from "../constants";
import * as providerTypes from "../types";
import * as providerInterfaces from "../interfaces";
import { Helpers } from "../tools/helpers";
import { Utils } from "../tools/utils";
import { ERC20 } from "../erc20";
import { ERROR } from "../error";
import { TronTypes } from "../tronwebTypes";
import { showLogger } from "./logger";

export class TronLinkProvider extends BaseProvider {
  constructor(logger?: Interfaces.Logger) {
    super(logger);
  }

  public get type(): WALLET_TYPE {
    return WALLET_TYPE.TRON_LINK;
  }

  async connect(): Promise<void> {
    this.context = PLATFORM_CONTEXT.TRONWEB;
    if (Helpers.isTronInstalled()) {
      this.walletInstance = this.context;
      this.log(
        "» 🚀 Established connection successfully to %cMetamask Wallet Provider",
        "color: #FABB51; font-size:14px"
      );
    }
  }

  async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
    if (!Helpers.isTronInstalled()) {
      return {
        status: "ERROR",
        error: ERROR.WALLET_NOT_INSTALLED.format({
          name: "TronLink Wallet",
        }),
      };
    }
    if (this.walletInstance && this.walletInstance.ready) {
      return {
        status: "SUCCESS",
        data: true,
      };
    }
    return {
      status: "ERROR",
      error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: "MetaMask Wallet" }),
    };
  }

  /**
   * @deprecated
   */
  async getChainId(): Promise<Interfaces.ResponseData<number>> {
    return {
      status: "ERROR",
      error: "The `getChainId` function unable support",
    };
  }

  async getFullNode(): Promise<Interfaces.ResponseData<TronTypes.FullNode>> {
    try {
      const result: TronTypes.FullNode = await this.walletInstance.fullNode;
      if (!result) {
        throw BaseErrors.ERROR.DATA_NOT_FOUND.format({
          name: "fullNode",
        });
      }
      return {
        status: "SUCCESS",
        data: result,
      };
    } catch (error) {
      showLogger("❌ Get the full node", this.log, "Error", {
        method: "getFullNode()",
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getNetwork(): Promise<Interfaces.ResponseData<NETWORK_WALLET | null>> {
    const result: Interfaces.ResponseData<TronTypes.FullNode> =
      await this.getFullNode();
    if (result.status === "SUCCESS") {
      showLogger("✅ Get the network", this.log, "Success", {
        method: "getNetwork()",
        network: result.data,
      });
      return {
        status: "SUCCESS",
        data: Utils.onGetNetwork(result.data),
      };
    }
    showLogger("❌ Get the network", this.log, "Error", {
      method: "getNetwork()",
    });
    return {
      status: "ERROR",
      error: BaseErrors.ERROR.DATA_NOT_FOUND.format(),
    };
  }

  /**
   * @deprecated
   */
  async getGasPrice(): Promise<
    Interfaces.ResponseData<providerTypes.HexParser>
  > {
    return {
      status: "ERROR",
      error: "The `getGasPrice` function unable support",
    };
  }

  async getAddress(): Promise<Interfaces.ResponseData<string>> {
    try {
      const result: string = this.walletInstance.defaultAddress.base58;
      showLogger("✅ Get the address", this.log, "Success", {
        method: "getAddress()",
        address: result,
      });
      return {
        status: "SUCCESS",
        data: result,
      };
    } catch (error) {
      showLogger("❌ Get the address", this.log, "Error", {
        method: "getAddress()",
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getBalance(): Promise<
    Interfaces.ResponseData<providerTypes.HexParser>
  > {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Get the balance", this.log, "Error", {
        method: "getBalance()",
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getTokenDecimal(
    contractAddress: string
  ): Promise<Interfaces.ResponseData<number>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Get the token decimals", this.log, "Error", {
        method: "getTokenDecimal(args)",
        parameters: {
          contractAddress,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getTokenBalance(
    contractAddress: string,
    dec?: number
  ): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Get the token balance", this.log, "Error", {
        method: "getTokenBalance(args)",
        parameters: {
          contractAddress,
          dec,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getTransaction(
    transactionHash: string
  ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Get the transaction", this.log, "Error", {
        method: "getTransaction(args)",
        parameters: {
          transactionHash,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getTransactionReceipt(
    transactionHash: string
  ): Promise<Interfaces.ResponseData<ethers.providers.TransactionReceipt>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Get the transaction receipt", this.log, "Error", {
        method: "getTransactionReceipt(args)",
        parameters: {
          transactionHash,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async getTransactionLogDecoded(
    transactionHash: string,
    ABIs: Types.Object<JsonFragment[]>
  ): Promise<
    Interfaces.ResponseData<providerInterfaces.TransactionLogDecoded>
  > {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Get the transaction log decoded", this.log, "Error", {
        method: "getTransactionLogDecoded(args)",
        parameters: {
          transactionHash,
          ABIs,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async sendTransaction(
    transactionRequest: ethers.providers.TransactionRequest
  ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Sends the transaction", this.log, "Error", {
        method: "sendTransaction(args)",
        parameters: {
          ...transactionRequest,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async sendNativeToken(
    to: string,
    amount: number,
    options: Omit<providerInterfaces.TransactionRequest, "dec">
  ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Sends the native token", this.log, "Error", {
        method: "sendNativeToken(args)",
        parameters: {
          amount,
          to,
          options,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async sendToken(
    contractAddress: string,
    amount: number,
    to: string,
    options: providerInterfaces.TransactionRequest
  ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
    try {
      return {
        status: "ERROR",
        error: "Coming soon",
      };
    } catch (error) {
      showLogger("❌ Sends the token", this.log, "Error", {
        method: "sendToken(args)",
        parameters: {
          contractAddress,
          amount,
          to,
          options,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  async signMessage(message: string): Promise<Interfaces.ResponseData<string>> {
    try {
      const msgHex =
        (Helpers.isHex(message) && message) ||
        this.walletInstance.toHex(message);
      const signature: string = await this.walletInstance.trx.sign(msgHex);
      showLogger("✅ Signs the message", this.log, "Success", {
        method: "signMessage(args)",
        parameters: {
          message,
        },
        signature,
      });
      return {
        status: "SUCCESS",
        data: signature,
      };
    } catch (error) {
      showLogger("❌ Signs the message", this.log, "Error", {
        method: "signMessage(args)",
        parameters: {
          message,
        },
        error,
      });
      return {
        status: "ERROR",
        error,
      };
    }
  }

  /**
   * @deprecated
   */
  onConnect(executeCallback: () => void): void {
    this.walletInstance.on("connect", () => {
      executeCallback && executeCallback();
    });
  }

  /**
   * @deprecated
   */
  onDisconnect(executeCallback: (code: number, reason: string) => any): void {
    this.walletInstance.on("disconnect", (code: number, reason: string) => {
      executeCallback && executeCallback(code, reason);
    });
  }

  /**
   * @deprecated
   */
  onChainChanged(
    executeCallback: (chainId: providerTypes.ProviderChainId) => any
  ): void {
    this.walletInstance.on(
      "chainChanged",
      (chainId: providerTypes.ProviderChainId) => {
        executeCallback && executeCallback(chainId);
      }
    );
  }

  /**
   * @deprecated
   */
  onAccountChanged(
    executeCallback: (accounts: providerTypes.ProviderAccounts) => any
  ): void {
    this.walletInstance.on(
      "accountsChanged",
      (accounts: providerTypes.ProviderAccounts) => {
        executeCallback && executeCallback(accounts);
      }
    );
  }
}
