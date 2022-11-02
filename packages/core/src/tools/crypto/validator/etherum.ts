import * as ethers from "ethers";

function verifyChecksum(hexAddress: string): boolean {
  try {
    if (!ethers.utils.isHexString(hexAddress, 20)) {
      throw new Error("Invalid address");
    }

    const address: string = hexAddress.toLowerCase();
    const addressHash0: string = hexAddress.replace("0x", "");

    const chars: string[] = address.substring(2).split("");

    const expanded: Uint8Array = new Uint8Array(40);
    for (let i = 0; i < 40; i++) {
      expanded[i] = chars[i].charCodeAt(0);
    }

    const addressHash1: string = ethers.utils
      .keccak256(expanded)
      .replace("0x", "");

    for (let i = 0; i < 40; i++) {
      // The nth letter should be uppercase if the nth digit of casemap is 1
      if (
        (parseInt(addressHash1[i], 16) > 7 &&
          addressHash0[i].toUpperCase() !== addressHash0[i]) ||
        (parseInt(addressHash1[i], 16) <= 7 &&
          addressHash0[i].toLowerCase() !== addressHash0[i])
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

function isAddressValid(hexAddress: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(hexAddress)) {
    // Check if it has the basic requirements of an address
    return false;
  }

  if (
    /^0x[0-9a-f]{40}$/.test(hexAddress) ||
    /^0x?[0-9A-F]{40}$/.test(hexAddress)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  }

  // Otherwise check each case
  return verifyChecksum(hexAddress);
}

export default isAddressValid;
