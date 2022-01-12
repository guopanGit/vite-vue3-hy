<template>
  <div class="box">
    <div class="box-herder">
      <div class="back" @click="goBack">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="screen-box">
        <el-date-picker
            v-model="data.date"
            class="screen"
            type="date"
            :clearable="false"
            placeholder="选择日期范围"
            @change="setData"
            :disabled-date="data.disabledDate"
            :shortcuts="data.shortcuts"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="box-center">
      <div v-if="false" class="details-left">
        <div class="card-wrap">
          <el-card shadow="always">
            <div class="card-title">灯</div>
            <div class="card-center">
              <div class="item">
                <div class="key">在线状态</div>
                <div v-if="data.Led === '运行中'" class="val normal">在线</div>
                <div v-if="data.Led !== '运行中'" class="val lose">离线</div>
              </div>
              <div class="item">
                <div class="key">运行状态</div>
                <div v-if="data.Led === '运行中'" class="val normal">运行中</div>
                <div v-if="data.Led !== '运行中'" class="val lose">未运行</div>
              </div>
              <div v-if="data.Led === '运行中'" class="item">
                <el-button @click="operate('1')" type="success">运行</el-button>
                <el-button @click="operate('0')" type="danger">停止</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <div class="card-wrap">
          <el-card shadow="always">
            <div class="card-title">摄像头</div>
            <div class="card-center">
              <div class="item">
                <div class="key">在线状态</div>
                <div v-if="data.Camera === '运行中'" class="val normal">在线</div>
                <div v-if="data.Camera !== '运行中'" class="val lose">离线</div>
              </div>
              <div class="item">
                <div class="key">运行状态</div>
                <div v-if="data.Camera === '运行中'" class="val normal">运行中</div>
                <div v-if="data.Camera !== '运行中'" class="val lose">未运行</div>
              </div>
              <div>
                <div>
                  <!--                  <el-button @click="operate('4')" type="success">采集</el-button>-->
                </div>
                <div v-if="data.face !== ''" class="item">
                  <div class="key">采集结果</div>
                  <div class="val">{{ data.face }}</div>
                </div>
              </div>

            </div>
          </el-card>
        </div>
        <div class="card-wrap">
          <el-card shadow="always">
            <div class="card-title">电子秤</div>
            <div class="card-center">
              <div class="item">
                <div class="key">在线状态</div>
                <div v-if="data.Scales === '运行中'" class="val normal">在线</div>
                <div v-if="data.Scales !== '运行中'" class="val lose">离线</div>
              </div>
              <div class="item">
                <div class="key">运行状态</div>
                <div v-if="data.Scales === '运行中'" class="val normal">运行中</div>
                <div v-if="data.Scales !== '运行中'" class="val lose">未运行</div>
              </div>
              <div>
                <div>
                  <!--                  <el-button @click="operate('2')" type="success">采集</el-button>-->
                </div>
                <div v-if="data.scalesVal > 0" class="item">
                  <div class="key">采集结果</div>
                  <div class="val">
                    <san>{{ data.scalesVal }}</san>
                    g
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="details-right">
        <div id="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, inject, onMounted, reactive} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {ElLoading} from "element-plus";
import formatTime from '@/utils/system/layout'

