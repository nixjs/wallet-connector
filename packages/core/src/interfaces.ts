import * as ethers from 'ethers'
import { IRPCMap, IQRCodeModalOptions } from '@walletconnect/types'
import { Types, Interfaces } from '@nixjs23n6/wc-types'

export interface TransactionRequest
    extends Pick<
    ethers.providers.TransactionRequest,
    'gasPrice' | 'gasLimit' | 'nonce' | 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'type' | 'accessList' | 'chainId'
    > {
    dec?: string
}

export interface TransactionLogDecoded {
    transactionHash: string
    logs: ethers.utils.LogDescription[]
}

export interface WalletConnectConfig {
    bridge?: string
    qrcode?: boolean
    qrcodeModal?: {
        open: (uri: string, cb: any, qrcodeModalOptions?: Types.Undefined<IQRCodeModalOptions>) => void
        close: () => void
    }
    qrcodeModalOptions?: IQRCodeModalOptions
    rpc?: IRPCMap
    infuraId?: string
}

export interface WalletProviderConfig {
    walletConnectConfig?: WalletConnectConfig
    logger?: Interfaces.Logger
}
