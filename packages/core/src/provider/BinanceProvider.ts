import { Interfaces } from "@nixjs23n6/types";
import { BaseProvider } from "./BaseProvider";
import { PLATFORM_CONTEXT, WALLET_TYPE } from "../constants";
import { Helpers } from "../tools/helpers";
import { ERROR } from "../error";

export class BinanceProvider extends BaseProvider {
  constructor(logger?: Interfaces.Logger) {
    super(logger);
  }

  public get type(): WALLET_TYPE {
    return WALLET_TYPE.BINANCE_CHAIN_WALLET;
  }

  async connect(): Promise<Interfaces.ResponseData<string>> {
    this.context = PLATFORM_CONTEXT.BINANCE_CHAIN;
    if (Helpers.isBinanceInstalled() && (window as any)[this.context]) {
      return await this.config();
    }
    return {
      error: ERROR.WALLET_NOT_INSTALLED.format(),
      status: "ERROR",
    };
  }

  async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
    if (!Helpers.isBinanceInstalled()) {
      return {
        status: "ERROR",
        error: ERROR.WALLET_NOT_INSTALLED.format({
          name: "Binance Wallet",
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
      error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: "Binance Wallet" }),
    };
  }
}
