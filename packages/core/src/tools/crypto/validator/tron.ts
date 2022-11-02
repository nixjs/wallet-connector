import * as ethers from "ethers";
import cryptoUtils from "../bytes";

const ADDRESS_SIZE = 34;
const ADDRESS_PREFIX_BYTE = 0x41;

function isAddressValid(base58Str: string): boolean {
  try {
    if (typeof base58Str !== "string") throw new Error("Invalid address");

    if (base58Str.length !== ADDRESS_SIZE) throw new Error("Invalid address");

    let address: Uint8Array = ethers.utils.base58.decode(base58Str);

    if (address.length !== 25) throw new Error("Invalid address");

    if (address[0] !== ADDRESS_PREFIX_BYTE) throw new Error("Invalid address");

    const len: number = address.length;
    const offset: number = len - 4;
    const checkSum: Uint8Array = address.slice(offset);
    address = address.slice(0, offset);

    const hash0: any[] = cryptoUtils.SHA256(address);
    const hash1: any[] = cryptoUtils.SHA256(hash0);
    const checkSum1: any[] = hash1.slice(0, 4);

    if (
      checkSum[0] === checkSum1[0] &&
      checkSum[1] === checkSum1[1] &&
      checkSum[2] === checkSum1[2] &&
      checkSum[3] === checkSum1[3]
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export default isAddressValid;
