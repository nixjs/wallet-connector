import * as ethers from "ethers";

function isHexChar(c: any): number {
  if (
    (c >= "A" && c <= "F") ||
    (c >= "a" && c <= "f") ||
    (c >= "0" && c <= "9")
  ) {
    return 1;
  }

  return 0;
}

function hexChar2byte(c: any): number | never {
  let d: any;

  if (c >= "A" && c <= "F") d = c.charCodeAt(0) - "A".charCodeAt(0) + 10;
  else if (c >= "a" && c <= "f") d = c.charCodeAt(0) - "a".charCodeAt(0) + 10;
  else if (c >= "0" && c <= "9") d = c.charCodeAt(0) - "0".charCodeAt(0);

  if (typeof d === "number") return d;
  throw new Error("The passed hex char is not a valid hex char");
}

/* Convert a byte to string */
function byte2hexStr(byte: number): string {
  if (typeof byte !== "number") throw new Error("Input must be a number");

  if (byte < 0 || byte > 255) throw new Error("Input must be a byte");

  const hexByteMap = "0123456789ABCDEF";

  let str = "";
  str += hexByteMap.charAt(byte >> 4);
  str += hexByteMap.charAt(byte & 0x0f);

  return str;
}

function byteArray2hexStr(byteArray: Uint8Array): string {
  let str = "";
  for (let i = 0; i < byteArray.length - 1; i++) {
    str += byte2hexStr(+byteArray[i]);
  }
  return str;
}

function hexStr2byteArray(str: string): any[] {
  if (typeof str !== "string")
    throw new Error("The passed string is not a string");

  const byteArray: any[] = [];
  let d = 0;
  let j = 0;
  let k = 0;

  for (let i = 0; i < str.length; i++) {
    const c: string = str.charAt(i);

    if (isHexChar(c)) {
      d <<= 4;
      d += hexChar2byte(c);
      j++;

      // eslint-disable-next-line yoda
      if (0 === j % 2) {
        byteArray[k++] = d;
        d = 0;
      }
    } else throw new Error("The passed hex char is not a valid hex string");
  }

  return byteArray;
}

function SHA256(msgBytes: ethers.utils.BytesLike): any[] {
  const hashHex: string = ethers.utils.sha256(msgBytes).replace(/^0x/, "");
  return hexStr2byteArray(hashHex);
}

export default {
  SHA256,
  byteArray2hexStr,
  hexStr2byteArray,
};
