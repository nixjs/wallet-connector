# Wallet Connector @nixjs23n6/wallet-connector

A simple, maximally extensible, dependency minimized framework for building modern Ethereum and other dApps.

## @nixjs23n6/wc-core

### Install

Install these dependencies:

`yarn add @nixjs23n6/wc-core`

### Setup & Usage

```javascript
import React, { FC, useMemo, useState } from 'react';
import {
    WALLET_TYPE,
    WalletProvider,
    BinanceProvider,
    MetaMaskProvider,
    WalletConnect,
} from '@nixjs23n6/wc-core'

export const Wallet: FC = () => { 
    const [state, setState] = useState({
        walletType: WALLET_TYPE.META_MASK,
        loading: false
    })

    const fetchProviderInstance = useCallback(async (wt: WALLET_TYPE) => {
        try {
            provider = new WalletProvider([BinanceProvider, MetaMaskProvider, WalletConnect], {
                walletConnectConfig: {
                    qrcodeModalOptions: {
                        mobileLinks: ['safepal', 'metamask'],
                    },
                },
                logger: {
                    debug: true,
                },
            })
            provider.connect(wt)
            provider.instance.connect()
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        fetchProviderInstance(state.walletType)
    }, [state.walletType, fetchProviderInstance])

    useEffect(() => {
        if (provider.instance) {
            provider.instance.getChainId().then((res: any) => {
                console.log('getChainId', res)
            })

            provider.instance.getNetwork().then((res: any) => {
                console.log('getNetwork', res)
            })

            provider.instance.getGasPrice().then((res: any) => {
                console.log('getGasPrice', res)
            })

            provider.instance.getAddress().then((res: any) => {
                console.log('getAddress', res)
            })

            provider.instance.getBalance().then((res: any) => {
                console.log('getBalance', res)
            })

            provider.instance.getTokenDecimal('0xf76205FB45B1c688EEA4423ab5fE386E6c7F78C8').then((res: any) => {
                console.log('getTokenDecimal', res)
            })

            provider.instance.getTokenBalance('0xf76205FB45B1c688EEA4423ab5fE386E6c7F78C8', 18).then((res: any) => {
                console.log('getTokenBalance', res)
            })

            provider.instance.getTransaction('0x3aafdd0dc30dc1965f22d3bdc5d3e6f15a88efd6f83dbbe613ddca5a0cb81d49').then((res: any) => {
                console.log('getTransaction', res)
            })

            provider.instance.getTransactionReceipt('0x3aafdd0dc30dc1965f22d3bdc5d3e6f15a88efd6f83dbbe613ddca5a0cb81d49').then((res: any) => {
                console.log('getTransactionReceipt', res)
            })
            provider.instance.onAccountChanged &&
                provider.instance.onAccountChanged((data: any) => {
                    console.log('onAccountChanged')
                    console.log(data)
                })

            provider.instance.onDisconnect &&
                provider.instance.onDisconnect((data: any) => {
                    console.log('onDisconnect')
                    console.log(data)
                })
        }
    }, [provider, state.walletType])

    return <App/>
};
```

## @nixjs23n6/wc-react

### Install

Install these dependencies:

`yarn add @nixjs23n6/wc-core @nixjs23n6/wc-react`

### Setup

```javascript
import React, { FC, useMemo } from 'react';
import {
    WALLET_TYPE,
    MetaMaskProvider,
    WalletConnect,
    BinanceProvider,
    RPCS_DEFAULT,
    MOBILE_LINKS_DEFAULT,
} from '@nixjs23n6/wc-core'
import { WalletConnectionProvider } from '@nixjs23n6/wc-react'

export const Wallet: FC = () => {
    const wallets = useMemo(() => [MetaMaskProvider, BinanceProvider, WalletConnect], []) 

    return (
        <WalletConnectionProvider
        wallets={wallets}
        logger={{ debug: true }}
        walletConnectConfig={{
            rpc: RPCS_DEFAULT,
            qrcodeModalOptions: {
                mobileLinks: MOBILE_LINKS_DEFAULT,
            },
        }}>
            <WalletComponent/>
            { /* Your app's components go here, nested within the context providers. */ }
        </WalletConnectionProvider>
    );
};
```

### Usage

```javascript
import React, { FC, useCallback } from 'react';
import { WalletConnectionProvider, useWallet } from '@nixjs23n6/wc-react'

export const WalletComponent: FC = () => {
    const { instance, onConnect, providerConnected, instanceConnected } = useWallet()

    console.log('providerConnected', providerConnected)
    console.log('instanceConnected', instanceConnected)

    useEffect(() => {
        if (providerConnected) onConnect(WALLET_TYPE.META_MASK)
    }, [providerConnected, onConnect])
        useEffect(() => {
        if (instance) {
            instance.getChainId().then((res: any) => {
                console.log('getChainId', res)
            })
        }
    }, [instance])

    useEffect(() => {
        if (instance) {
            instance.getChainId().then((res: any) => {
                console.log('getChainId', res)
            })

            instance.getNetwork().then((res: any) => {
                console.log('getNetwork', res)
            })

            instance.getGasPrice().then((res: any) => {
                console.log('getGasPrice', res)
            })

            instance.getAddress().then((res: any) => {
                console.log('getAddress', res)
            })

            instance.getBalance().then((res: any) => {
                console.log('getBalance', res)
            })

            instance.getTokenDecimal('0xf76205FB45B1c688EEA4423ab5fE386E6c7F78C8').then((res: any) => {
                console.log('getTokenDecimal', res)
            })

            instance.getTokenBalance('0xf76205FB45B1c688EEA4423ab5fE386E6c7F78C8', 18).then((res: any) => {
                console.log('getTokenBalance', res)
            })

            instance.getTransaction('0x3aafdd0dc30dc1965f22d3bdc5d3e6f15a88efd6f83dbbe613ddca5a0cb81d49').then((res: any) => {
                console.log('getTransaction', res)
            })

            instance.getTransactionReceipt('0x3aafdd0dc30dc1965f22d3bdc5d3e6f15a88efd6f83dbbe613ddca5a0cb81d49').then((res: any) => {
                console.log('getTransactionReceipt', res)
            })
            instance.onAccountChanged &&
                instance.onAccountChanged((data: any) => {
                    console.log('onAccountChanged')
                    console.log(data)
                })

            instance.onDisconnect &&
                instance.onDisconnect((data: any) => {
                    console.log('onDisconnect')
                    console.log(data)
                })
        }
    }, [instance])

    return (<div>
        {WALLET_TYPE.META_MASK}
        { /* Your app's components go here, nested within the context providers. */ }
    </div>)
};
```

