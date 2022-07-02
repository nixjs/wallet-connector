import { Interfaces } from '@nixjs23n6/wc-types'
import { BaseProvider } from './BaseProvider'
import { PLATFORM_CONTEXT, WALLET_TYPE } from '../constants'
import { Helpers } from '../tools/helpers'
import { ERROR } from '../error'

export class BinanceProvider extends BaseProvider {
    constructor(logger?: Interfaces.Logger) {
        super(logger)
    }

    public get type(): WALLET_TYPE {
        return WALLET_TYPE.BINANCE_CHAIN_WALLET
    }

    async connect(): Promise<void> {
        this.context = PLATFORM_CONTEXT.BINANCE_CHAIN
        if (Helpers.isBinanceInstalled() && (window as any)[this.context]) {
            this.config()
            this.log('» 🚀 Established connection successfully to %cBinance Wallet Provider', 'color: #FABB51; font-size:14px')
        }
    }

    async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
        if (!Helpers.isBinanceInstalled()) {
            return {
                status: 'ERROR',
                error: ERROR.WALLET_NOT_INSTALLED.format({
                    name: 'Binance Wallet',
                }),
            }
        }
        if (await this.isLoggedIn) {
            return {
                status: 'SUCCESS',
                data: true,
            }
        }
        return {
            status: 'ERROR',
            error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: 'Binance Wallet' }),
        }
    }
}