export default defineComponent({
  name: "details",
  setup() {
    let echarts = inject('ec');
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const data = reactive({
      Led: '',
      Scales: '',
      Camera: '',
      face: '',
      date: '',
      scalesVal: 0,
      succeed: [],
      defeated: [],
      disabledDate(time) {
        return time.getTime() > Date.now()
      },
      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        },
        {
          text: '昨天',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          },
        },
        {
          text: '一周前',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          },
        },
      ],
    })
    const setEcharts = (x, y, z) => {
      let app = {}
      let myChart = echarts.init(document.getElementById('chart'));
      myChart.showLoading();
      const posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ];
      app.configParameters = {
        rotate: {
          min: 0,
          max: 100
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: posList.reduce(function (map, pos) {
            map[pos] = pos;
            return map;
          }, {})
        },
        distance: {
          min: 0,
          max: 100
        }
      };
      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
          const labelOption = {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance
          };
          myChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          });
        }
      };
      const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        // formatter: '{c}',
        formatter: '',
        fontSize: 16,
        rich: {
          name: {}
        }
      };
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['成功', '失败'],
          textStyle: {
            fontSize: 20
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true}
          },
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: x,
            textStyle: {
              fontSize: 20
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            textStyle: {
              fontSize: 20
            }
          }
          /*{
            type: 'value',
            name: 'oc',
            min: 0,
            max: 100,
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f56c6c'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }*/
        ],
        series: [
          {
            name: '成功',
            type: 'bar',
            label: labelOption,
            itemStyle: {
              color: '#67C23A'
            },
            emphasis: {
              focus: 'series'
            },
            data: y
          },
          {
            name: '失败',
            type: 'bar',
            label: labelOption,
            itemStyle: {
              color: '#f56c6c'
            },
            emphasis: {
              focus: 'series'
            },
            data: z
          }
          /*{
            name: '123',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
              color: '#f56c6c'
            },
            data: [20, 21, 22, 23, 44]
          }*/
        ]
      });
      myChart.hideLoading();
    }
    const goBack = () => {
      // 返回上一级路由
      router.back()
    }
    const operate = (o) => {
      store.dispatch('home/lamp', {Input: o})
          .then((res) => {
            if (o === '2') {
              console.log(res);
              data.scalesVal = res.data
            }
            console.log(res);
          })
          .catch((res) => {
            console.log(res);
          })
    }
    const getDetail = (lastDate) => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
        background: 'rgba(0, 0, 0, .8)',
      })
      // 获取路由携带的参数
      let val = route.query.val
      store.dispatch('home/getData', {lastDate})
          .then((res) => {
            let x = []
            let y = []
            let z = []
            let succeed = []
            let defeated = []
            res.data.forEach(e => {
              x.unshift(e)
            })
            for (let i = 0; i < res.status.length; i++) {
              succeed.push(res.status[i][0])
              defeated.push(res.status[i][1])
            }
            succeed.forEach(e => {
              y.unshift(e)
            })
            defeated.forEach(e => {
              z.unshift(e)
            })
            setEcharts(x, y, z)
            loading.close()
          })
          .catch((res) => {
            loading.close()
          })
    }
    const layout = () => {
      // 获取设备状态
      store.dispatch('home/getStatus', '')
          .then((res) => {
            data.Led = res.data.Led
            data.Camera = res.data.Camera
            data.Scales = res.data.Scales
            data.face = res.face
            setTimeout(() => {
              layout()
            }, 2000)
          })
          .catch((res) => {
            data.Led = ''
            data.Camera = ''
            data.Scales = ''
          })
    }
    const setData = (e) => {
      let date = formatTime(e)
      data.date = date
      getDetail(date)
    }
    // layout()
    getDetail('2021-12-22')
    return {
      data,
      goBack,
      operate,
      layout,
      setData
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 90vh;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;

  .box-herder {
    display: flex;
    padding-top: 10px;
    padding-bottom: 20px;
    height: 3vh;

    .screen-box {
      width: 100%;

      ::v-deep {
        .el-input__inner {
          background: #fff !important;
          border-color: #ccc;
          color: #333;
          font-size: 18px;
        }
      }
    }

    .back {
      width: 60px;
      text-align: left;

      .icon-fanhui {
        font-size: 24px;
      }
    }
  }

  .box-center {
    display: flex;
    height: 80vh;

    .details-left {
      flex: 2;

      .card-wrap {
        padding: 20px 20px 20px 0;

        .card-title {
          font-size: 18px;
          font-weight: 600;
        }

        .card-center {
          font-size: 14px;

          .item {
            display: flex;
            margin: 10px 0;

            .normal {
              color: #67C23A;
            }

            .lose {
              color: #f56c6c;
            }

            .key {
              margin-right: 10px;
              font-size: 16px;
            }

            .val {
              font-size: 16px;
            }
          }
        }
      }
    }

    .details-right {
      flex: 8;

      #chart {
        width: 80%;
        height: 100%;
        margin: 0 auto;
      }
    }
  }


}


</style>