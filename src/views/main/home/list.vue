<template>
  <div class="box">
    <div class="screen-wrap">
      <!--            <el-select v-model="data.SelectVal.date"
                             class="screen"
                             @change="setData"
                             placeholder="Select">
                    <el-option
                        v-for="item in data.Select.date"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                  </el-select>-->
      <el-date-picker
          v-model="data.SelectVal.date"
          class="screen"
          type="date"
          placeholder="Pick a day"
          @change="setData"
          :disabled-date="data.disabledDate"
          :shortcuts="data.shortcuts"
      >
      </el-date-picker>
      <el-input v-model="data.SelectVal.bar" class="bar-input"
                placeholder="请输入条码" @change="setBar" clearable/>
      <!--      <el-select v-model="data.SelectVal.bar"
                       class="screen"
                       @change="setBar"
                       placeholder="Select">
              <el-option
                  v-for="item in data.Select.bar"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>-->
      <el-button class="screen-btn" type="text" @click="setPages">筛选</el-button>
    </div>
    <div class="table-wrap">
      <el-table class="table"
                :data="data.tableData"
                stripe
                border
                @row-click="showImg"
                :header-row-style="'height:66px'"
                :row-style="'height:60px;'"
                style="width: 100%"
                height="100%">
        <el-table-column fixed prop="TransDate"
                         label="日期" width="260"/>
        <el-table-column prop="MatNo" label="条码" width="260"/>
        <el-table-column prop="Width" label="宽(mm)" width="120"/>
        <el-table-column prop="Height" label="高(mm)" width="120"/>
        <!--        <el-table-column prop="ImagePath "
                                 label="图片" width="100">
                  <template #default="scope">
                    <div class="showImg">查看</div>
                  </template>
                </el-table-column>-->
        <el-table-column prop="SendState" label="状态" width="120"/>
        <el-table-column prop="PackageState" label="PackageState" width="320"/>
        <el-table-column prop="ScanTime" label="ScanTime" width="320"/>
        <el-table-column prop="TypeDSC " label="TypeDSC " width="220"/>
        <el-table-column prop="Volume " label="Volume " width="160"/>
        <el-table-column prop="Weight " label="Weight " width="160"/>
      </el-table>
      <el-pagination background
                     class="pagination"
                     :hide-on-single-page="true"
                     :page-size="50"
                     layout="prev, pager, next"
                     @current-change="setPages"
                     :current-change="data.pages"
                     :total="data.length"></el-pagination>
      <!--      <el-dialog v-model="data.showImg" title="图片信息">
              <el-image
                  :src="data.imgUrl"
                  fit="contain"
              ></el-image>
            </el-dialog>-->
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive} from 'vue'
import {ElLoading, ElMessage} from "element-plus";
import {useStore} from "vuex";

export default defineComponent({
  name: "list",
  setup() {
    const store = useStore()
    const data = reactive({
      tableData: [],
      length: 0,
      showImg: false,
      imgUrl: '',
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
      date: 0,
      bar: 0,
      Select: {
        date: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '2020-12-13',
            value: 1
          },
          {
            label: '2020-12-13',
            value: 2
          }
        ],
        bar: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '20201212',
            value: 1
          },
          {
            label: '20201213',
            value: 2
          }
        ]
      },
      SelectVal: {
        date: '',
        bar: ''
      },
      pages: 1
    })
    const setData = (e) => {
      let s = new Date(e)
      let dates = `${s.getFullYear()}-${(s.getMonth() + 1)}-${s.getDate()}`
      data.bar = 0
      data.date = dates
      data.SelectVal.bar = ''
    }
    const setBar = (e) => {
      data.bar = e
      data.date = 0
      data.SelectVal.date = ''
    }
    const showImg = (row, column) => {
      console.log(row, column);
      if (column.property === 'ImagePath ') {
        // let ImagePath = row.ImagePath
        data.showImg = true
        data.imgUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }

    }
    const setPages = () => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
        background: 'rgba(0, 0, 0, .8)',
      })
      let {date, bar} = data
      let value = {}
      if (date !== 0) {
        value.TransDate = date
      }
      if (bar !== 0) {
        value.MatNo = bar
      }
      store.dispatch('home/getList', value)
          .then((res) => {
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].SendState === 'success') {
                res.data[i].SendState = '成功'
              } else {
                res.data[i].SendState = '失败'
              }
            }
            let length = res.length
            data.tableData = res.data
            data.length = length
            loading.close()
          })
          .catch((res) => {
            loading.close()
            ElMessage({
              showClose: true,
              message: res.msg || res.message || '服务异常',
              grouping: true,
              type: 'error',
            })
          })
    }
    setPages()
    return {
      data,
      setPages,
      showImg,
      setData,
      setBar
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  background: #fff;


  .screen-wrap {
    display: flex;
    align-items: center;
    width: 95%;
    height: 60px;
    background: #fff;
    margin-left: 20px;


    .screen {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding-left: 70px;
      padding-right: 35px;
      background: #fff;
    }

    ::v-deep {
      .el-input__inner {
        background: #fff !important;
        border-color: #fff;
        color: #000;
        font-size: 16px;
      }
    }

    .screen-btn {
      font-size: 16px;
    }
  }

  .table-wrap {
    width: 100%;
    height: 89%;

    .table {
      font-size: 22px;

      .el-icon-arrow-down {
        font-size: 22px !important;
      }

      .showImg {
        font-size: 18px;
        color: #409eff;
        cursor: pointer;
        user-select: none;
      }
    }

    .pagination {
      text-align: right;
      padding-right: 20px;
    }
  }

  ::v-deep {
    .table-wrap .number {
      min-width: 50px !important;
    }
  }

}
</style>