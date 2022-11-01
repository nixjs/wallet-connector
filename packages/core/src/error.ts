import { BaseErrors, Errors } from '@nixjs23n6/types'

// eslint-disable-next-line @typescript-eslint/typedef
export const ERROR_TYPE = BaseErrors.enumify({
    WALLET_NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
    ACCOUNT_NOT_BE_LOGIN: 'ACCOUNT_NOT_BE_LOGIN',
    NETWORK_NOT_SUPPORTED: 'NETWORK_NOT_SUPPORTED'
})

type ErrorType = keyof typeof ERROR_TYPE

export const ERROR: Record<ErrorType, Errors.Error<ErrorType>> = {
    [ERROR_TYPE.WALLET_NOT_INSTALLED]: {
        type: ERROR_TYPE.WALLET_NOT_INSTALLED,
        code: 10002,
        stringify: (params?: any) => `Wallet is not installed${params ? `: ${params?.name}` : ''}`,
        format: (params?: any) => ({
            code: ERROR[ERROR_TYPE.WALLET_NOT_INSTALLED].code,
            message: ERROR[ERROR_TYPE.WALLET_NOT_INSTALLED].stringify(params)
        })
    },
    [ERROR_TYPE.NETWORK_NOT_SUPPORTED]: {
        type: ERROR_TYPE.NETWORK_NOT_SUPPORTED,
        code: 10003,
        stringify: (params?: any) => `This networks has not been supported${params ? `: ${params?.toString()}` : ''}`,
        format: (params?: any) => ({
            code: ERROR[ERROR_TYPE.NETWORK_NOT_SUPPORTED].code,
            message: ERROR[ERROR_TYPE.NETWORK_NOT_SUPPORTED].stringify(params)
        })
    },
    [ERROR_TYPE.ACCOUNT_NOT_BE_LOGIN]: {
        type: ERROR_TYPE.ACCOUNT_NOT_BE_LOGIN,
        code: 10004,
        stringify: (params?: any) => `Your account not be log in${params ? `: ${params?.name}` : ''}`,
        format: (params?: any) => ({
            code: ERROR[ERROR_TYPE.ACCOUNT_NOT_BE_LOGIN].code,
            message: ERROR[ERROR_TYPE.ACCOUNT_NOT_BE_LOGIN].stringify(params)
        })
    }
}
