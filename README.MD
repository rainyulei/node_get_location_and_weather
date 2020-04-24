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
  },
  {
    "Country_CN": "阿尔巴尼亚",
    "Country_EN": "Albania",
    "Area_CN": "欧洲",
    "Area_EN": "Europe",
    "country_code": "AL",
    "phone_code": "+355"
  },]
*/
NodeLocationWeather.getAllCountriesByArea('非洲') // 通过州名称获取国家信息  
// 可以使用  ‘非洲’ 或者 Africa
NodeLocationWeather.getCitysByCountry('捷克') // 通过国家名称获取含有的所有城市信息 
// 可以使用参数 捷克  或者 ‘Czechia’ 或者 ISO-3166-2 的国家简码 'CZ'
NodeLocationWeather.getLocation({
    city_name:'恰斯拉夫' // 通过城市中文名称从查询
    // 或者 city_name:'Caslav' // 通过城市英文名称查询
    //city_code:CZ3078234  // 通过内定的城市码查询
    // {lat:49.91099,lon:15.38972}  通过城市坐标查询
    //{ip:xx.xxx.xx.xxx} 通过IP查询位置城市  ---注意:开启IP查询必须打开配置中 geoip:true
    //{country_name:'中英文的国家名称，或者是ISO-3166国家简码'} --返回国家内所有城市列表 相当于  getCitysByCountry
    // {area_name:'中英文大洲的名称'} -- 返回所有的国家列表
}) 
NodeLocationWeather.getWeather()// 参数与 getLocation 相同  但是支持城市天气查询country_name area_name 会报错
```



