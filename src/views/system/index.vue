<template>
  <div class="container">
    <div class="head">
      <div class="">物联平台</div>
      <div class="right">
        <div class="">
          <el-button class="home-btn" type="primary" @click="toHome">去首页</el-button>
        </div>
        <div class="">
          <el-avatar> admin</el-avatar>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="details">
        <div class="distribute">
          <div class="left">左边数据</div>
          <div class="centre">
            <div class="facility">
              <div class="item">
                <div>设备数量</div>
                <div>666</div>
              </div>
              <div class="item">
                <div>在线数量</div>
                <div>666</div>
              </div>
              <div class="item">
                <div>离线数量</div>
                <div>666</div>
              </div>
              <div class="item">
                <div>离线率</div>
                <div>10%</div>
              </div>
            </div>
            <div id="map"></div>
          </div>
          <div class="right">右边数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, inject, onMounted} from 'vue'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'index',
  setup() {
    const router = useRouter()
    let echarts = inject('ec');
    onMounted(() => {
      let myChart = echarts.init(document.getElementById('map'));

      myChart.showLoading();
      myChart.setOption({
        title: {
          text: 'Referer of a Website',
          textStyle: {
            color: '#fff',
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 1048, name: '北京'},
              {value: 735, name: '南京'},
              {value: 580, name: '西安'},
              {value: 484, name: '武汉'},
              {value: 300, name: '杭州'}
            ],
            label: {
              color: "#fff",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      myChart.hideLoading();

    })
    // 去首页
    const toHome = () => {
      router.push('/home')
    }
    return {
      toHome
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #011128;
  color: #fff;


  .head {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 28px;

    .right {
      display: flex;
      align-items: center;

      .home-btn {
        height: 38px;
        margin-right: 20px;
      }
    }
  }

  .content {
    padding: 0 40px 40px;
    margin: 0 auto;
    width: 80vw;

    .details {
      .distribute {
        display: flex;
        width: 100%;
        margin: 10px;

        .left {
          width: 300px;
          height: 500px;
          background: #181F2D;
        }

        .centre {
          width: 600px;
          height: 500px;
          margin: 0 20px;

          .facility {
            display: flex;
            width: 100%;
            background: #181F2D;
            margin-bottom: 10px;

            .item {
              width: 25%;
              height: 88px;

              div {
                height: 44px;
                line-height: 44px;
              }
            }
          }

          #map {
            width: 600px;
            height: 402px;
            background: #181F2D;
          }
        }


        .right {
          width: 300px;
          height: 500px;
          background: #181F2D;
        }
      }
    }
  }
}

</style>