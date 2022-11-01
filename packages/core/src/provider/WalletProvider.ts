import debug from "debug";
import { Interfaces, Types } from "@nixjs23n6/types";
import * as providerInterfaces from "../interfaces";
import { WALLET_TYPE } from "../constants";
import { BaseProvider } from "./BaseProvider";

export class WalletProvider {
  private readonly _logger: Interfaces.Logger | null;
  private _walletProviderLogger: debug.Debugger;

  private readonly _classes: Types.Class[];
  private _container: Types.Object<any> = {};
  private _currentType?: WALLET_TYPE;
  private _prevType?: WALLET_TYPE;
  private _config: providerInterfaces.WalletProviderConfig;

  constructor(
    args: Types.Class[],
    config: providerInterfaces.WalletProviderConfig
  ) {
    this._classes = args;
    this._config = config;
    this._logger = config.logger || null;
    this._walletProviderLogger = debug("WalletProvider:");
    this._walletProviderLogger.enabled =
      (config.logger && config.logger.debug) || false;
  }

  connect(walletType: WALLET_TYPE): void {
    if (!walletType) {
      throw new Error("Required parameter walletType missing.");
    }
    if (
      (Object.values(WALLET_TYPE) as string[]).includes(walletType) === false
    ) {
      throw new Error("Parameter invalid.");
    }
    this._currentType = walletType;
    if (this._prevType !== this._currentType) {
      this._prevType && this.destroy(this._prevType);
      for (let index = 0; index < this._classes.length; index++) {
        const Provider: Types.Class = this._classes[index];
        if (Provider.prototype.type && Provider.prototype.type === walletType) {
          this._container[walletType] = new Provider(this._logger);
          break;
        }
      }
      this._prevType = walletType;
      this._walletProviderLogger(
        "» Connect new wallet:  %c" + this._currentType,
        "color: #FABB51; font-size:14px"
      );
    } else {
      // nothing
      this._walletProviderLogger(
        "» Continue to connect the current wallet:  %c" + this._prevType,
        "color: #FABB51; font-size:14px"
      );
    }
  }

  destroy(type?: WALLET_TYPE): void {
    try {
      let t: Types.Undefined<WALLET_TYPE> = this._currentType;
      if (type) {
        t = type;
      }
      if (!t) {
        throw new Error("Wallet type not found");
      }
      delete this._container[t];
      this._walletProviderLogger(
        "» The current instance is deleted before connecting new instance of the wallet: %c" +
          this._currentType,
        "color: #FABB51; font-size:14px",
        this._container
      );
    } catch (error) {
      throw new Error("The instance is not found to delete.");
    }
  }

  get instance(): BaseProvider {
    return this._currentType ? this._container[this._currentType] : null;
  }

  set prevType(v: Types.Undefined<WALLET_TYPE>) {
    this._prevType = v;
  }

  get prevType(): Types.Undefined<WALLET_TYPE> {
    return (this._prevType as WALLET_TYPE) || undefined;
  }

  set currentType(v: Types.Undefined<WALLET_TYPE>) {
    this._currentType = v;
  }

  get currentType(): Types.Undefined<WALLET_TYPE> {
    return (this._currentType as WALLET_TYPE) || undefined;
  }
}
