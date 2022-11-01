import * as ethers from 'ethers'
import { JsonFragment } from '@ethersproject/abi'
import { Types, Interfaces, BaseErrors, Errors } from '@nixjs23n6/types'
import { BaseProvider } from '../BaseProvider'
import { PLATFORM_CONTEXT, NETWORK_WALLET, WALLET_TYPE } from '../../constants'
import * as providerTypes from '../../types'
import * as providerInterfaces from '../../interfaces'
import { Helpers } from '../../tools/helpers'
import { Utils } from '../../tools/utils'
import { ERROR } from '../../error'
import { TronTypes, TriggerSmartContractTypes } from './types'
import { TronLinkRequest } from './api'
import { showLogger } from '../logger'

export class TronLinkProvider extends BaseProvider {
    constructor(logger?: Interfaces.Logger) {
        super(logger)
    }

    public get type(): WALLET_TYPE {
        return WALLET_TYPE.TRON_LINK
    }

    protected config(): void {
        try {
            this.walletInstance = (window as any)[this.context]
        } catch (error) {
            throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
                name: 'walletInstance | Tronweb'
            })
        }
    }

    async connect(): Promise<void> {
        this.context = PLATFORM_CONTEXT.TRONWEB
        if (Helpers.isTronInstalled()) {
            this.config()
            this.log('» 🚀 Established connection successfully to %TronLink Wallet Provider', 'color: #FABB51; font-size:14px')
        }
    }

    async checkConnected(): Promise<Interfaces.ResponseData<boolean>> {
        if (!Helpers.isTronInstalled()) {
            return {
                status: 'ERROR',
                error: ERROR.WALLET_NOT_INSTALLED.format({
                    name: 'TronLink Wallet'
                })
            }
        }
        if (this.walletInstance && this.walletInstance.ready) {
            return {
                status: 'SUCCESS',
                data: true
            }
        }
        return {
            status: 'ERROR',
            error: ERROR.ACCOUNT_NOT_BE_LOGIN.format({ name: 'MetaMask Wallet' })
        }
    }

    /**
     * @deprecated
     */
    async getChainId(): Promise<Interfaces.ResponseData<number>> {
        return {
            status: 'ERROR',
            error: 'The `getChainId` function unable support'
        }
    }

    async getFullNode(): Promise<Interfaces.ResponseData<TronTypes.FullNode>> {
        try {
            const result: TronTypes.FullNode = await this.walletInstance.fullNode
            if (!result) {
                throw BaseErrors.ERROR.DATA_NOT_FOUND.format({
                    name: 'fullNode'
                })
            }
            return {
                status: 'SUCCESS',
                data: result
            }
        } catch (error) {
            showLogger('❌ Get the full node', this.log, 'Error', {
                method: 'getFullNode()',
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async getNetwork(): Promise<Interfaces.ResponseData<NETWORK_WALLET | null>> {
        const result: Interfaces.ResponseData<TronTypes.FullNode> = await this.getFullNode()
        if (result.status === 'SUCCESS') {
            showLogger('✅ Get the network', this.log, 'Success', {
                method: 'getNetwork()',
                network: result.data
            })
            return {
                status: 'SUCCESS',
                data: Utils.onGetNetwork(result.data)
            }
        }
        showLogger('❌ Get the network', this.log, 'Error', {
            method: 'getNetwork()'
        })
        return {
            status: 'ERROR',
            error: BaseErrors.ERROR.DATA_NOT_FOUND.format()
        }
    }

    /**
     * @deprecated
     */
    async getGasPrice(): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
        return {
            status: 'ERROR',
            error: 'The `getGasPrice` function unable support'
        }
    }

    async getAddress(): Promise<Interfaces.ResponseData<string>> {
        try {
            const result: string = this.walletInstance.defaultAddress.base58
            showLogger('✅ Get the address', this.log, 'Success', {
                method: 'getAddress()',
                address: result
            })
            return {
                status: 'SUCCESS',
                data: result
            }
        } catch (error) {
            showLogger('❌ Get the address', this.log, 'Error', {
                method: 'getAddress()',
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async getBalance(): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
        try {
            const from: string = this.walletInstance.defaultAddress.base58
            const node: TronTypes.FullNode = await this.walletInstance.fullNode
            if (!from || !node) {
                throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()
            }

            const result: TronTypes.ResponseData<TronTypes.Account> = await TronLinkRequest.getAccountApi(node.host, from)

            const { data, status, error }: TronTypes.ResponseParser<TronTypes.Account | TronTypes.ResponseError> =
                TronLinkRequest.responseParser<TronTypes.Account>(result)

            showLogger('✅ Get the balance', this.log, 'Success', {
                method: 'getBalance()',
                data,
                status
            })

            if (status === 'ERROR' || !data) throw error
            return {
                status: 'SUCCESS',
                data: Helpers.fromHexParser(data.balance)
            }
        } catch (error) {
            showLogger('❌ Get the balance', this.log, 'Error', {
                method: 'getBalance()',
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async getTokenDecimal(contractAddress: string): Promise<Interfaces.ResponseData<number>> {
        try {
            const from: string = this.walletInstance.defaultAddress.base58
            const { data, status } = await this.triggerSmartContractApi(contractAddress, 'decimals()', {}, [], from)

            if (status === 'ERROR' || !data) throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()

            if (data?.constantResult && data.constantResult.length > 0) {
                return { status: 'SUCCESS', data: Number(Helpers.fromDecimal(`0x${data.constantResult[0]}`).toString()) }
            }

            throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()
        } catch (error) {
            showLogger('❌ Get the token decimals', this.log, 'Error', {
                method: 'getTokenDecimal(args)',
                parameters: {
                    contractAddress
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async getTokenBalance(contractAddress: string, decimals?: number): Promise<Interfaces.ResponseData<providerTypes.HexParser>> {
        try {
            const from: string = this.walletInstance.defaultAddress.base58
            const { data, status } = await this.triggerSmartContractApi(
                contractAddress,
                'balanceOf(address)',
                {},
                [
                    {
                        type: 'address',
                        value: from
                    }
                ],
                from
            )

            if (status === 'ERROR' || !data) throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()

            let dec = decimals

            if (!dec) {
                const decRet = await this.getTokenDecimal(contractAddress)
                if (decRet.status === 'ERROR') throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()
                if (decRet.status === 'SUCCESS') {
                    dec = decRet.data
                }
            }

            if (data?.constantResult && data.constantResult.length > 0) {
                return {
                    status: 'SUCCESS',
                    data: Helpers.fromHexParser(ethers.BigNumber.from(`0x${data.constantResult[0]}`).toNumber(), dec)
                }
            }
            throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()
        } catch (error) {
            showLogger('❌ Get the token balance', this.log, 'Error', {
                method: 'getTokenBalance(args)',
                parameters: {
                    contractAddress,
                    decimals
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async getTransaction(transactionHash: string): Promise<Interfaces.ResponseData<TronTypes.TransactionResponse>> {
        try {
            const node: TronTypes.FullNode = await this.walletInstance.fullNode
            if (!node) {
                throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()
            }
            const result: TronTypes.ResponseData<TronTypes.TransactionResponse> = await TronLinkRequest.getTransactionApi(
                node.host,
                transactionHash
            )

            const { data, status, error }: TronTypes.ResponseParser<TronTypes.TransactionResponse | TronTypes.ResponseError> =
                TronLinkRequest.responseParser<TronTypes.TransactionResponse>(result)

            showLogger('✅ Get the balance', this.log, 'Success', {
                method: 'getTransaction()',
                data,
                status
            })

            if (status === 'ERROR' || !data) throw error

            return {
                status: 'SUCCESS',
                data
            }
        } catch (error) {
            showLogger('❌ Get the transaction', this.log, 'Error', {
                method: 'getTransaction(args)',
                parameters: {
                    transactionHash
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    /**
     * @deprecated
     */
    async getTransactionReceipt(transactionHash: string): Promise<Interfaces.ResponseData<ethers.providers.TransactionReceipt>> {
        try {
            return {
                status: 'ERROR',
                error: 'Coming soon'
            }
        } catch (error) {
            showLogger('❌ Get the transaction receipt', this.log, 'Error', {
                method: 'getTransactionReceipt(args)',
                parameters: {
                    transactionHash
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    /**
     * @deprecated
     */
    async getTransactionLogDecoded(
        transactionHash: string,
        ABIs: Types.Object<JsonFragment[]>
    ): Promise<Interfaces.ResponseData<providerInterfaces.TransactionLogDecoded>> {
        try {
            return {
                status: 'ERROR',
                error: 'Coming soon'
            }
        } catch (error) {
            showLogger('❌ Get the transaction log decoded', this.log, 'Error', {
                method: 'getTransactionLogDecoded(args)',
                parameters: {
                    transactionHash,
                    ABIs
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async sendTransaction(
        transactionRequest: TriggerSmartContractTypes.TriggerSmartContractRequest
    ): Promise<Interfaces.ResponseData<TronTypes.TransactionResponse>> {
        try {
            const { contractAddress, functionCall, issuerAddress, options, parameter } = transactionRequest
            const { data, status } = await this.triggerSmartContractApi(contractAddress, functionCall, options, parameter, issuerAddress)
            if (status === 'ERROR' || !data) throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()

            const signature = await this.walletInstance.trx.sign(data.transaction)
            const broadcastTx = await this.walletInstance.trx.sendRawTransaction(signature)
            if (Helpers.hasProperty(broadcastTx, 'result') && broadcastTx.result) {
                return {
                    status: 'SUCCESS',
                    data: broadcastTx
                }
            }
            throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.MISSING_OR_INVALID].format()
        } catch (error) {
            showLogger('❌ Sends the transaction', this.log, 'Error', {
                method: 'sendTransaction(args)',
                parameters: {
                    ...transactionRequest
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async sendNativeToken(
        to: string,
        amount: number, // units in SUN
        options?: Omit<providerInterfaces.TransactionRequest, 'dec'>
    ): Promise<Interfaces.ResponseData<TronTypes.TransactionResponse>> {
        try {
            if (options) {
                console.warn('The `options` parameter has been deprecated for TronLink Provider')
            }
            const from: string = this.walletInstance.defaultAddress.base58
            const unSignedTxn = await this.walletInstance.transactionBuilder.sendTrx(to, amount, from)
            const signature = await this.walletInstance.trx.sign(unSignedTxn)
            const broadcastTx = await this.walletInstance.trx.sendRawTransaction(signature)
            if (Helpers.hasProperty(broadcastTx, 'result') && broadcastTx.result) {
                return {
                    status: 'SUCCESS',
                    data: broadcastTx
                }
            }
            throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.MISSING_OR_INVALID].format()
        } catch (error) {
            showLogger('❌ Sends the native token', this.log, 'Error', {
                method: 'sendNativeToken(args)',
                parameters: {
                    amount,
                    to,
                    options
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async sendToken(
        contractAddress: string,
        amount: number,
        to: string,
        options: TriggerSmartContractTypes.Option
    ): Promise<Interfaces.ResponseData<TronTypes.TransactionResponse>> {
        try {
            const { data, status } = await this.triggerSmartContractApi(contractAddress, 'transfer(address,uint256)', options, [
                {
                    type: 'address',
                    value: to
                },
                {
                    type: 'uint256',
                    value: amount
                }
            ])
            if (status === 'ERROR' || !data) throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.DATA_NOT_FOUND].format()

            if (data.transaction) {
                const signature = await this.walletInstance.trx.sign(data.transaction)
                const broadcastTx = await this.walletInstance.trx.sendRawTransaction(signature)
                if (Helpers.hasProperty(broadcastTx, 'result') && broadcastTx.result) {
                    return {
                        status: 'SUCCESS',
                        data: broadcastTx
                    }
                }
            }
            throw BaseErrors.ERROR[BaseErrors.ERROR_TYPE.MISSING_OR_INVALID].format()
        } catch (error) {
            showLogger('❌ Sends the token', this.log, 'Error', {
                method: 'sendToken(args)',
                parameters: {
                    contractAddress,
                    amount,
                    to,
                    options
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    async signMessage(message: string): Promise<Interfaces.ResponseData<string>> {
        try {
            const msgHex = (Helpers.isHex(message) && message) || this.walletInstance.toHex(message)
            const signature: string = await this.walletInstance.trx.signMessage(msgHex)
            showLogger('✅ Signs the message', this.log, 'Success', {
                method: 'signMessage(args)',
                parameters: {
                    message
                },
                signature
            })
            return {
                status: 'SUCCESS',
                data: signature
            }
        } catch (error) {
            showLogger('❌ Signs the message', this.log, 'Error', {
                method: 'signMessage(args)',
                parameters: {
                    message
                },
                error
            })
            return {
                status: 'ERROR',
                error
            }
        }
    }

    /**
     * @deprecated
     */
    onConnect(executeCallback: () => void): void {
        this.walletInstance.on('connect', () => {
            executeCallback && executeCallback()
        })
    }

    /**
     * @deprecated
     */
    onDisconnect(executeCallback: (code: number, reason: string) => any): void {
        this.walletInstance.on('disconnect', (code: number, reason: string) => {
            executeCallback && executeCallback(code, reason)
        })
    }

    /**
     * @deprecated
     */
    onChainChanged(executeCallback: (chainId: providerTypes.ProviderChainId) => any): void {
        this.walletInstance.on('chainChanged', (chainId: providerTypes.ProviderChainId) => {
            executeCallback && executeCallback(chainId)
        })
    }

    /**
     * @deprecated
     */
    onAccountChanged(executeCallback: (accounts: providerTypes.ProviderAccounts) => any): void {
        this.walletInstance.on('accountsChanged', (accounts: providerTypes.ProviderAccounts) => {
            executeCallback && executeCallback(accounts)
        })
    }

    async triggerSmartContractApi(
        contractAddress: string,
        functionCall: string,
        options: TriggerSmartContractTypes.Option,
        parameter: TriggerSmartContractTypes.Parameter[],
        issuerAddress?: string
    ): Promise<Interfaces.ResponseData<{ transaction: TronTypes.TransactionResponse; constantResult?: string[] }>> {
        try {
            if (!this.walletInstance.isAddress(contractAddress)) {
                throw BaseErrors.ERROR_TYPE.MISSING_OR_INVALID
            }
            const from = issuerAddress || this.walletInstance.defaultAddress.base58
            const {
                transaction,
                result,
                constant_result: constantResult
            } = await this.walletInstance.transactionBuilder.triggerSmartContract(contractAddress, functionCall, options, parameter, from)
            if (!result.result) {
                throw BaseErrors.ERROR_TYPE.DATA_NOT_FOUND
            }
            return { data: { transaction, constantResult }, status: 'SUCCESS' }
        } catch (error) {
            return {
                status: 'ERROR',
                error
            }
        }
    }
    /**
     * Helper function that will sha3 any value using keccak256
     * @param {String} val
     * @returns
     */
    sha3(val: string) {
        return this.walletInstance.sha3(val)
    }

    /**
     * Convert HEX string to ASCII3 string
     * @param {String} val
     * @returns
     */
    toAscii(val: string) {
        return this.walletInstance.toAscii(val)
    }

    /**
     * Convert any value to HEX
     * @param {String} val
     * @returns
     */
    toHex(val: string) {
        return this.walletInstance.toHex(val)
    }

    /**
     * Convert HEX to UTF8
     * @param {String} val
     * @returns
     */
    toUtf8(val: string) {
        return this.walletInstance.toUtf8(val)
    }

    /**
     * Helper function that will convert a value in SUN to TRX. (1 SUN = 0.000001 TRX)
     * @param {String} val
     * @returns
     */
    fromSun(val: string) {
        return this.walletInstance.fromSun(val)
    }
}
