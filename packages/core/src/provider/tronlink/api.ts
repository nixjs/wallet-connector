import axios from 'axios'
import { TronTypes } from './types'

export namespace TronLinkRequest {
    export const ERROR_CODE = {
        NETWORK_ERROR: 'NETWORK_ERROR',
        AN_UNKNOWN_ERROR: 'AN_UNKNOWN_ERROR',
        DATA_NOT_FOUND: 'DATA_NOT_FOUND'
    }

    export function responseParser<T = any>(response: TronTypes.ResponseData<T>): TronTypes.ResponseParser<T> {
        if (!response) {
            return {
                status: 'ERROR',
                error: { code: ERROR_CODE.NETWORK_ERROR }
            }
        }
        const { data, status } = response
        if ([200, 201].includes(status)) {
            return {
                status: 'SUCCESS',
                data
            }
        }
        if (!data) {
            return {
                status: 'ERROR',
                error: {
                    code: ERROR_CODE.DATA_NOT_FOUND
                }
            }
        }
        return {
            status: 'ERROR',
            error: { code: ERROR_CODE.DATA_NOT_FOUND }
        }
    }

    /**
     * Query information about an account,Including balances, freezes, votes and time, etc.
     * @param {hexString} address Wallet address
     * @param {Boolean} visible Optional,whether the address is in base58 format
     * @returns
     */
    export async function getAccountApi(
        tronNode: string,
        address: string,
        visible = true
    ): Promise<TronTypes.ResponseData<TronTypes.Account>> {
        const resp = await axios.post<TronTypes.Account>(`${tronNode}/wallet/getaccount`, {
            address,
            visible
        })
        return resp
    }

    /**
     * Get contract abi by contract address
     * @param {hexString} contractAddress Contract address
     * @param {Boolean} visible Optional,whether the address is in base58 format
     */
    export async function getContractABIApi(
        tronNode: string,
        contractAddress: string,
        visible = true
    ): Promise<TronTypes.ResponseData<TronTypes.ContractABI>> {
        const resp = await axios.post<TronTypes.ContractABI>(`${tronNode}/wallet/getcontract`, {
            value: contractAddress,
            visible
        })
        return resp
    }

    /**
     * Get transaction by transaction id
     * @param {hexString} txId
     */
    export async function getTransactionApi(
        tronNode: string,
        txId: string
    ): Promise<TronTypes.ResponseData<TronTypes.TransactionResponse>> {
        const resp = await axios.post<TronTypes.TransactionResponse>(`${tronNode}/wallet/gettransactionbyid`, {
            value: txId
        })
        return resp
    }

    /**
     * Get transaction info by transaction id
     * @param {hexString} txId
     */
    export async function getHexEncodedResultApi(
        tronNode: string,
        txId: string
    ): Promise<TronTypes.ResponseData<TronTypes.TransactionInfoResponse>> {
        const resp = await axios.post<TronTypes.TransactionInfoResponse>(`${tronNode}/wallet/gettransactioninfobyid`, {
            value: txId
        })
        return resp
    }
}
