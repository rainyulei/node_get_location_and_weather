const path = require('path');
const {
  CountryInputType,
  CityInputType,
  AreaInputType,
  initConfig,
} = require('./src/config');
const {
  getLocationMessage,
  getCitysByCountry,
  getAllCountriesByArea,
  getAllCountries,
} = require('./src/locationMessage');
function getUserinputType(input) {
  const cnpatten = new RegExp('[\u4E00-\u9FA5]+');
  const espattern = new RegExp('[A-Za-z]+');
  const numpattern = new RegExp('[0-9]+');
  const IPV4pattern = new RegExp(
    /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
  );
  const IPV6pattern = new RegExp(/^(([\da-fA-F]{1,4}):){8}$/);
  // 没有 input 报错
  input = JSON.parse(JSON.stringify(input).toUpperCase());
  if (!input) {
    throw new Error("don't have a input!");
  } else if (
    !input['IP'] &&
    !input['CITY_CODE'] &&
    (!input['LAT'] || !input['LON']) &&
    !input['COUNTRY_NAME'] &&
    !input['CITY_NAME'] &&
    !input['AREA_NAME']
  ) {
    throw new Error('not a Effective input!');
  }
  // input 是IP
  if (input['IP']) {
    if (IPV4pattern.test(input['IP']) || IPV6pattern.test(input['IP'])) {
      return { type: CityInputType.City_ip, payload: input['IP'] };
    } else {
      throw new Error('not a true IP! please check it.');
    }
  }
  // input 是 city _code
  if (input['CITY_CODE']) {
    if (
      espattern.test(input['CITY_CODE'].slice(0, 2)) &&
      numpattern.test(input['CITY_CODE'].slice(2))
    ) {
      return { type: CityInputType.City_code, payload: input['CITY_CODE'] };
    } else {
      throw new Error('Wrong city_code type!');
    }
  }
  // input 是坐标
  if (input['LAT'] && input['LON']) {
    if (numpattern.test(input['LON']) && numpattern.test(input['LAT'])) {
      return {
        type: CityInputType.City_ll,
        payload: { lat: input['LAT'], lon: input['LON'] },
      };
    } else {
      throw new Error('wrong input longitude or latitude!');
    }
  }
  // input  是city name 的 说明有counry_name 或者没有
  if (input['CITY_NAME']) {
    if (cnpatten.test(input['CITY_NAME'])) {
      return { type: CityInputType.City_name_CN, payload: input['CITY_NAME'] };
    } else if (espattern.test(input['CITY_NAME'])) {
      return { type: CityInputType.City_name_EN, payload: input['CITY_NAME'] };
    } else {
      throw new Error('wrong input city_name!');
    }
  }
  // input 只有 country_name的
  if (input['COUNTRY_NAME']) {
    return testCountryInput(input['COUNTRY_NAME']);
  }
  if (input['AREA_NAME']) {
    return testAreaInput(input['AREA_NAME']);
  }
}
function testCountryInput(country) {
  if (!country) {
    throw new Error('need input a country name!');
  } else if (typeof country !== 'string') {
    throw new Error('wrong input type!');
  }
  const cnpatten = new RegExp('[\u4E00-\u9FA5]+');
  const espattern = new RegExp('[A-Za-z]+');
  if (cnpatten.test(country)) {
    return {
      type: CountryInputType.country_name_cn,
      payload: country,
    };
  } else if (espattern.test(country)) {
    if (country.length === 2) {
      return {
        // 英文两位简写
        type: CountryInputType.country_name_abbr,
        payload: country,
      };
    }
    return {
      //英文名称
      type: CountryInputType.country_name_en,
      payload: country,
    };
  } else {
    throw new Error('wrong input country_name !');
  }
}
function testAreaInput(area) {
  if (!area) {
    throw new Error('need input a area name !');
  } else if (typeof area !== 'string') {
    throw new Error('wrong input type !');
  }

  const cnpatten = new RegExp('[\u4E00-\u9FA5]+');
  const espattern = new RegExp('[A-Za-z]+');
  if (cnpatten.test(area)) {
    return {
      type: AreaInputType.CN,
      payload: area,
    };
  } else if (espattern.test(area)) {
    return {
      //英文名称
      type: AreaInputType.EN,
      payload: area,
    };
  } else {
    throw new Error('wrong input area name !');
  }
}

