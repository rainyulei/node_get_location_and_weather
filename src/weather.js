const { CityInputType } = require('./config');
let http = require('http');
const https = require('https');
// 发送请求
const httpGETRequest = async (url) => {
  url.startsWith('https:') ? (http = https) : '';
  const pro = await new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.setEncoding('utf-8');
      res.on('data', function (chunk) {
        return resolve(chunk);
      });
      res.on('end', function () {});
    });
    req.on('error', function (err) {
      console.error(err);
      return reject(error);
    });
    req.end();
  });
  return pro;
};
// 通过自定义方法获取天气
const getweatherByweatherGetters = async (weatherFunctions) => {
  let result;
  for (let i = 0; i < weatherFunctions.length; i++) {
    const element = weatherFunctions[i];
    if (typeof element === 'function') {
      result = await element();
    } else {
      pro = await element.then();
      result = await pro();
    }
    if (result) return result;
  }
  return result;
};
// 格式化 参数
const getParams = (others) => {
  let params = '';
  for (const item in others) {
    if (others.hasOwnProperty(item)) {
      params += `&${item}=${others[item]}`;
    }
  }
  return params;
};
// 通过 seventimer  获取天气
const getWeatherFrom_sevenTimer = async (
  language,
  { lat, lon },
  { country, use, key, type, ...others }
) => {
  let params = getParams(others);
  const requestUrl =
    `http://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&lang=${language}&unit=${
      others['unit'] || 'metric'
    }&output=${others['output'] || 'json'}&tzshift=${
      others['tzshift'] || '0'
    }` + params;
  return async () => {
    const result = await httpGETRequest(requestUrl);
    return result;
  };
};
// 通过高德地图获取
const getWeatherFrom_amap = async (
  language,
  { lat, lon },
  { country, use, key, type, ...others }
) => {
  let params = getParams(others);
  let citycode = others['adcode'] || '';
  if (!citycode) {
    const tranlateURl = `https://restapi.amap.com/v3/geocode/regeo?location=${lon},${lat}&key=${key}`;
    let city = await httpGETRequest(tranlateURl);
    city = JSON.parse(city);
    citycode = city['regeocode']['addressComponent']['adcode'];
  }
  const requestUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&extensions=${
    type || 'all'
    }&output=${others['output'] || 'json'}&city=${citycode}`;
  return async () => {
    const result = await httpGETRequest(requestUrl);
    return result;
  };
};
// 通过 openweather  获取天气
const getWeatherFrom_openWeather = async (
  language,
  { lat, lon },
  { country, use, key, type, ...others }
) => {
  let params = getParams(others);
  const requestUrl =
    `https://api.openweathermap.org/data/2.5/${
      type || 'weather'
    }?appid=${key}&lat=${lat}&lon=${lon}&lang=${language}&units=${
      others['units'] || 'metric'
    }&mode=${others['output'] || 'json'}` + params;
  return async () => {
    const result = await httpGETRequest(requestUrl);
    return result;
  };
};
// 通过和风天气获取天气情况
const getWeatherFrom_niceWind = async (
  language,
  { lat, lon },
  { country, use, key, type, ...others }
) => {
  const params = getParams(others);
  const requestUrl = `https://free-api.heweather.net/s6/weather/${type}?key=${key}&lang=${language}&location=${lon},${lat}${params}`;
  return async () => {
    return await httpGETRequest(requestUrl);
  };
};
// 获取天气
const getWeather = async (
  type,
  localmessage,
  { weatherGetters, weather_language, LL_decimal, geoip, getWeather, ...others }
) => {
  const lat =
    type === CityInputType.City_ip
      ? localmessage['ll'][0]
      : localmessage['Latitude'];
  const lon =
    type === CityInputType.City_ip
      ? localmessage['ll'][1]
      : localmessage['Longitude'];
  const defaultWeatherGettersKeys = Object.keys(others);
  defaultWeatherGettersKeys.forEach((item) => {
    const f = eval(`getWeatherFrom_${item}`);
    const country = others[item]['country'] || 'all';
    if (!weatherGetters[country]) {
      weatherGetters[country] = [];
    }
    weatherGetters[country].push(
      f(weather_language, { lat, lon }, others[item])
    );
  });
  const localCountry =
    type === CityInputType.City_ip
      ? localmessage['country'].toUpperCase()
      : localmessage['Country_code'].toUpperCase();
  const weatherFunctions =
    weatherGetters[localCountry] || weatherGetters['all'];
  const result = await getweatherByweatherGetters(weatherFunctions);
  return result;
};
module.exports = getWeather;
