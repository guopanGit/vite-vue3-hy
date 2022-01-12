<template>
  <div class="box">
    <div id="mapWap"></div>
  </div>
</template>

<script>
import {defineComponent, inject, onMounted} from "vue";
import {useStore} from "vuex";
import china from '@/assets/china-new.json'
import {useRouter} from "vue-router";

export default defineComponent({
  name: "mapvue",
  setup() {
    const store = useStore()
    const router = useRouter()
    let echarts = inject('ec');
    onMounted(() => {
      document.getElementById('mapWap').setAttribute('_echarts_instance_', '')
      let myChart = echarts.init(document.getElementById('mapWap'));
      myChart.showLoading()
      echarts.registerMap('china', china)
      const data = [
        {name: '杭州', value: 584}
      ];
      const geoCoordMap = {
        杭州: [120.19, 30.26]
      };
      const convertData = (data) => {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
              id: '12314'
            });
          }
        }
        return res;
      };
      myChart.setOption({
        title: {
          text: '项目分布图',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#fff',
            fontSize: 50
          },
        },
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#181F2D', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#181F2D', // 100% 处的颜色
            },
          ],
          globalCoord: false, // 缺省为 false
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return params.data.name + '<br>数量: ' + params.data.value[2]
          }
        },
        geo: {
          map: 'china',
          show: true,
          roam: true,
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: '#0998F6',
            borderColor: '#000',
            shadowColor: '#0998F6',
            shadowBlur: 50,
          },
          emphasis: {
            itemStyle: {
              areaColor: '#204D90',
              color: '#204D90'
            },
            label: {
              show: false,
            }
          }
        },
        series: [
          {
            name: '城市',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: (val) => {
              return val[1] / 2;
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
            },
            label: {
              formatter: '{b}',
              color: '#67C23A',
              position: 'right',
              fontSize:18,
              show: true,
            },
            itemStyle: {
              color: '#67C23A',
              shadowBlur: 20,
              shadowColor: '#333',
            }
          },
        ]
      });
      myChart.on('click', (params) => {
        // 获取点击的元素信息
        let data = params.data
        if (data) {
          router.push('/home')
        }
      });
      myChart.hideLoading()
    })
  }
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
}

#mapWap {
  width: 100%;
  height: 100%;
}
</style>