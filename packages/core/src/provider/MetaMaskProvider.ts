import { Interfaces } from '@nixjs23n6/types'
import { BaseProvider } from './BaseProvider'
import { PLATFORM_CONTEXT, WALLET_TYPE } from '../constants'
import { Helpers } from '../tools/helpers'
import { ERROR } from '../error'

export class MetaMaskProvider extends BaseProvider {
    constructor(logger?: Interfaces.Logger) {
        super(logger)
    }

    public get type(): WALLET_TYPE {
        return WALLET_TYPE.META_MASK
    }

    async connect(): Promise<void> {
        this.context = PLATFORM_CONTEXT.ETHEREUM
        if (Helpers.isMetaMaskInstalled() && (window as any)[this.context].isMetaMask) {
            this.config()
            await this.walletInstance.request({ method: 'eth_requestAccounts' })
            this.log('» 🚀 Established connection successfully to %cMetamask Wallet Provider', 'color: #FABB51; font-size:14px')
        }
    }

    async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
        if (!Helpers.isMetaMaskInstalled()) {
            return {
                status: 'ERROR',
                error: ERROR.WALLET_NOT_INSTALLED.format({
                    name: 'MetaMask Wallet'
                })
            }
        }
        if (await this.isLoggedIn) {
            return {
                status: 'SUCCESS',
                data: true
            }
        }
        return {
            status: 'ERROR',
            error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: 'MetaMask Wallet' })
        }
    }
}
