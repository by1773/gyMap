/*
 * @Description: 坐标转换
 * @Author: yangb
 * @Date: 2019-05-21 16:57:27
 * @LastEditors: yangbo
 * @LastEditTime: 2019-05-28 16:05:22
 */
//笛卡尔坐标系转WGS84坐标系---世界坐标转换经纬度坐标
layui.define([], function(exports) {
  let CesiumObj = {
   Cartesian3_to_WGS84 : (point) => {
      const cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const lng = Cesium.Math.toDegrees(cartographic.longitude);
      const alt = cartographic.height;
      return {lat: lat, lng: lng, alt: alt};
    },
    //WGS84坐标系转笛卡尔坐标系---经纬度坐标转换世界坐标
    WGS84_to_Cartesian3 : (point) => {
      const car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
      const x = car33.x;
      const y = car33.y;
      const z = car33.z;
      return {x: x, y: y, z: z};
    }
  }
  exports('cesiumUtil',CesiumObj)
});

