<template>
  <div class="box">
    <div class="select-box">
      <div class="inquire">
        <el-select v-model="data.screen.operation" class="select-box"
                   @change="operation" placeholder="请选择运行状态">
          <el-option
              v-for="item in from.operation"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select v-model="data.screen.network" class="select-box"
                   @change="network" placeholder="请选择在线状态">
          <el-option
              v-for="item in from.network"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button class="inquire-btn" type="text" @click="layout">筛选</el-button>
      </div>
      <el-button class="bind-btn" type="text" @click="data.dialog = true">绑定设备</el-button>
    </div>
    <div class="card-list">
      <div class="box-wrap" v-for="(o,x) in data.list" :key="o">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>设备ID:{{ o.id }}</span>
              <div v-if="false">
                <el-button v-if="o.type === '六面扫系统'" type="text" class="open-btn">
                  数据
                </el-button>
                <el-button type="text" class="open-btn">
                  操作
                </el-button>
              </div>
            </div>
          </template>
          <div>
            <div class="box-card-center">
              <div class="key">
                设备类型信息:
              </div>
              <div class="val">
                {{ o.type }}
              </div>
            </div>
            <div class="box-card-center">
              <div class="key">
                设备在线状态:
              </div>
              <div class="val">
                {{ o.line }}
              </div>
            </div>
            <div class="box-card-center">
              <div class="key">
                版本号:
              </div>
              <div class="val">
                {{ o.state }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-drawer v-model="data.dialog" direction="ltr" :with-header="false">
      <div class="bind-box">
        <div class="bind-title">绑定设备</div>
        <el-button type="primary" size="medium" :loading="data.loading">{{
            data.loading ? '绑定中 ...' : '绑定'
          }}
        </el-button>
      </div>
    </el-drawer>
    <el-drawer v-model="data.drawer" @close="close" :with-header="false">
      <div class="box-details">
        <div class="box-title">设备详情</div>
        <div class="facility">
          <div class="item">
            <div class="key">设备类型</div>
            <div class="val">{{ data.list[data.index].type }}</div>
          </div>
          <div class="item">
            <div class="key">在线状态</div>
            <div class="val">{{ data.list[data.index].line }}</div>
          </div>
          <div class="item">
            <div class="key">设备版本号</div>
            <div class="val">{{ data.list[data.index].state }}</div>
          </div>
          <div v-if="data.list[data.index].type === '门禁'" v-loading="data.isFace" class="item">
            <div class="key">faceID</div>
            <div v-if="data.face === ''" class="val">采集中...</div>
            <div v-if="data.face !== ''" class="val">{{ data.face }}</div>
          </div>
          <div v-if="data.list[data.index].type === '门禁'" class="item">
            <div class="start" @click="start(data.index)">
              <i class="iconfont icon-kaishi"></i>
              <div>开门</div>
            </div>
            <div class="stop" @click="stop(data.index)">
              <i class="iconfont icon-tingzhi"></i>
              <div>关门</div>
            </div>
          </div>
          <div v-if="data.list[data.index].value === '六面扫系统'" class="camera">
            <el-card shadow="always">
              <div v-if="data.isCamera" class="camera-card">
                <div class="card-title">采集结果</div>
                <div class="card-center">123</div>
              </div>
              <div v-if="!data.isCamera" v-loading="!data.isCamera" class="camera-card">
                <div class="card-title">采集结果</div>
                <div class="card-center">采集中...</div>
              </div>
            </el-card>
          </div>
          <div v-if="data.list[data.index].type === '电子秤'" class="camera">
            <el-card shadow="always">
              <div v-if="data.weight !== 0" class="camera-card">
                <div class="card-title">采集结果</div>
                <div class="card-center">{{ data.weight }}g</div>
              </div>
              <div v-if="data.weight === 0" v-loading="data.weight === 0" class="camera-card">
                <div class="card-title">采集结果</div>
                <div class="card-center">采集中...</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog v-model="data.showCard" :with-header="false" center>
      <div v-loading="data.showLoading">
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
        <div class="details-right">
          <div id="chart"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {defineComponent, ref, reactive, inject} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'
import formatTime from '@/utils/system/layout'
import {ElMessage, ElLoading} from 'element-plus'

export default defineComponent({
  setup() {
    let echarts = inject('ec');
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const data = reactive({
      drawer: false,
      dialog: false,
      isCamera: false,
      table: true,
      date: '',
      list: [],
      val: {},
      index: 0,
      loading: true,
      showLoading: true,
      face: '',
      isFace: true,
      faceOk: false,
      weightOk: false,
      weight: 0,
      showCard: false,
      screen: {
        operation: '',
        network: ''
      }
    })
    const from = ref({
      network: [
        {
          value: '0',
          label: '全部',
        },
        {
          value: '1',
          label: '在线',
        },
        {
          value: '2',
          label: '离线',
        }
      ],
      operation: [
        {
          value: '0',
          label: '全部',
        },
        {
          value: '1',
          label: '停止运行',
        },
        {
          value: '2',
          label: '正在运行',
        }
      ]
    })
    const operate = (o, x) => {
      let val = o.type
      data.drawer = true
      data.index = x
      if (val !== '门禁') {
        // 请求成功回调
        data.isCamera = true
        if (val === '电子秤') {
          data.weightOk = false
          getWeight()
        }
        /*    let params = {
              Input: 0
            }

            store.dispatch('home/lamp', params)
                .then((res) => {
                  if (val === 1) {
                    console.log(res, '条码');
                  } else if (val === 2) {
                    console.log(res, '电子秤');
                  }
                })
                .catch((res) => {
                  console.log(res);
                })*/
      } else {

        data.faceOk = false
        getFace()

      }
    }
    // 关闭弹框操作
    const close = () => {
      data.isCamera = false
      if (data.list[data.index].type === '门禁') {
        data.faceOk = true
      } else if (data.list[data.index].type === '电子秤') {
        data.weightOk = true
      }
    }
    const start = (x) => {
      let val = data.list[x].state
      if (val === '正在运行') {
        ElMessage({
          showClose: true,
          message: '当前设备正在运行',
          grouping: true,
        })
      } else {
        data.list[x].state = '正在运行'
        let params = {
          Input: '1'
        }
        store.dispatch('home/lamp', params)
            .then((res) => {
              console.log(res);
              ElMessage({
                showClose: true,
                message: '设备运行成功',
                grouping: true,
                type: 'success',
              })
            })
            .catch((res) => {
              console.log(res);
            })
      }
    }
    const stop = (x) => {
      let val = data.list[x].state
      if (val === '停止运行') {
        ElMessage({
          showClose: true,
          message: '当前设备已停止运行',
          grouping: true,
        })
      } else {
        data.list[x].state = '停止运行'
        let params = {
          Input: '0'
        }
        store.dispatch('home/lamp', params)
            .then((res) => {
              ElMessage({
                showClose: true,
                message: '设备关闭成功',
                grouping: true,
                type: 'success',
              })
            })
            .catch((res) => {
              console.log(res);
            })
      }
    }
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
          data: ['扫码成功', '扫码失败'],
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
            name: '扫码成功',
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
            name: '扫码失败',
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
    const getDetail = (lastDate) => {
      data.showCard = true
      data.showLoading = true
      store.dispatch('home/getData', {lastDate})
          .then((res) => {
            data.showLoading = false
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
            data.loading = false
          })
          .catch((res) => {
            data.loading = false
          })
    }
    // 修改日期
    const setData = (e) => {
      let date = formatTime(e)
      data.date = date
      getDetail(date)
    }
    // 请求数据
    const openData = () => {
      let date = formatTime(new Date)
      data.date = date
      // getDetail(date)
      getDetail('2021-12-22')
    }
    const layout = () => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
        background: 'rgba(0, 0, 0, .8)',
      })
      let {network, operation} = data.screen
      console.log(`查询列表${network}${operation}`);
      let list = [
        {
          type: '门禁',
          line: '在线',
          state: '2021.2.2.1',
          id: 'entry-002'
        },
        {
          type: '六面扫系统',
          line: '离线',
          state: '2021.3.1.1',
          id: 'dws-002',
        },
        {
          type: '电子秤',
          line: '在线',
          state: '2021.2.2.1',
          id: 'weight-002'
        }
      ]
      data.list = list
      setTimeout(() => {
        loading.close()
      }, 1000)
    }
    // 获取人脸
    const getFace = () => {
      store.dispatch('home/getStatus', '')
          .then((res) => {
            data.face = res.face
            data.isFace = false
            if (!data.faceOk) {
              setTimeout(() => {
                getFace()
              }, 2000)
            }

          })
          .catch((res) => {
            data.Led = ''
            data.Camera = ''
            data.Scales = ''
          })
    }
    // 获取秤重
    const getWeight = () => {
      store.dispatch('home/getStatus', {Input: 2})
          .then((res) => {
            data.weight = res.weight || 0
            if (!data.weightOk) {
              setTimeout(() => {
                getWeight()
              }, 2000)
            }
          })
          .catch((res) => {
            console.log(res);
          })
    }
    layout()
    return {
      start,
      stop,
      data,
      from,
      operate,
      close,
      layout,
      setData,
      getFace,
      openData
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  text-align: left;

  .select-box {
    display: none;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding-left: 35px;
    padding-right: 35px;
    background: #fff;

    .inquire {
      display: flex;
      align-items: center;

      .inquire-btn {
        font-size: 16px;
      }
    }

    ::v-deep {
      .el-input__inner {
        background: #fff !important;
        border-color: #fff;
        color: #000;
        font-size: 16px;
      }
    }

    .bind-btn {
      margin-left: 10px;
      font-size: 16px;
    }
  }

  .card-list {
    padding: 15px;

    .box-wrap {
      display: inline-block;
      width: 20vw;
      margin-right: 10px;

      .box-card-center {
        display: flex;
        margin-bottom: 8px;

        &:last-child {
          margin-right: 0;
        }

        .key {
          flex: 4;
        }

        .val {
          flex: 6;
          text-align: left;
          padding-left: 10px;
        }
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;

        .open-btn {
          font-size: 20px;
        }
      }
    }
  }

  .bind-box {
    padding-left: 20px;

    .bind-title {
      height: 66px;
      line-height: 66px;
      font-size: 30px;
      text-align: center;
    }
  }

  .box-details {
    padding-left: 20px;

    .box-title {
      height: 66px;
      line-height: 66px;
      font-size: 30px;
      text-align: center;
    }

    .facility {
      .item {
        display: flex;
        padding: 10px 0;

        .key {
          width: 80px;
          margin-right: 20px;
        }

        .start, .stop {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 80px;
          font-size: 24px;
          color: #fff;
          border-radius: 10px;
          background: #32CC7F;
          user-select: none;
        }

        .start {
          margin-right: 20px;
          background: #32CC7F;

          i {
            font-size: 24px;
            margin-right: 10px;
          }
        }

        .stop {
          background: #ED5655;

          i {
            font-size: 24px;
            margin-right: 10px;
          }
        }

        .face-box {
          width: 100%;

          .card-title {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
          }

          .card-center {
            text-align: center;
            padding: 20px 0 20px 0;
          }
        }
      }

      .camera {
        padding-right: 20px;
        padding-top: 20px;

        .camera-card {
          text-align: center;

          .card-title {
            font-size: 18px;
            font-weight: 600;
          }

          .card-center {
            padding: 20px 0 20px 0;
          }
        }
      }
    }
  }

  :deep {
    .el-dialog {
      width: 1200px !important;
      height: 700px;
    }
  }

  .screen-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

  .details-right {
    width: 1160px;
    height: 600px;

    #chart {
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }
  }
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>