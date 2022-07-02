import * as React from 'react'

export function useLocalStorage<T>(key: string, defaultState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    // eslint-disable-next-line @typescript-eslint/typedef
    const state = React.useState<T>(() => {
        try {
            const value: string | null = localStorage.getItem(key)
            if (value) return JSON.parse(value) as T
        } catch (error) {
            if (typeof window !== 'undefined') {
                console.error(error)
            }
        }

        return defaultState
    })
    // eslint-disable-next-line @typescript-eslint/typedef
    const value = state[0]

    // eslint-disable-next-line @typescript-eslint/typedef
    const isFirstRender = React.useRef(true)

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        try {
            if (value === null) {
                localStorage.removeItem(key)
            } else {
                localStorage.setItem(key, JSON.stringify(value))
            }
        } catch (error) {
            if (typeof window !== 'undefined') {
                console.error(error)
            }
        }
    }, [value])

    return state
}
