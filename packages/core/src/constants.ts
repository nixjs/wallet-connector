import { IRPCMap } from '@walletconnect/types'

export enum WALLET_TYPE {
    META_MASK = 'META_MASK',
    BINANCE_CHAIN_WALLET = 'BINANCE_CHAIN_WALLET',
    COIN98 = 'COIN98',
    WALLET_CONNECT = 'WALLET_CONNECT',
}

export enum PLATFORM_CONTEXT {
    ETHEREUM = 'ethereum',
    TRONWEB = 'tronWeb',
    BINANCE_CHAIN = 'BinanceChain',
    COIN98 = 'coin98',
}

export enum NETWORK_WALLET {
    BNB = 'BNB',
    BSC = 'BSC',
    ETH = 'ETH',
}

export enum CHAIN_TYPE_MAINNET {
    ETHERUM_MAINNET = 1,
    BINANCE_CHAIN_WALLET = 56,
    BINANCE_CHAIN = 'Binance-Chain-Tigris',
    POLYGON = 137,
}

export enum CHAIN_TYPE_TESTNET {
    BINANCE_CHAIN_WALLET = 97,
    BINANCE_CHAIN = 'Binance-Chain-Ganges',
    ETH_ROPSTEN = 3,
    ETH_RINKEBY = 4,
    ETH_GOERLI = 5,
    ETH_KOVAN = 42,
    POLYGON = 80001,
}

export enum GLOBAL_CONTEXT {
    META_MASK = 'MetaMaskCtx',
    BINANCE = 'BinanceCtx',
    COIN98 = 'Coin98Ctx',
    WALLET_CONNECT = 'WalletConnectCtx',
    WALLET_CONNECTOR = 'WalletCtx',
}

export type TOKEN_TYPE = 'NATIVE' | 'TOKEN'

export const FEE_CONFIG: Record<Exclude<NETWORK_WALLET, NETWORK_WALLET.BNB>, Record<TOKEN_TYPE, Record<string, number>>> = {
    [NETWORK_WALLET.ETH]: {
        NATIVE: {
            gas: 25000,
            gasPrice: 30, // Gwei
            limit: 28000,
        },
        TOKEN: {
            gas: 65000,
            gasPrice: 30, // Gwei
            limit: 70000,
        },
    },
    [NETWORK_WALLET.BSC]: {
        NATIVE: {
            gas: 25000,
            gasPrice: 30, // Gwei
            limit: 28000,
        },
        TOKEN: {
            gas: 65000,
            gasPrice: 10, // Gwei
            limit: 70000,
        },
    },
}

export const RPCS_DEFAULT: IRPCMap = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed.binance.org/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    250: 'https://rpc.ftm.tools/',
}

export const MOBILE_LINKS_DEFAULT: string[] = ['safepal', 'metamask', 'coin98', 'trust']
