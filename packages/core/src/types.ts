import * as ethers from 'ethers'
import { Types } from '@nixjs23n6/types'

export type ResponseParserType = {
    success: any
    error: any
}

export type DecimalReturnType = { result: boolean; decimals: number }

export type Numberish = string | number | ethers.BigNumber

export type HexParser = {
    original: Numberish
    formated?: string
    dec?: number
}

// WalletName is a nominal type that wallet adapters should use, e.g. `'MyCryptoWallet' as WalletName`
// https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
export type WalletName = Types.Brand<string, 'WalletName'>

export type ProviderChainId = string | number

export type ProviderAccounts = string[]

export type ProviderInstance<T> = T & {
    onClose?: (params: any) => any
}
