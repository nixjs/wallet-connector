import * as ethers from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BaseErrors, Interfaces } from '@nixjs23n6/wc-types'
import { BaseProvider } from './BaseProvider'
import { WALLET_TYPE, MOBILE_LINKS_DEFAULT, RPCS_DEFAULT } from '../constants'
import * as providerInterfaces from '../interfaces'
import { ERROR } from '../error'

export class WalletConnect extends BaseProvider {
    constructor(walletConnectConfig: providerInterfaces.WalletConnectConfig, logger?: Interfaces.Logger) {
        super(logger)
        this.walletInstance = new.target.getWalletInstance(walletConnectConfig)
    }

    static getWalletInstance(config: providerInterfaces.WalletConnectConfig): WalletConnectProvider {
        return new WalletConnectProvider({
            rpc: config.rpc || RPCS_DEFAULT,
            qrcodeModalOptions: {
                mobileLinks: config.qrcodeModalOptions?.mobileLinks || MOBILE_LINKS_DEFAULT,
            },
        })
    }

    public get type(): WALLET_TYPE {
        return WALLET_TYPE.WALLET_CONNECT
    }

    protected config(): void {
        try {
            this.etherProvider = new ethers.providers.Web3Provider(this.walletInstance)
            this.etherSigner = this.etherProvider.getSigner()
        } catch (error) {
            throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
                name: 'walletConnectProvider | walletInstance | etherProvider | etherSigner',
            })
        }
    }

    async connect(): Promise<void> {
        try {
            await this.walletInstance.enable()
            this.config()
            this.log('» 🚀 Established connection successfully to %WalletConnect Provider', 'color: #FABB51; font-size:14px')
        } catch (error) {
            this.log(JSON.stringify(error))
        }
    }

    async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
        try {
            if (await this._getAccountAddressApi()) {
                return {
                    status: 'SUCCESS',
                    data: true,
                }
            }
            throw ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: 'WalletConnect' })
        } catch (error) {
            return {
                status: 'ERROR',
                error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: 'WalletConnect' }),
            }
        }
    }

    onClose(executeCallback: (params: any) => any): void {
        this.walletInstance.on('close', async () => {
            await this.walletInstance.disconnect()
            executeCallback && executeCallback('User closed modal')
        })
    }
}
