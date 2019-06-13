/*
 * @Description: 地图操作js
 * @Author: yangb
 * @Date: 2019-05-28 09:10:34
 * @LastEditors: yangbo
 * @LastEditTime: 2019-05-28 16:14:56
 */
layui.define([],function(exports) {
  let Tool ={
    drawPoint:(CesiumView,callback)=>{
      //坐标存储
      let positions = [];
      let handler = new Cesium.ScreenSpaceEventHandler(CesiumView.scene.canvas);
      //单击鼠标左键画点
      handler.setInputAction( (movement) =>{
        let cartesian=CesiumView.scene.globe.pick(CesiumView.camera.getPickRay(movement.position),CesiumView.scene)
        //   let cartesian = CesiumView.scene.camera.pickEllipsoid(movement.position, CesiumView.scene.globe.ellipsoid);
          positions.push(cartesian);
          CesiumView.entities.add({
              position: cartesian,
              point: {
                  color: Cesium.Color.RED,
                  pixelSize: 5,
                  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
              }
          });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //单击鼠标右键结束画点
      handler.setInputAction( (movement) => {
          handler.destroy();
          callback(positions);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    /**
     * @description: 点击开始画线
     * @param {type} 
     * @return: 
     */  
    //画线
    drawLineString:(CesiumView,callback)=>{
      let _this = this
      let PolyLinePrimitive = (function () {
        function _(positions) {
            this.options = {
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.RED,
                    width:3
                }
            };
            this.positions = positions;
            this._init();
        }
        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            CesiumView.entities.add(this.options);
        };
        return _;
    })();
  
    let handler = new Cesium.ScreenSpaceEventHandler(CesiumView.scene.canvas);
    let positions = [];
    let poly = undefined;
    //鼠标左键单击画点
    handler.setInputAction( (movement) =>{
        var cartesian = CesiumView.scene.camera.pickEllipsoid(movement.position, CesiumView.scene.globe.ellipsoid);
        if (positions.length == 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //鼠标移动
    handler.setInputAction( (movement) =>{
        var cartesian = CesiumView.scene.camera.pickEllipsoid(movement.endPosition, CesiumView.scene.globe.ellipsoid);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                    if(cartesian != undefined){
                              positions.pop();
                              cartesian.y += (1 + Math.random());
                              positions.push(cartesian);
                    }
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //单击鼠标右键结束画线
    handler.setInputAction( (movement) =>{
        handler.destroy();
        callback(positions);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
  /**
   * @description: 点击开始画面
   * @param {type} 
   * @return: 
   */  
  //画面
  drawPolygon:(CesiumView,callback)=>{
    const _this = this;
    let PolygonPrimitive = (function () {
        function _(positions) {
            this.options = {
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    perPositionHeight: true,
                    material: Cesium.Color.RED.withAlpha(0.4)
                }
            };
            this.hierarchy = positions;
            this._init();
        }
  
        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            //实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            CesiumView.entities.add(this.options);
        };
        return _;
    })();
  
    let handler = new Cesium.ScreenSpaceEventHandler(CesiumView.scene.canvas);
    let positions = [];
    let poly = undefined;
  
    //鼠标单击画点
    handler.setInputAction(function (movement) {
        let cartesian = CesiumView.scene.camera.pickEllipsoid(movement.position, CesiumView.scene.globe.ellipsoid);
        if (positions.length == 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //鼠标移动
    handler.setInputAction(function (movement) {
        let cartesian = CesiumView.scene.camera.pickEllipsoid(movement.endPosition, CesiumView.scene.globe.ellipsoid);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolygonPrimitive(positions);
            } else {
              if(cartesian != undefined){
                    positions.pop();
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
              }
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //鼠标右键单击结束绘制
    handler.setInputAction(function (movement) {
        handler.destroy();
        callback(positions);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
  
    /**
     * @description: 去除所有绘制图层
     * @param {type} 
     * @return: 
     */  
    removeAllLayer:(CesiumView)=>{
        try {
          //移除所有实体Entity
          CesiumView.entities.removeAll();
          //移除cesium加载的ImageryLayer
          //  for(var i=0; i<this.removeImageryLayers.length; i++){
          //      this.viewer.imageryLayers.remove(this.removeImageryLayers[i]);
          //  }
  
          return true
        } catch (error) {
          return false
        }
    }
  }
  exports('mapUtil',Tool)
})