import * as React from 'react'
import { providers } from 'ethers'
import { Interfaces, Types } from '@nixjs23n6/types'
import { WalletProvider, BaseProvider, ProviderInstance, WALLET_TYPE, TronLink } from '@nixjs23n6/wc-core'
import * as providerTypes from './types'

export interface WalletContextState {
    wallets: Types.Class[]
    walletType: Types.Nullable<WALLET_TYPE>
    provider: Types.Nullable<WalletProvider>
    instance: Types.Nullable<ProviderInstance<BaseProvider>>
    providerConnected: boolean
    instanceConnected: boolean

    storeWalletType(walletName: providerTypes.WalletName): void
    onConnect(walletType: WALLET_TYPE): void
    onDestroy(walletType: WALLET_TYPE): void
    onDestroyInstance(): void

    getTransaction(
        transactionHash: string
    ): Promise<Interfaces.ResponseData<providers.TransactionResponse | TronLink.TronTypes.TransactionResponse>>
    sendTransaction(
        transactionRequest: providers.TransactionRequest
    ): Promise<Interfaces.ResponseData<providers.TransactionResponse | TronLink.TronTypes.TransactionResponse>>
    signMessage(message: string): Promise<Interfaces.ResponseData<string>>
}

export const WalletContext = React.createContext<WalletContextState>({} as WalletContextState)

export function useWallet(): WalletContextState {
    return React.useContext(WalletContext)
}
