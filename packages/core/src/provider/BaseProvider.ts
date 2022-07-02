import * as ethers from 'ethers'
import { JsonFragment } from '@ethersproject/abi'
import debug from 'debug'
import { Types, Interfaces, BaseErrors } from '@nixjs23n6/wc-types'
import { PLATFORM_CONTEXT, NETWORK_WALLET } from '../constants'
import * as providerTypes from '../types'
import * as providerInterfaces from '../interfaces'
import { Helpers } from '../tools/helpers'
import { Utils } from '../tools/utils'
import { ERC20 } from '../erc20'
import { showLogger } from './logger'

export abstract class BaseProvider {
    public log: debug.Debugger
    private _context: Types.Nullable<PLATFORM_CONTEXT> = null
    private _walletInstance: any
    private _etherProvider: Types.Nullable<ethers.ethers.providers.Web3Provider> = null
    private _etherSigner: Types.Nullable<ethers.Signer> = null

    constructor(logger?: Interfaces.Logger) {
        this.log = debug('')
        this.log.enabled = (logger && logger.debug) || false
        this.log.namespace = (logger && logger.namespace) || ''
        this.log.color = (logger && logger.color) || '#D3DEDC'
    }

    public set context(v: PLATFORM_CONTEXT) {
        this._context = v
    }

    public get context(): PLATFORM_CONTEXT {
        return this._context as PLATFORM_CONTEXT
    }

    public set walletInstance(v: any) {
        this._walletInstance = v
    }

    public get walletInstance(): any {
        return this._walletInstance
    }

    public set etherProvider(v: ethers.providers.Web3Provider) {
        this._etherProvider = v
    }

    public get etherProvider(): ethers.providers.Web3Provider {
        return this._etherProvider as ethers.providers.Web3Provider
    }

    public set etherSigner(v: ethers.Signer) {
        this._etherSigner = v
    }

    public get etherSigner(): ethers.Signer {
        return this._etherSigner as ethers.Signer
    }

    public get isLoggedIn(): Promise<boolean> {
        return (async () => {
            const from: string = await this._getAccountAddressApi()
            return !!from
        })()
    }

    public get address(): Promise<string> {
        return (async () => {
            return await this._getAccountAddressApi()
        })()
    }

