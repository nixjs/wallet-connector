import debug from 'debug'
import { Types } from '@nixjs23n6/wc-types'

export interface MessageLogger {
    method?: string
    parameters?: Types.Object<any>
    metadata?: Types.Object<any>
    [name: string]: any
}

export function showLogger(title: string, log: debug.Debugger, type: 'Notify' | 'Success' | 'Error', context?: MessageLogger) {
    let color = '#FABB51'
    if (type === 'Success') {
        color = '#6BCB77'
    } else if (type === 'Error') {
        color = '#FF6B6B'
    }
    log(`%c${title} \n\n`, `color: ${color}; font-size:14px`)
    if (context) log('» Context:', context)
    log('\n\n')
}
