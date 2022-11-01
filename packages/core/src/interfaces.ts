import * as ethers from 'ethers'
import { Interfaces } from '@nixjs23n6/types'

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

export interface WalletProviderConfig {
    logger?: Interfaces.Logger
}
