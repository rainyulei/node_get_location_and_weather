# 获取地址和天气

主要提供简单的 大洲 国家城市的联动，以及IP 坐标查询，以及后续的天气继承操作

## 引入和简单使用

引入

```javascript
npm i node_get_location_and_weather
```
简单使用

```javascript

const NodeLocationWeatherCreater = require('node-location-weather')
const NodeLocationWeather = NodeLocationWeatherCreater({
    // config
    geoip:true,// false 默认
    amap:{
        use:true,
        country:'all',// 默认all
        key:'你的高德地图申请的key放在这里'
    }
})
// 通过综合信息查询
NodeLocationWeather.getLocation({
    city_name:'恰斯拉夫' 
}) 
/**
{
    "Area_CN": "欧洲",
    "Area_EN": "Europe",
    "Country_CN": "捷克",
    "Country_EN": "Czechia",
    "City_CN": "恰斯拉夫",
    "City_EN": "Caslav",
    "Latitude": "49.91099",
    "Longitude": "15.38972",
    "City_ID": "CZ3078234"
  }
*/
// 通过综合信息查询天气
NodeLocationWeather.getWeather({city_name:'恰斯拉夫' })
// 参数与 getLocation 相同  但是支持城市天气查询country_name area_name 会报错
```

## 配置

### 启动配置

```javascript
const NodeLocationWeatherCreater = require('node-location-weather')
const NodeLocationWeather = NodeLocationWeatherCreater({
    geoip:true,//  默认 false 是否开启GeoIp  地理查询 不开启则不能通过IP 查询地址信息
    LL_decimal: 1, // 0-2 进行坐标查询城市的时候，坐标比对精确度小数点后面的几位数字， 默认为1位
	getWeather: true,//是否开启地理天气查询
  weatherGetters: [], // 自定义的天气查询方法，一个数组，内部为进行天气访问的对象 ， 格式为
    /**
     [
       * {country:'all' 或者是国家的中英文名称   }
       * func : async ()=>{
       * // 返回天气
       * }
       * ]
    */
    // 7timer 天气API 接口
    sevenTimer: {
    use: true, // 默认为使用
    type:"two"// 一到两周 天气预报  civil（默认） 民用 一周天气预报 civillight 民用简单一周预报  meteo 气象用途  astro 天文用途
    country: 'all', // 哪个国家地址访问启动此API 默认为All  所有国家，可以修改为‘CN’，则当查询中国城市天气时使用此API接口

       // ... 其他的参数为sevenTimer 提供的参数选项
  },
    // 高德天气接口
  amap: {
    use: false,// 是否开启
    country: 'CN', // 访问启动API的国家
    key: '',// 高德天气的 KEY
     type:"base" //base 实况天气 all 预报天气查询   ... 其他的参数为amap 提供的参数选项
  },
    // 和风天气 接口
  niceWind: {
    use: false,
    country: 'all',
      key: '',
    type:'lifestyle' // 使用的API 类型
      //... 其他的参数为niceWind提供的参数选项
  },
    //openWeather 接口
  openWeather: {
    use: false,
    country: 'all',
    key: '',
    type: 'forecast' // 16 日天气预报 forecast/daily 16日每日天气,//  默认为weather 当前天气预报  onecall 当前与未来48小时天气预报详细
     //API 类型 
      ... 其他的参数为openWeather 提供的参数选项
  },
  weather_language: 'EN',// 返回天气的语言， 注意 有些API 接口并不支持多语言，请查询后使用，默认为英文
})
```

>注意：geoip 默认为不开启，需要配置为true

### 方法参数

#### getLocation()

内部接受一个`对象` 可选为 

1. ``{city_name: 中文版本世界城市名称 || 英文版本世界城市名称 }``
2. ``{city_code: 城市的内部编码}``
3.  ``{lat:纬度,lon:经度}``
4. ``{ip:xx.xx.xx.xx}`` 注意:开启IP查询必须打开配置中 geoip:true
5. ``{country_name:中英文的国家名称，或者是ISO-3166国家简码}`` 返回国家的所有城市列表
6. ``{area_name:'中英文大洲的名称'}`` 返回所有的国家列表

