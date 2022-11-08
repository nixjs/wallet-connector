import * as React from 'react'
import { providers } from 'ethers'
import { BaseErrors, Interfaces, Types } from '@nixjs23n6/types'
import { WalletProvider, ProviderInstance, WALLET_TYPE, BaseProvider } from '@nixjs23n6/wc-core'
import * as providerTypes from './types'
import { WalletContext } from './useWallet'
import { useLocalStorage } from './useLocalStorage'

export interface WalletProviderProps {
    children: React.ReactNode
    wallets: Types.Class[]
    localStorageKey?: string
    logger?: Interfaces.Logger
}

const initialState: {
    provider: Types.Nullable<WalletProvider>
    providerConnected: boolean
} = {
    provider: null,
    providerConnected: false
}

export const WalletConnectionProvider: React.FC<WalletProviderProps> = ({
    children,
    wallets = [],
    logger,
    localStorageKey = '@wc:walletName'
}) => {
    const [walletTypeStored, storeWalletType] = useLocalStorage<providerTypes.WalletName | null>(localStorageKey, null)
    const [{ provider, providerConnected }, setState] = React.useState(initialState)
    const [instance, setInstance] = React.useState<Types.Nullable<ProviderInstance<BaseProvider>>>(null)
    const [walletType, setWalletType] = React.useState<WALLET_TYPE | null>()

    const onConnectProvider = React.useCallback(async () => {
        if (wallets.length === 0) {
            throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: 'wallets' })
        }
        const wp: WalletProvider = new WalletProvider(wallets, {
            logger
        })
        setState({
            provider: wp,
            providerConnected: true
        })
    }, [])

    React.useEffect(() => {
        onConnectProvider()
    }, [onConnectProvider])

    const onConnect = React.useCallback(
        async (wt: WALLET_TYPE, onSuccess?: (data: Interfaces.ResponseData<string>) => void, onFailure?: (error: any) => void) => {
            console.log('awcsdcsd', wt)
            try {
                if (!provider)
                    throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
                        name: 'provider'
                    })
                if (!wt)
                    throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
                        name: 'walletType'
                    })
                storeWalletType(wt as providerTypes.WalletName)
                setWalletType(wt)
                provider.connect(wt)
                await provider.instance
                    .connect()
                    .then((e: Interfaces.ResponseData<string>) => {
                        if (e.status === 'SUCCESS') {
                            onSuccess?.(e)
                            setInstance(provider.instance)
                        }
                    })
                    .catch(onFailure)
            } catch (error) {
                setInstance(null)
                storeWalletType(null)
            }
        },
        [provider]
    )

    React.useEffect(() => {
        if (walletTypeStored && provider) {
            onConnect(walletTypeStored as WALLET_TYPE)
        }
    }, [onConnect, provider, walletTypeStored])

    const onDestroy = React.useCallback(
        (type: WALLET_TYPE): void => {
            if (!provider) throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: 'provider' })
            provider.destroy(type)
        },
        [provider]
    )

    const onDestroyInstance = React.useCallback(() => setInstance(null), [])

    const getTransaction = React.useCallback(
        async (transactionHash: string) => {
            if (!instance) throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: 'instance' })
            return await instance.getTransaction(transactionHash)
        },
        [instance]
    )

    const sendTransaction = React.useCallback(
        async (transactionRequest: providers.TransactionRequest) => {
            if (!instance) throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: 'instance' })
            return await instance.sendTransaction(transactionRequest)
        },
        [instance]
    )

    const signMessage = React.useCallback(
        async (message: string) => {
            if (!instance) throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: 'instance' })
            return await instance.signMessage(message)
        },
        [instance]
    )

    return (
        <WalletContext.Provider
            value={{
                wallets,
                walletType: walletType || null,
                provider,
                instance: instance,
                storeWalletType,

                onConnect,
                onDestroy,
                providerConnected,
                onDestroyInstance,
                instanceConnected: !!instance,

                getTransaction,
                sendTransaction,
                signMessage
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}
