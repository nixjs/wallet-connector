function isAddressValid(address: string): boolean {
    // eslint-disable-next-line @typescript-eslint/typedef
    const pattern = /^(bnb)([a-z0-9]{39})$/g
    // eslint-disable-next-line @typescript-eslint/typedef
    const regexp = new RegExp(pattern) // bnb + 39 a-z0-9
    const match: RegExpExecArray | null = regexp.exec(address)
    return match !== null
}

export default isAddressValid