    protected config(): void {
        try {
            this.walletInstance = (window as any)[this.context]
            this.etherProvider = new ethers.ethers.providers.Web3Provider(this.walletInstance)
            this.etherSigner = this.etherProvider.getSigner()
        } catch (error) {
            throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
                name: 'walletInstance | etherProvider | etherSigner',
            })
        }
    }

    protected async _getAccountAddressApi(): Promise<string> {
        const from: string = await this.etherSigner.getAddress()
        return from
    }

    protected async _getTokenDecimalApi(contractAddress: string): Promise<number> {
        const contractAbiFragment: ethers.utils.FunctionFragment = Utils.onGetFunctionAbi(ERC20, 'decimals')
        const contract: ethers.Contract = new ethers.Contract(contractAddress, [contractAbiFragment]).connect(this.etherSigner)
        const dec: string = await contract.functions.decimals()
        return ethers.BigNumber.from(dec).toNumber()
    }

    // + abstract
    abstract connect(): Promise<void>

    abstract checkConnected(): Promise<Interfaces.ResponseData<boolean>>

    // # abstract

    async getChainId(): Promise<Interfaces.ResponseData<number>> {
        try {
            let result: number = await this.etherSigner.getChainId()
            if (!result) {
                throw BaseErrors.ERROR.DATA_NOT_FOUND.format({
                    name: 'chainId',
                })
            }
            if (Helpers.isHex(result)) {
                result = Helpers.toNumberFromHex(`${result}`)
            }
            showLogger('✅ Get the chain id', this.log, 'Success', {
                method: 'getChainId()',
                chainId: result,
            })
            return {
                status: 'SUCCESS',
                data: result,
            }
        } catch (error) {
            showLogger('❌ Get the chain id', this.log, 'Error', {
                method: 'getChainId()',
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getNetwork(): Promise<Interfaces.ResponseData<NETWORK_WALLET | null>> {
        const result: Interfaces.ResponseData<number> = await this.getChainId()
        if (result.status === 'SUCCESS') {
            showLogger('✅ Get the network', this.log, 'Success', {
                method: 'getNetwork()',
                network: result,
            })
            return {
                status: 'SUCCESS',
                data: Utils.onGetNetwork(result.data),
            }
        }
        showLogger('❌ Get the network', this.log, 'Error', {
            method: 'getNetwork()',
        })
        return {
            status: 'ERROR',
            error: BaseErrors.ERROR.DATA_NOT_FOUND.format(),
        }
    }

    async getGasPrice(): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
        try {
            const result: ethers.BigNumber = await this.etherSigner.getGasPrice()
            showLogger('✅ Get the gas price', this.log, 'Success', {
                method: 'getGasPrice()',
                gasPrice: result,
            })
            return {
                status: 'SUCCESS',
                data: Helpers.fromHexParser(result),
            }
        } catch (error) {
            showLogger('❌ Get the gas price', this.log, 'Error', {
                method: 'getGasPrice()',
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getAddress(): Promise<Interfaces.ResponseData<string>> {
        try {
            const result: string = await this._getAccountAddressApi()
            showLogger('✅ Get the address', this.log, 'Success', {
                method: 'getAddress()',
                address: result,
            })
            return {
                status: 'SUCCESS',
                data: result,
            }
        } catch (error) {
            showLogger('❌ Get the address', this.log, 'Error', {
                method: 'getAddress()',
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getBalance(): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
        try {
            const result: ethers.BigNumber = await this.etherSigner.getBalance()
            showLogger('✅ Get the balance', this.log, 'Success', {
                method: 'getBalance()',
                balance: result,
            })
            return {
                status: 'SUCCESS',
                data: Helpers.fromHexParser(result),
            }
        } catch (error) {
            showLogger('❌ Get the balance', this.log, 'Error', {
                method: 'getBalance()',
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getTokenDecimal(contractAddress: string): Promise<Interfaces.ResponseData<number>> {
        try {
            const result: number = await this._getTokenDecimalApi(contractAddress)
            showLogger('✅ Get the token decimals', this.log, 'Success', {
                method: 'getTokenDecimal(args)',
                parameters: {
                    contractAddress,
                },
                decimals: result,
            })
            return {
                status: 'SUCCESS',
                data: result,
            }
        } catch (error) {
            showLogger('❌ Get the token decimals', this.log, 'Error', {
                method: 'getTokenDecimal(args)',
                parameters: {
                    contractAddress,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getTokenBalance(contractAddress: string, dec?: number): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
        try {
            const contractAbiFragment: ethers.utils.FunctionFragment = Utils.onGetFunctionAbi(ERC20, 'balanceOf')
            const contract: ethers.Contract = new ethers.Contract(contractAddress, [contractAbiFragment]).connect(this.etherSigner)
            const address: string = await this._getAccountAddressApi()
            const b: ethers.BigNumber[] = await contract.functions.balanceOf(address)
            let d: Types.Nullable<number> = null
            if (dec && Helpers.isNotNullOrUndefined(dec)) {
                d = dec
            }
            d = await this._getTokenDecimalApi(contractAddress)

            if (!Helpers.isNotNullOrUndefined(d)) {
                throw BaseErrors.ERROR.DATA_NOT_FOUND.format({
                    name: 'decimals',
                })
            }
            const bl: ethers.BigNumber = b && b.length > 0 ? b[0] : ethers.BigNumber.from(0)
            showLogger('✅ Get the token balance', this.log, 'Success', {
                method: 'getTokenBalance(args)',
                parameters: {
                    contractAddress,
                    dec,
                },
                balance: Helpers.fromHexParser(bl, dec),
            })
            return {
                status: 'SUCCESS',
                data: Helpers.fromHexParser(bl, dec),
            }
        } catch (error) {
            showLogger('❌ Get the token balance', this.log, 'Error', {
                method: 'getTokenBalance(args)',
                parameters: {
                    contractAddress,
                    dec,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getTransaction(transactionHash: string): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
        try {
            const txIn: ethers.providers.TransactionResponse = await this.etherProvider.getTransaction(transactionHash)
            showLogger('✅ Get the transaction', this.log, 'Success', {
                method: 'getTransaction(args)',
                parameters: {
                    transactionHash,
                },
                txIn,
            })
            return {
                status: 'SUCCESS',
                data: txIn,
            }
        } catch (error) {
            showLogger('❌ Get the transaction', this.log, 'Error', {
                method: 'getTransaction(args)',
                parameters: {
                    transactionHash,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getTransactionReceipt(transactionHash: string): Promise<Interfaces.ResponseData<ethers.providers.TransactionReceipt>> {
        try {
            const txIn: ethers.providers.TransactionReceipt = await this.etherProvider.getTransactionReceipt(transactionHash)
            showLogger('✅ Get the transaction receipt', this.log, 'Success', {
                method: 'getTransactionReceipt(args)',
                parameters: {
                    transactionHash,
                },
                txIn,
            })
            return {
                status: 'SUCCESS',
                data: txIn,
            }
        } catch (error) {
            showLogger('❌ Get the transaction receipt', this.log, 'Error', {
                method: 'getTransactionReceipt(args)',
                parameters: {
                    transactionHash,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async getTransactionLogDecoded(
        transactionHash: string,
        ABIs: Types.Object<JsonFragment[]>
    ): Promise<Interfaces.ResponseData<providerInterfaces.TransactionLogDecoded>> {
        try {
            const txIn: ethers.providers.TransactionReceipt = await this.etherProvider.getTransactionReceipt(transactionHash)
            const logs: ethers.utils.LogDescription[] = Utils.onDecodeTransactionLog(ABIs, txIn)
            showLogger('✅ Get the transaction log decoded', this.log, 'Success', {
                method: 'getTransactionLogDecoded(args)',
                parameters: { transactionHash, ABIs },
                txIn,
                logs,
            })
            return {
                status: 'SUCCESS',
                data: {
                    transactionHash,
                    logs,
                },
            }
        } catch (error) {
            showLogger('❌ Get the transaction log decoded', this.log, 'Error', {
                method: 'getTransactionLogDecoded(args)',
                parameters: {
                    transactionHash,
                    ABIs,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async sendTransaction(
        transactionRequest: ethers.providers.TransactionRequest
    ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
        try {
            const txIn: ethers.providers.TransactionResponse = await this.etherSigner.sendTransaction(transactionRequest)
            showLogger('✅ Sends the transaction', this.log, 'Success', {
                method: 'sendTransaction(args)',
                parameters: { ...transactionRequest },
                txIn,
            })
            return {
                status: 'SUCCESS',
                data: txIn,
            }
        } catch (error) {
            showLogger('❌ Sends the transaction', this.log, 'Error', {
                method: 'sendTransaction(args)',
                parameters: {
                    ...transactionRequest,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async sendNativeToken(
        to: string,
        amount: number,
        options: Omit<providerInterfaces.TransactionRequest, 'dec'>
    ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
        try {
            const tx: Types.Deferrable<ethers.providers.TransactionRequest> = options
            tx.to = to
            tx.value = ethers.utils.parseEther(`${amount}`)
            tx.data = '0x'
            tx.from = await this._getAccountAddressApi()
            if (options.maxFeePerGas) {
                tx.maxFeePerGas = ethers.utils.hexlify(options.maxFeePerGas)
            }
            if (options.maxPriorityFeePerGas) {
                tx.maxPriorityFeePerGas = ethers.utils.hexlify(options.maxPriorityFeePerGas)
            }
            if (!Helpers.isNotNullOrUndefined(options.gasLimit)) {
                tx.gasLimit = await this.etherSigner.estimateGas(tx)
            }
            if (!Helpers.isNotNullOrUndefined(options.gasPrice)) {
                tx.gasPrice = await this.etherSigner.getGasPrice()
            }
            const txIn: ethers.providers.TransactionResponse = await this.etherSigner.sendTransaction(tx)
            showLogger('✅ Sends the native token', this.log, 'Success', {
                method: 'sendNativeToken(args)',
                parameters: {
                    amount,
                    to,
                    options,
                },
                txIn,
            })
            return {
                status: 'SUCCESS',
                data: txIn,
            }
        } catch (error) {
            showLogger('❌ Sends the native token', this.log, 'Error', {
                method: 'sendNativeToken(args)',
                parameters: {
                    amount,
                    to,
                    options,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async sendToken(
        contractAddress: string,
        amount: number,
        to: string,
        options: providerInterfaces.TransactionRequest
    ): Promise<Interfaces.ResponseData<ethers.providers.TransactionResponse>> {
        try {
            const decimalAbi: ethers.utils.FunctionFragment = Utils.onGetFunctionAbi(ERC20, 'decimals')
            const transferAbi: ethers.utils.FunctionFragment = Utils.onGetFunctionAbi(ERC20, 'transfer')
            const contractAbiFragment: ethers.utils.FunctionFragment[] = [decimalAbi, transferAbi]
            const contract: ethers.Contract = new ethers.Contract(contractAddress, contractAbiFragment, this.etherSigner)
            let decimals: number
            if (options.dec) {
                decimals = ethers.BigNumber.from(options.dec).toNumber()
            } else {
                const dec: number[] = await contract.functions.decimals()
                if (dec.length > 0) {
                    decimals = dec[0]
                }
                throw BaseErrors.ERROR.DATA_NOT_FOUND.format({
                    name: 'decimals',
                })
            }

            const unsignedTx: ethers.PopulatedTransaction = await contract.populateTransaction.transfer(
                to,
                ethers.utils.parseUnits(amount.toString(), decimals)
            )

            const tx: Types.Deferrable<ethers.providers.TransactionRequest> = options
            tx.to = unsignedTx.to
            tx.data = unsignedTx.data
            tx.from = unsignedTx.from
            if (options.maxFeePerGas) {
                tx.maxFeePerGas = ethers.utils.hexlify(options.maxFeePerGas)
            }
            if (options.maxPriorityFeePerGas) {
                tx.maxPriorityFeePerGas = ethers.utils.hexlify(options.maxPriorityFeePerGas)
            }
            if (!Helpers.isNotNullOrUndefined(options.gasLimit)) {
                tx.gasLimit = await this.etherSigner.estimateGas(tx)
            }
            if (!Helpers.isNotNullOrUndefined(options.gasPrice)) {
                tx.gasPrice = await this.etherSigner.getGasPrice()
            }
            const txIn: ethers.providers.TransactionResponse = await this.etherSigner.sendTransaction(tx)
            showLogger('✅ Sends the token', this.log, 'Success', {
                method: 'sendToken(args)',
                parameters: {
                    contractAddress,
                    amount,
                    to,
                    options,
                },
                txIn,
            })
            return {
                status: 'SUCCESS',
                data: txIn,
            }
        } catch (error) {
            showLogger('❌ Sends the token', this.log, 'Error', {
                method: 'sendToken(args)',
                parameters: {
                    contractAddress,
                    amount,
                    to,
                    options,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    async signMessage(message: string): Promise<Interfaces.ResponseData<string>> {
        try {
            const signature: string = await this.etherSigner.signMessage(message)
            showLogger('✅ Signs the message', this.log, 'Success', {
                method: 'signMessage(args)',
                parameters: {
                    message,
                },
                signature,
            })
            return {
                status: 'SUCCESS',
                data: signature,
            }
        } catch (error) {
            showLogger('❌ Signs the message', this.log, 'Error', {
                method: 'signMessage(args)',
                parameters: {
                    message,
                },
                error,
            })
            return {
                status: 'ERROR',
                error,
            }
        }
    }

    onConnect(executeCallback: () => void): void {
        this.walletInstance.on('connect', () => {
            executeCallback && executeCallback()
        })
    }

    onDisconnect(executeCallback: (code: number, reason: string) => any): void {
        this.walletInstance.on('disconnect', (code: number, reason: string) => {
            executeCallback && executeCallback(code, reason)
        })
    }

    onChainChanged(executeCallback: (chainId: providerTypes.ProviderChainId) => any): void {
        this.walletInstance.on('chainChanged', (chainId: providerTypes.ProviderChainId) => {
            executeCallback && executeCallback(chainId)
        })
    }

    onAccountChanged(executeCallback: (accounts: providerTypes.ProviderAccounts) => any): void {
        this.walletInstance.on('accountsChanged', (accounts: providerTypes.ProviderAccounts) => {
            executeCallback && executeCallback(accounts)
        })
    }
}