```javascript
// 通过综合信息查询
NodeLocationWeather.getLocation({
    city_name:'恰斯拉夫' // 通过城市中文名称从查询
    // 或者 city_name:'Caslav' // 通过城市英文名称查询
    //city_code:CZ3078234  // 通过内定的城市码查询
    // {lat:49.91099,lon:15.38972}  通过城市坐标查询
    //{ip:xx.xxx.xx.xxx}  ---注意:开启IP查询必须打开配置中 geoip:true
}) 
/** 返回数据
{
    "Area_CN": "欧洲",
    "Area_EN": "Europe",
    "Country_CN": "捷克",
    "Country_EN": "Czechia",
    "City_CN": "恰斯拉夫",
    "City_EN": "Caslav",
    "Latitude": "49.91099",
    "Longitude": "15.38972",
    "City_ID": "CZ3078234"
  }
*/
```

#### getWeather()

1. ``{city_name: 中文版本世界城市名称 || 英文版本世界城市名称 }``
2. ``{city_code: 城市的内部编码}``
3.  ``{lat:纬度,lon:经度}``
4. ``{ip:xx.xx.xx.xx}`` 注意:开启IP查询必须打开配置中 geoip:true

> 参数与 getLocation 相同，只支持城市天气查询，当使用country_name，area_name 参数时候会报错

```javascript
// 通过综合信息查询天气
NodeLocationWeather.getWeather()
```

>  返回的参数与具体使用的天气API 有关。

#### getAllCountries()

```javascript
NodeLocationWeather.getAllCountries() // 获取所有的国家信息
// 输出数组
/*
*[{
    "Country_CN": "阿富汗",
    "Country_EN": "Afghanistan",
    "Area_CN": "亚洲",
    "Area_EN": "Asia",
    "country_code": "AF",
    "phone_code": "+93"
  }, 其他国家...
 ]
*/
```

#### getAllCountriesByArea()

可以使用`中文` 和`英文`

```javascript
// 通过州名称获取国家信息  
NodeLocationWeather.getAllCountriesByArea('非洲') // 可以使用  ‘非洲’ ||  Africa
/*输出数组
[
{
    "Country_CN": "阿尔及利亚",
    "Country_EN": "Algeria",
    "Area_CN": "非洲",
    "Area_EN": "Africa",
    "country_code": "DZ",
    "phone_code": "+213"
  }, 其他国家...
]
*/
```

####  getCitysByCountry()

 可以使用参数`国家中文名称`  或者 `国家英文名称` 或者 `ISO-3166-2` 的国家简码 

```javascript
// 通过国家名称获取该国家所有城市信息
NodeLocationWeather.getCitysByCountry('捷克')  // cz || Czechia
```

#### getGeoip

获取GEOiP 对象，可以使用geoip 包的方法，例如进行内置的IP 地址包更新等等。

## 在服务框架中使用

### 安装

###  eggjs 中集成

```javascript
//   /config/config.default.js 
config.weatherConfig = {
    geoip: true,
    amap: {
      use: true,
      country: 'CN',
      key: '',// 自己的key
    },
    niceWind: {
      use: true,
      country: 'CN',
      key: '',
      type: 'lifestyle',// 自己的key
    },
    openWeather: {
      use: true,
      key: '',// 自己的key
    },
  };
//   /extend/application.js
'use strict';
const nodeLocationAndWeather = require('node_get_location_and_weather');
const locationWeather = Symbol('Application#locationWeather');
/**
 * 挂载获取天气的方法在app 上  初始化的时候同时初始化
 */
module.exports = {
  get locationWeather() {
    this[locationWeather] = nodeLocationAndWeather(this.config.weatherConfig);
    return this[locationWeather];
  },
};

// 使用
this.app.locationWeather.getLocation({city_name:"new york"});
await this.app.locationWeather.getWeather({city_name:'new york'});
```

