<template>
  <div id="cesiumContainer"></div>
</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'cesiumViewer',
  data () {
    return {
      center: [110.98, 30.83],
      viewer: null,
      tracker: null,
      layerId: 'globeDrawerDemoLayer',
      shapeDic: {},
      flag: 0,
      ff0Color: '#ff0',
      fColor: '#ff0'
    }
  },
  methods: {
    initialGlobeView () {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NjRjNGFjNy1jNDM3LTQzMTktODVlYS05YmFmOTAxYjk5MWUiLCJpZCI6Mzk5MSwic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTUzOTU3OTE2NX0.-25udUzENRJ66mnICMK8Hfc6xgF_VP7P4sWkSHaUjOQ'

      let image_Source = new Cesium.UrlTemplateImageryProvider({
        url:
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 17,
        credit: ''
      })
      let viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false,
        homeButton: true,
        sceneModePicker: true,
        fullscreenButton: true,
        vrButton: true,
        baseLayerPicker: true,
        infoBox: false,
        selectionIndicator: false,
        animation: false,
        timeline: false,
        shouldAnimate: true,
        navigationHelpButton: true,
        navigationInstructionsInitiallyVisible: false,
        mapProjection: new Cesium.WebMercatorProjection(),
        imageryProvider: image_Source,
        terrainProvider: Cesium.createWorldTerrain()
      })
      viewer.scene.globe.enableLighting = true
      viewer.scene.globe.depthTestAgainstTerrain = true
      viewer.scene.globe.showGroundAtmosphere = true

      let handler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      )
      handler.setInputAction(function (evt) {
        let cartesian = viewer.camera.pickEllipsoid(
          evt.position,
          viewer.scene.globe.ellipsoid
        )
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        let lng = Cesium.Math.toDegrees(cartographic.longitude) // 经度值
        let lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬度值
        let mapPosition = { x: lng, y: lat, z: cartographic.height } // cartographic.height的值始终为零。
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    initDrawHelper () {
      tracker = new GlobeTracker(viewer)

      // $("#drawPolygon").click(function () {
      //     changeColor()
      //     flag = 0;
      //     tracker.trackPolygon(function (positions) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = positions;
      //         showPolygon(objId, positions);

      //     });
      // });

      // $("#drawPolyline").click(function () {
      //     changeColor()
      //     flag = 0;
      //     tracker.trackPolyline(function (positions) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = positions;
      //         showPolyline(objId, positions);
      //     });
      // });

      // $("#drawRectangle").click(function () {
      //     changeColor()
      //     flag = 0;
      //     tracker.trackRectangle(function (positions) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = positions;
      //         showRectangle(objId, positions);
      //     });
      // });

      // $("#drawCircle").click(function () {
      //     changeColor()
      //     flag = 0;
      //     tracker.trackCircle(function (positions) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = positions;
      //         showCircle(objId, positions);
      //     });
      // });

      // $("#drawPoint").click(function () {
      //     changeColor()
      //     flag = 0;
      //     tracker.trackPoint(function (position) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = position;
      //         showPoint(objId, position);
      //     });
      // });

      // $("#drawBufferLine").click(function () {
      //     changeColor()
      //     flag = 0;
      //     tracker.trackBufferLine(function (positions, radius) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = {
      //             positions: positions,
      //             radius: radius
      //         };
      //         showBufferLine(objId, positions, radius);
      //     });
      // });

      // $("#posMeasure").click(function () {
      //     flag = 0;
      //     tracker.pickPosition(function (position, lonLat) {
      //     });
      // });

      // $("#disMeasure").click(function () {
      //     flag = 0;
      //     tracker.pickDistance(function (positions, rlt) {
      //     });
      // });

      // $("#areaMeasure").click(function () {
      //     flag = 0;
      //     tracker.pickArea(function (positions, rlt) {
      //     });
      // });

      // $("#straightArrow").click(function () {
      //     flag = 0;
      //     tracker.trackStraightArrow(function (positions) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = positions;
      //         showStraightArrow(objId, positions);
      //     });
      // });

      // $("#attackArrow").click(function () {
      //     flag = 0;
      //     tracker.trackAttackArrow(function (positions, custom) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = {
      //             custom: custom,
      //             positions: positions
      //         };
      //         showAttackArrow(objId, positions);
      //     });
      // });

      // $("#pincerArrow").click(function () {
      //     flag = 0;
      //     tracker.trackPincerArrow(function (positions, custom) {
      //         var objId = (new Date()).getTime();
      //         shapeDic[objId] = {
      //             custom: custom,
      //             positions: positions
      //         };
      //         showPincerArrow(objId, positions);
      //     });
      // });

      // $("#editShape").click(function () {
      //     layer.msg("点击要编辑的箭头！");
      //     flag = 1;
      //     //清除标绘状态
      //     tracker.clear();
      // });
      // $("#deleteShape").click(function () {
      //     layer.msg("点击要删除的箭头！");
      //     flag = 2;
      //     //清除标绘状态
      //     tracker.clear();
      // });
    },
    bindGloveEvent () {
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position)
        if (!pick) {
          return
        }
        var obj = pick.id
        if (!obj || !obj.layerId || flag == 0) {
          return
        }
        var objId = obj.objId
        // flag为编辑或删除标识,1为编辑，2为删除
        if (flag == 1) {
          switch (obj.shapeType) {
            case 'Polygon':
              flag = 0
              editPolygon(objId)
              break
            case 'Polyline':
              flag = 0
              editPolyline(objId)
              break
            case 'Rectangle':
              flag = 0
              editRectangle(objId)
              break
            case 'Circle':
              flag = 0
              editCircle(objId)
              break
            case 'Point':
              flag = 0
              editPoint(objId)
              break
            case 'BufferLine':
              flag = 0
              editBufferLine(objId)
              break
            case 'StraightArrow':
              flag = 0
              editStraightArrow(objId)
              break
            case 'AttackArrow':
              flag = 0
              editAttackArrow(objId)
              break
            case 'PincerArrow':
              flag = 0
              editPincerArrow(objId)
              break
            default:
              break
          }
        } else if (flag == 2) {
          clearEntityById(objId)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  },
  mounted () {
    this.initialGlobeView()
    this.initDrawHelper()
    this.bindGloveEvent()
    this.init3dTiles()
  }
}
</script>
