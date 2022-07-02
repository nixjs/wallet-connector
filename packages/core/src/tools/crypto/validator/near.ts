function isAddressValid(address: string): boolean {
    // eslint-disable-next-line @typescript-eslint/typedef
    const pattern = /^[a-z0-9][a-z0-9-_.]+.(near|aurora)/g
    // eslint-disable-next-line @typescript-eslint/typedef
    const regexp = new RegExp(pattern)
    const match: RegExpExecArray | null = regexp.exec(address)
    return match !== null
}

export default isAddressValid
