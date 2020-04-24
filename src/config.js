initConfig = {
  LL_decimal: 1, // 0-2
  geoip: false,
  getWeather: true,
  weatherGetters: [],
  /**
   * [
   * {country:'all' 或者是国家的中英文名称   }
   * func : async ()=>{
   * // 返回天气
   * }
   * ]
   */
  sevenTimer: {
    use: true,
    country: 'all',
  },
  amap: {
    use: false,
    country: 'CN',
    key: '',
  },
  niceWind: {
    use: false,
    country: 'all',
      key: '',
    type:'now'
  },
  openWeather: {
    use: false,
    country: 'all',
    key: '',
    type: 'forecast',
  },
  weather_language: 'EN',
};

AreaInputType = {
  CN: 'CN',
  En: 'EN',
};
CountryInputType = {
  country_name_cn: 'country_name_cn',
  country_name_abbr: 'country_name_abbr',
  country_name_en: 'country_name_en',
};
CityInputType = {
  City_ip: 'City_ip',
  City_code: 'City_code',
  City_ll: 'City_ll',
  City_name_CN: 'City_name_CN',
  City_name_EN: 'City_name_EN',
};
module.exports = {
  CountryInputType,
  CityInputType,
  AreaInputType,
  initConfig,
};
