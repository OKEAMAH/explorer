
/**
 * Checks if the given string is strictly an address
 *
 * @method isStrictAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isStrictAddress = function (address) {
    return /^0x[0-9a-f]{40}$/i.test(address);
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return false;
    }
};

var isTransaction = function (tx) {
    if (!/^(0x)?[0-9a-f]{64}$/i.test(tx)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{64}$/.test(tx) || /^(0x)?[0-9A-F]{64}$/.test(tx)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return false;
    }
};

var divideByPowerOfTen = function(val,power){
    moveTo = power.toString().length - 1;
    parts = val.toString().split(".");
    if (parts[0].length > moveTo) {
        parts[0] = parts[0].slice(0, parts[0].length - moveTo) + "." + parts[0].slice(parts[0].length - moveTo, parts[0].length)
    }
    else {
        parts[0] = "0." + "0".repeat(moveTo - parts[0].length) + parts[0]
    }
    return parts.join("").toString().replace(/\.?0+$/, '');
}

var weiToGwei = function(val){
    return divideByPowerOfTen(val,Math.pow(1000, 3));
};