function testConfig(initConfig, config) {
  config = {
    ...initConfig,
    ...config,
    sevenTimer: { ...initConfig['sevenTimer'], ...config['sevenTimer'] },
    amap: { ...initConfig['amap'], ...config['amap'] },
    niceWind: { ...initConfig['niceWind'], ...config['niceWind'] },
    openWeather: { ...initConfig['openWeather'], ...config['openWeather'] },
  };
  if (config.LL_decimal > 2 || config.LL_decimal < 0)
    throw new Error('LL_decimal form 0 to 2 !');
  if (typeof config.geoip !== 'boolean')
    throw new Error('geoip nead a boolean type!');
  if (typeof config.getWeather !== 'boolean')
    throw new Error(
      'getWeather nead a boolean type! if you want use weather module you need to open it!'
    );
  if (
    config.weather_language.toUpperCase() !== 'CN' &&
    config.weather_language.toUpperCase() !== 'EN'
  ) {
    throw new Error('weather only support EN or CN language!');
  }
  const newConfig = {
    LL_decimal: config.LL_decimal, // 0-2
    geoip: config.geoip,
    getWeather: config.getWeather,
    weatherGetters: config.weatherGetters,
    weather_language: config.weather_language,
  };
  config.sevenTimer['use']
    ? (newConfig.sevenTimer = {
        use: true,
        country: config.sevenTimer['country'],
      })
    : '';
  testWeatherConfig('amap', config, newConfig);
  testWeatherConfig('niceWind', config, newConfig);
  testWeatherConfig('openWeather', config, newConfig);
  const sequence = createWeatherSequence(config);
  newConfig.weatherGetters = sequence;
  return newConfig;
}

function testWeatherConfig(type, config, newConfig) {
  if (config[type]['use']) {
    if (config[type]['key']) {
      newConfig[type] = {
        ...config[type],
      };
    } else {
      throw new Error(`not contain a ${type} key !`);
    }
  }
}
function testweatherGetters(weatherGetters) {
  if (weatherGetters) {
    if (weatherGetters instanceof Array) {
      weatherGetters.forEach((element) => {
        const { country, func, ...others } = element;
        if (!func || typeof func !== 'function') {
          throw new Error('can not find weatherGetters func!');
        }
        if (others && others.length > 0) {
          throw new Error(`${others[0]} is not a read config!`);
        }
      });
    } else {
      throw new Error('weatherGetters is a functiones list!');
    }
  }
}

function createWeatherSequence({ weatherGetters }) {
  testweatherGetters(weatherGetters);
  let sequence = {};
  // 添加weatherGetters 进去 天气序列
  for (let i = 0; i < weatherGetters.length; i++) {
    const element = weatherGetters[i];
    element['country'] = element['country'] ? element['country'] : 'all';
    if (!sequence[element['country']]) {
      sequence[element['country']] = [];
    }
    sequence[element['country']].push(element['func']);
  }
  return sequence;
}

function weatherEntry() {
  const locationCN = require('./src/location/china.json');
  const locationWorldCity = require('./src/location/world.json');
  const worldCountry = require('./src/location/country_tel.json');
  return (config) => {
    // 初始化设置 默认设置
    config = testConfig(initConfig, config);
    const output = {
      // 获取输入地的 信息
      getLocation: (input) => {
        input = getUserinputType(input);
        return getLocationMessage(
          input,
          {
            locationCN,
            locationWorldCity,
            worldCountry,
          },
          config
        );
      },
      // 获取国家的所有城市 信息集合
      getCitysByCountry: (country) => {
        country = testCountryInput(country);
        return getCitysByCountry(country, {
          locationCN,
          locationWorldCity,
          worldCountry,
        });
      },
      // 获取 所有国家的英文名称 输出中英文
      getAllCountries: () => {
        return getAllCountries(worldCountry);
      },
      // 获取大洲上的国家名称  输出中英文
      getAllCountriesByArea: (area) => {
        area = testAreaInput(area);
        return getAllCountriesByArea(area, worldCountry);
      },
      getWeather: async (input) => {
        if (config.getWeather) {
          const weather = require('./src/weather');
          input = getUserinputType(input);
          if (!CityInputType[input.type]) {
            throw new Error('sorry, wrong input type!');
          }
          localmessage = getLocationMessage(
            input,
            {
              locationCN,
              locationWorldCity,
              worldCountry,
            },
            config
          );
          if (!localmessage) { 
            return null;
          }
          if (!localmessage['Country_code']) { 
            localmessage['Country_code'] = localmessage['City_ID'].slice(0,2)
          }
          const weathermessage = await weather(
            input.type,
            localmessage,
            config
          );
          return weathermessage;
        } else {
          throw new Error('you need open weather setting');
        }
      },
    };
    if (config.geoip) {
      output.getLocationByIp = require('./src/getlocationByIp').getlocationMessageByIp;
      output.getGeoip = require('./src/getlocationByIp').getGeoip;
    }
    return output;
  };
}
module.exports = weatherEntry();
