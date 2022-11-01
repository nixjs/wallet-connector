import { Axios, AxiosResponse } from 'axios'
import { Interfaces } from '@nixjs23n6/types'

export interface TronLinkProviderExtend {
    triggerSmartContractApi(
        contractAddress: string,
        functionCall: string,
        options: TriggerSmartContractTypes.Option,
        parameter: TriggerSmartContractTypes.Parameter[],
        issuerAddress?: string
    ): Promise<Interfaces.ResponseData<{ transaction: TronTypes.TransactionResponse; constantResult?: string[] }>>

    sha3(val: string): string
    toAscii(val: string): string
    toHex(val: string): string
    toUtf8(val: string): string
    fromSun(val: string): string
}

export namespace TronTypes {
    export interface FullNode {
        chainType: number
        headers: any
        host: string
        instance: Axios
        password: boolean
        queue: any[]
        ready: boolean
        statusPage: string
        timeout: number
        user: boolean
    }
    export interface AssetNet {
        key: string
        value: number
    }
    export interface AccountResource {
        freeNetLimit: number
        NetLimit: number
        assetNetUsed: AssetNet[]
        assetNetLimit: AssetNet[]
        TotalNetLimit: number
        TotalNetWeight: number
        tronPowerLimit: number
        EnergyLimit: number
        TotalEnergyLimit: number
        TotalEnergyWeight: number
    }
    export interface Account {
        account_name: string
        address: string
        balance: number
        latest_opration_time: number
        latest_consume_free_time: number
        account_resource: AccountResource
    }
    export interface ContractABI {
        bytecode: string
        name: string
        origin_address: string
        abi: Record<string, any>
        origin_energy_limit: number
        contract_address: string
        code_hash: string
    }
    export interface RawDataContract {
        parameter: {
            value: {
                // data: string
                // owner_address: string
                // contract_address: string
                data?: string
                token_id?: number
                owner_address?: string
                call_token_value?: number
                contract_address?: string
            }
            type_url: string
        }
        type: string
    }
    export interface TransactionRawData {
        contract: RawDataContract[]
        ref_block_bytes: string
        ref_block_hash: string
        expiration: number
        fee_limit: number
        timestamp: number
    }
    export interface TransactionResponse {
        ret?: { contractRet: string }[]
        signature?: string[]
        txID: string
        raw_data: TransactionRawData
        raw_data_hex: string
    }
    export interface TransactionInfoResponse {
        id: string
        blockTimeStamp: number
        contractResult: string[]
        contract_address: string
        receipt: {
            origin_energy_usage: number
            energy_usage_total: number
            net_usage: number
            result: string
        }
        log: {
            address: string
            topics: string[]
            data: string
        }[]
    }
    export interface ResponseData<T> extends AxiosResponse<T> {}
    export interface ResponseError {
        code: string | number
        message?: string
        optionalData?: any
    }
    export interface ResponseParser<T> extends Interfaces.ResponseData<T> {
        error?: ResponseError
    }
}

export namespace TriggerSmartContractTypes {
    export interface TriggerSmartContractRequest {
        contractAddress: string
        functionCall: string
        options: Option
        parameter: Parameter[]
        issuerAddress: string
    }
    export interface Option {
        feeLimit?: number
        callValue?: number
        tokenValue?: number
        tokenId?: number
    }
    export interface Parameter {
        type: string
        value: string | number
    }
}
