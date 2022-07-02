import * as ethers from 'ethers'
import { PLATFORM_CONTEXT } from '../constants'
import { Numberish, HexParser } from '../types'

export class Helpers {
    static isObject(value: any): boolean {
        return !!value && value.constructor === Object
    }

    static isFunction(value: any): boolean {
        return typeof value === 'function'
    }

    static isHex(value: any): boolean {
        return typeof value === 'string' && !Number.isNaN(parseInt(value, 16)) && /^(0x|)[a-fA-F0-9]+$/.test(value)
    }

    static isInteger(value: any): boolean {
        if (!value) return false
        return typeof value === 'number' && Number.isInteger(Number(value))
    }

    static isString(value: any): boolean {
        if (!value) return false
        return typeof value === 'string' || (typeof value === 'object' && value.constructor === String)
    }

    static isArray(value: any): boolean {
        return Array.isArray(value)
    }

    static isJson(value: any): boolean {
        if (!(value && typeof value === 'string')) {
            return false
        }
        try {
            JSON.parse(value)
            return true
        } catch (error) {
            return false
        }
    }

    static isBoolean(value: any): boolean {
        return typeof value === 'boolean'
    }

    static isNotNullOrUndefined(value: any): boolean {
        return value !== null && typeof value !== 'undefined'
    }

    static isBigNumber(value: any): boolean {
        return value && ethers.BigNumber.isBigNumber(value)
    }

    static isTronInstalled(): boolean {
        if (window && Object.prototype.hasOwnProperty.call(window, PLATFORM_CONTEXT.TRONWEB)) {
            return true
        }
        return false
    }

    static isBinanceInstalled(): boolean {
        if (window && Object.prototype.hasOwnProperty.call(window, PLATFORM_CONTEXT.BINANCE_CHAIN)) {
            return true
        }
        return false
    }

    static isMetaMaskInstalled(): boolean {
        if (window && Object.prototype.hasOwnProperty.call(window, PLATFORM_CONTEXT.ETHEREUM)) {
            return true
        }
        return false
    }

    static isCoin98Installed(): boolean {
        if (window && Object.prototype.hasOwnProperty.call(window, PLATFORM_CONTEXT.ETHEREUM)) {
            if ((window as any).coin98 || (window as any).isCoin98) {
                return true
            }
        }
        return false
    }

    static hasProperty(obj: object, property: string): boolean {
        return obj && Object.prototype.hasOwnProperty.call(obj, property)
    }

    static hasProperties(obj: object, properties: string[]): boolean {
        return !!(properties.length && !properties.map((property: string): boolean => this.hasProperty(obj, property)).includes(false))
    }

    static hasWalletCtx(context: any): boolean {
        return !!(Object.prototype.hasOwnProperty.call(window, context) && window[context])
    }

    static toNumberFromHex(value: string): number {
        if (!this.isHex(value)) return 0
        return ethers.BigNumber.from(value).toNumber()
    }

    static toDecimal(value: string, dec?: number): ethers.BigNumber | string {
        if (!value) return ''
        if (!dec) return value
        return ethers.BigNumber.from(value).mul(ethers.BigNumber.from(10).pow(dec))
    }

    static fromDecimal(value: string, dec?: number): ethers.BigNumber | string {
        if (!value) return ''
        if (!dec) return value
        return ethers.BigNumber.from(value).div(ethers.BigNumber.from(10).pow(dec))
    }

    static fromHexParser(value: Numberish, dec: number = 18): HexParser {
        if (this.isBigNumber(value)) {
            return {
                original: ethers.BigNumber.from(value)._hex,
                formated: ethers.utils.formatUnits(value, dec),
                dec,
            }
        }
        return {
            original: value,
        }
    }
}
