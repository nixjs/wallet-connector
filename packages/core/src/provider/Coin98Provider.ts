import { Interfaces } from '@nixjs23n6/wc-types'
import { BaseProvider } from './BaseProvider'
import { PLATFORM_CONTEXT, WALLET_TYPE } from '../constants'
import { Helpers } from '../tools/helpers'
import { ERROR } from '../error'

export class Coin98Provider extends BaseProvider {
    constructor(logger?: Interfaces.Logger) {
        super(logger)
    }

    public get type(): WALLET_TYPE {
        return WALLET_TYPE.COIN98
    }

    async connect(): Promise<void> {
        this.context = PLATFORM_CONTEXT.COIN98
        if (Helpers.isCoin98Installed() && (window as any)[PLATFORM_CONTEXT.COIN98] && (window as any)[PLATFORM_CONTEXT.COIN98].provider) {
            this.config()
            await this.walletInstance.request({ method: 'eth_requestAccounts' })
            this.log('» 🚀 Established connection successfully to %cCoin98 Wallet Provider', 'color: #FABB51; font-size:14px')
        }
    }

    async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
        if (!Helpers.isCoin98Installed()) {
            return {
                status: 'ERROR',
                error: ERROR.WALLET_NOT_INSTALLED.format({
                    name: 'Coi98 Wallet',
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
            error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: 'Coin98 Wallet' }),
        }
    }
}
