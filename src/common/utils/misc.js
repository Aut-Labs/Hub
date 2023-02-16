export const trimAddress = (address) => {
    if (!address) {
      return '';
    }
    const middle = Math.ceil(address.length / 2);
    const left = address.slice(0, middle).substring(0, 6);
    let right = address.slice(middle);
    right = right.substr(right.length - 4);
    return `${left}...${right}`.toUpperCase();
  };
  

  export const toHex = (num) => {
    const val = Number(num);
    return `0x${val.toString(16)}`;
  };