const { v4: uuidv4 } = require('uuid');
const bwipjs = require('bwip-js');

const generateRegistrationNumber = () => {
    return 'REG-' + uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
};

const generateBarcode = (registrationNumber) => {
    return bwipjs.toBuffer({
        bcid: 'code128',
        text: registrationNumber,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
    });
};

module.exports = {
    generateRegistrationNumber,
    generateBarcode
};