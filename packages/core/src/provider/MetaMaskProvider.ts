import * as ethers from "ethers";
import { Interfaces, BaseErrors } from "@nixjs23n6/types";
import { BaseProvider } from "./BaseProvider";
import { PLATFORM_CONTEXT, WALLET_TYPE } from "../constants";
import { Helpers } from "../tools/helpers";
import { ERROR } from "../error";

export class MetaMaskProvider extends BaseProvider {
  constructor(logger?: Interfaces.Logger) {
    super(logger);
  }

  public get type(): WALLET_TYPE {
    return WALLET_TYPE.META_MASK;
  }

  protected async config(): Promise<Interfaces.ResponseData<string>> {
    try {
      this.walletInstance = (window as any)[this.context];
      this.etherProvider = new ethers.ethers.providers.Web3Provider(
        this.walletInstance
      );
      this.etherSigner = this.etherProvider.getSigner();
      await this.walletInstance.request({ method: "eth_requestAccounts" });
      const from = await this._getAccountAddressApi();
      this.log(
        `» 🚀 Established connection successfully to %c${this.context}`,
        "color: #FABB51; font-size:14px"
      );
      return {
        data: from,
        status: "SUCCESS",
      };
    } catch (error) {
      return {
        error: BaseErrors.ERROR.MISSING_OR_INVALID.format({
          name: "walletInstance | etherProvider | etherSigner",
        }),
        status: "ERROR",
      };
    }
  }

  async connect(): Promise<Interfaces.ResponseData<string>> {
    this.context = PLATFORM_CONTEXT.ETHEREUM;
    if (
      Helpers.isMetaMaskInstalled() &&
      (window as any)[this.context].isMetaMask
    ) {
      return await this.config();
    }

    return {
      error: ERROR.WALLET_NOT_INSTALLED.format(),
      status: "ERROR",
    };
  }

  async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
    if (!Helpers.isMetaMaskInstalled()) {
      return {
        status: "ERROR",
        error: ERROR.WALLET_NOT_INSTALLED.format({
          name: "MetaMask Wallet",
        }),
      };
    }
    if (await this.isLoggedIn) {
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
}
