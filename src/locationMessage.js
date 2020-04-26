const {
  CountryInputType,
  CityInputType,
  AreaInputType,
  initConfig,
} = require('./config');
/**
 * 通过国家获取城市的信息
 *
 * @param {*} param0
 * @param {*} param1
 */
const getCitysByCountry = (
  { type, payload },
  { locationCN, locationWorldCity, worldCountry }
) => {
  const bool =
    payload === '中国' ||
    payload.toUpperCase() === 'CHINA' ||
    payload.toUpperCase() === 'CN';
  if (bool) return locationCN;

  const cities = [];
  for (const item in locationWorldCity) {
    if (locationWorldCity.hasOwnProperty(item)) {
      const element = locationWorldCity[item];
      switch (type) {
        case CountryInputType.country_name_cn:
          element['Country_CN'] === payload ? cities.push(element) : '';
          break;
        case CountryInputType.country_name_abbr:
          item.slice(0, 2).toUpperCase() === payload.toUpperCase()
            ? cities.push(element)
            : '';
          break;
        case CountryInputType.country_name_es:
          element['Country_EN'].toUpperCase() === payload.toUpperCase()
            ? cities.push(element)
            : '';
          break;
      }
    }
  }
  const country = getCountryShortMessageByCountryName(
    { type, payload },
    worldCountry
  );
  return { ...country, cities };
};
const getCountryShortMessageByCountryName = (
  { type, payload },
  worldCountry
) => {
  let element;
  for (let i = 0; i < worldCountry.length; i++) {
    switch (type) {
      case CountryInputType.country_name_cn:
        worldCountry[i]['Country_CN'] === payload
          ? (element = worldCountry[i])
          : '';
        break;
      case CountryInputType.country_name_abbr:
        worldCountry[i]['country_code'].toUpperCase() === payload.toUpperCase()
          ? (element = worldCountry[i])
          : '';
        break;
      case CountryInputType.country_name_en:
        element['Country_EN'].toUpperCase() === payload.toUpperCase()
          ? (element = worldCountry[i])
          : '';
        break;
    }
  }
  return element;
};
/**
 *  获取所有的国家 简略信息
 * @param {*} worldCountry
 */
const getAllCountries = (worldCountry) => {
  return Array.from(worldCountry);
};
/**
 *  通过 州 获取当地国家简略信息
 * @param {*} param0
 * @param {*} worldCountry
 */
const getAllCountriesByArea = ({ type, payload }, worldCountry) => {
  const countries = [];
  for (let i = 0; i < worldCountry.length; i++) {
    type === AreaInputType.CN && worldCountry[i]['Area_CN'] === payload
      ? countries.push(worldCountry[i])
      : '';
    type === AreaInputType.EN &&
    worldCountry[i]['Area_EN'].toUpperCase() === payload.toUpperCase()
      ? countries.push(worldCountry[i])
      : '';
  }
  return countries;
};
const getLocationByCityNameEN = (payload, locationCN, locationWorldCity) => {
  console.log('getLocationByCityNameEN')
  let getcity_name_en;
  for (const item in locationWorldCity) {
    if (locationWorldCity.hasOwnProperty(item)) {
      const element = locationWorldCity[item];
      element['City_EN'].replace(' ','').toUpperCase() === payload.replace(' ','').toUpperCase() ? (getcity_name_en = element) : '';
    }
  }
  if (!getcity_name_en) {
    for (const item in locationCN) {
      if (locationCN.hasOwnProperty(item)) {
        const element = locationCN[item];
        element['City_EN'].replace(' ','').toUpperCase() === payload.replace(' ','').toUpperCase() ? (getcity_name_en = element) : '';
      }
    }
  }
  return getcity_name_en;
};
const getLocationByCityNameCN = (payload, locationCN, locationWorldCity) => {
  let getcity_byname_cn;
  for (const item in locationCN) {
    if (locationCN.hasOwnProperty(item)) {
      const element = locationCN[item];
      element['City_CN'].toUpperCase() === payload.toUpperCase() ? (getcity_byname_cn = element) : '';
    }
  }
  if (!getcity_byname_cn) {
    for (const item in locationWorldCity) {
      if (locationWorldCity.hasOwnProperty(item)) {
        const element = locationWorldCity[item];
        element['City_CN'].toUpperCase() === payload.toUpperCase() ? (getcity_byname_cn = element) : '';
      }
    }
  }
  return getcity_byname_cn;
};
const getLocationByCity_code = (payload, locationCN, locationWorldCity) => {
  let getcity_code;
  payload.slice(0, 2).toUpperCase() === 'CN'
    ? (getcity_code = locationCN[payload.toUpperCase()])
    : (getcity_code = locationWorldCity[payload.toUpperCase()]);
  return getcity_code;
};
const getLocationByCity_ll = (payload, locationCN, locationWorldCity,LL_decimal) => {
  const cities = [];
    let { lat, lon } = payload;
   
  lat = (lat + '').slice(0, (lat + '').indexOf('.') +( LL_decimal+1));
    lon = (lon + '').slice(0, (lon + '').indexOf('.') + (LL_decimal + 1));
  for (const item in locationCN) {
    if (locationCN.hasOwnProperty(item)) {
      const element = locationCN[item];
      const loLat =
        element['Latitude'].slice(0, element['Latitude'].indexOf('.') + LL_decimal+1) + '';
      const loLon =
        element['Longitude'].slice(0, element['Longitude'].indexOf('.') +LL_decimal+ 1) +
        '';
      if (loLat === lat && loLon === lon) {
        cities.push(element);
      }
    }
  }
  for (const item in locationWorldCity) {
    if (locationWorldCity.hasOwnProperty(item)) {
      const element = locationWorldCity[item];
      const loLat =
        element['Latitude'].slice(0, element['Latitude'].indexOf('.') + LL_decimal+1) + '';
      const loLon =
        element['Longitude'].slice(0, element['Longitude'].indexOf('.') +LL_decimal+ 1) +
        '';
      if (loLat === lat && loLon === lon) {
        cities.push(element);
      }
    }
  }
  return cities;
};
const getLocationMessage = (
  { type, payload },
  { locationCN, locationWorldCity, worldCountry },
  config
) => {
  switch (type) {
    case CityInputType.City_code:
      return getLocationByCity_code(payload, locationCN, locationWorldCity);
      case CityInputType.City_ip:
      if (config.geoip) {
          const {getlocationMessageByIp} = require('./getlocationByIp');
        return getlocationMessageByIp(payload);
      } else {
        throw new Error('you need to open geoip config like this: weather( {geoip:true})');
      }

    case CityInputType.City_ll:
      return getLocationByCity_ll(payload, locationCN, locationWorldCity,config.LL_decimal);
    case CityInputType.City_name_CN:
      return getLocationByCityNameCN(payload, locationCN, locationWorldCity);
    case CityInputType.City_name_EN:
      return getLocationByCityNameEN(payload, locationCN, locationWorldCity);
    case CountryInputType.country_name_en:
    case CountryInputType.country_name_cn:
    case CityInputType.country_name_abbr:
      return getCitysByCountry(
        { type, payload },
        { locationCN, locationWorldCity, worldCountry }
      );
    case AreaInputType.CN:
    case AreaInputType.EN:
      return getAllCountriesByArea({ type, payload }, worldCountry);
  }
};
module.exports = {
  getLocationMessage,
  getCitysByCountry,
  getAllCountriesByArea,
  getAllCountries,
};
