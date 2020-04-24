const  geoip = require('geoip-lite');
const getlocationMessageByIp = (ip) => {
    return geoip.lookup(ip);
};
const getGeoip = geoip
module.exports = {
    getlocationMessageByIp,
    getGeoip
};
