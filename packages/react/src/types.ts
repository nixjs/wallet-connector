import { Types } from '@nixjs23n6/wc-types'

// WalletName is a nominal type that wallet adapters should use, e.g. `'MyCryptoWallet' as WalletName`
// https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
export type WalletName = Types.Brand<string, 'WalletName'>
