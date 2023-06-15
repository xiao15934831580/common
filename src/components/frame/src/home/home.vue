<template>
  <div class="box">
    <div class="top">
      <div class="topbox jiashicang">
        <p>领导驾驶舱</p>
      </div>
      <div class="topbox carNum">
        <div class="img">图标</div>
        <div class="msg">
          <p>车辆总数</p>
          <p>{{ carCount }}</p>
        </div>
      </div>
      <div class="topbox repairNum">
        <div class="img">图标</div>
        <div class="msg">
          <p>总维修车次</p>
          <p>{{ repairCount }}</p>
        </div>
      </div>
      <div class="topbox repairing">
        <div class="img">图标</div>
        <div class="msg">
          <p>在修量</p>
          <p>{{ inRepairCount }}</p>
        </div>
      </div>
      <div class="topbox hege">
        <div class="img">图标</div>
        <div class="msg">
          <p>维修合格率</p>
          <p>{{ passRate }}</p>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="charts">
        <div id="piechart"></div>
        <div id="areachart"></div>
      </div>
      <div class="table">
        <div id="barchart"></div>
        <div class="eltable">
          <p class="waitDealVos">待办事项</p>
          <el-table
            :data="waitDealVos"
            :header-cell-style="{
              background: '#d9ecff',
              'text-align': 'center',
            }"
            :cell-style="{ 'text-align': 'center' }"
            border
            style="width: 100%; height: calc(100% - 53px)"
          >
            <el-table-column label="序号" min-width="5%">
              <template #default="requestscope">
                <span class="elispice">{{ requestscope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="billCode" label="单据号" min-width="15%" />
            <el-table-column prop="billType" label="单据类型" min-width="7%" />
            <el-table-column
              prop="createdDate"
              label="创建时间"
              min-width="15%"
            />
            <el-table-column prop="user" label="提交人" min-width="7%" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import store from "@/store";
// import { getHome as getHome } from "@/api/index";
import { ElNotification, formatter } from "element-plus";
const carCount = ref("4");
const repairCount = ref("5");
const inRepairCount = ref("6");
const passRate = ref("7");
const piechartData = ref(""); //车辆故障原因汇总
const repCompareChartVos = ref(""); //车辆维修量同期对比图表数据
const waitDealVos = ref(""); //待办事项
const repCountChartVo = ref(""); //车辆维修统计
const { proxy } = getCurrentInstance();
const isfresh = ref(false);
onMounted(() => {
  getData();
});
const getData = () => {
  getHome().then((res) => {
    if (res.code === 200) {
      console.log(res);
      carCount.value = res.data.carCount;
      repairCount.value = res.data.repairCount;
      passRate.value = res.data.passRate;
      inRepairCount.value = res.data.inRepairCount;
      piechartData.value = res.data.faultChartVos; //车辆故障原因汇总
      repCompareChartVos.value = res.data.repCompareChartVos;
      waitDealVos.value = res.data.waitDealVos;
      repCountChartVo.value = res.data.repCountChartVo;
      // isfresh.value = true
      initpiechart();
      initlinechart();
      initbarchart();
    } else {
      ElNotification({
        title: "Warning",
        message: res.message,
        type: "warning",
      });
      if (res.message.indexOf("token已过期") > -1) {
        store.dispatch("app/logout");
      }
    }
  });
};
let piechartBox;
const initpiechart = () => {
  if (proxy.$echarts.getInstanceByDom(document.getElementById("piechart"))) {
    proxy.$echarts.dispose(document.getElementById("piechart"));
  }
  piechartBox = proxy.$echarts.init(document.getElementById("piechart"));
  let pieData = JSON.parse(JSON.stringify(piechartData.value));
  const option = {
    title: {
      text: "车辆故障原因汇总",
      left: "left",
      textStyle: {
        color: "#333333",
        fontStyle: "normal",
        fontWeight: "bold",
        fontFamily: '"Microsoft YaHei"',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "item",
      formatter:'{b}:&nbsp;&nbsp;{c}(车次)'
    },
    legend: {
      top: "center",
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        center: ["65%", "50%"],
        label: {
          formatter: "{b}\n{d}%",
          edgeDistance: 1,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: "#999",
            },
          },
        },

        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80,
        },
        labelLayout: function (params) {
          const isLeft = params.labelRect.x < piechartBox.getWidth() / 2;
          const points = params.labelLinePoints;
          // Update the end point.
          points[2][0] = isLeft
            ? params.labelRect.x
            : params.labelRect.x + params.labelRect.width;
          return {
            labelLinePoints: points,
          };
        },
        data: pieData,
      },
    ],
  };
  piechartBox.setOption(option, true);
  window.addEventListener("resize", function () {
    piechartBox.resize();
  });
};
const initlinechart = () => {
  if (proxy.$echarts.getInstanceByDom(document.getElementById("areachart"))) {
    proxy.$echarts.dispose(document.getElementById("areachart"));
  }
  const areachartBox = proxy.$echarts.init(
    document.getElementById("areachart")
  );
  let areaData = JSON.parse(JSON.stringify(repCompareChartVos.value));
  let legendData = [];
  areaData.forEach((item) => {
    legendData.push(item.name);
  });
  const option = {
    title: {
      text: "车辆维修量同期对比",
      textStyle: {
        color: "#333333",
        fontStyle: "normal",
        fontWeight: "bold",
        fontFamily: '"Microsoft YaHei"',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
        
      },
      formatter:(a)=>{
          let list = [];
          let listItem = '';
          console.log(a)
          for(let i = 0;i<a.length;i++){
            list.push('<span style="display: inline-block;padding: 5px 0;" >' +
                '<i style="display: inline-block;width: 10px;height: 10px;background: ' +
                a[i].color +
                ';border-radius: 50%;}"></i><span style="width:15px; display:inline-block;">' +
                '</span>' +
                a[i].seriesName +':&nbsp;&nbsp;'+ a[i].value+'(车次)'+
                '</span>')
          }
           listItem = list.join('<br/>')
          return '<div style="padding:6px;">'+'<p>'+a[0].name+'</p>' + listItem + '</div>'
      }
    },
    legend: {
      data: legendData,
      right: "4%",
    },
    grid: {
      left: "3%",
      right: "7%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        name: "月份",
        data: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ],
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "车次",
      },
    ],
    series: [
      {
        name: legendData[0],
        type: "line",
        data: areaData[0].data,
      },
      {
        name: legendData[1],
        type: "line",
        data: areaData[1].data,
      },
      {
        name: legendData[2],
        type: "line",
        data: areaData[2].data,
      },
    ],
  };
  areachartBox.setOption(option, true);
  window.addEventListener("resize", function () {
    areachartBox.resize();
  });
};
const initbarchart = () => {
  if (proxy.$echarts.getInstanceByDom(document.getElementById("barchart"))) {
    proxy.$echarts.dispose(document.getElementById("barchart"));
  }
  const barchartBox = proxy.$echarts.init(document.getElementById("barchart"));
  let barData = JSON.parse(JSON.stringify(repCountChartVo.value));
  const option = {
    title: {
      text: "车辆维修统计",
      textStyle: {
        color: "#333333",
        fontStyle: "normal",
        fontWeight: "bold",
        fontFamily: '"Microsoft YaHei"',
        fontSize: 16,
      },
    },
    tooltip: {
      formatter:(parmes) =>{
        console.log(parmes)
        return `${parmes.name}<br/> <ul><li class = 'countNum'><i style="display: inline-block;margin-right:16px ;width: 10px;height: 10px;background: 
                ${parmes.color} ;border-radius: 50%;}"></i>车辆维修统计:&nbsp;&nbsp; ${parmes.data}(车次)<li><ul>`
      }
    },

    grid: {
      left: "3%",
      right: "7%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: barData.term,
        name: "日",
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        name: "车次",
        type: "value",
      },
    ],
    series: [
      {
        name: "车辆维修统计",
        type: "bar",
        barWidth: "60%",
        data: barData.data,
      },
    ],
  };
  barchartBox.setOption(option, true);
  window.addEventListener("resize", function () {
    barchartBox.resize();
  });
};
</script>
<style lang = 'less' scoped>
.box {
  margin: 16px;
  height: calc(100% - 80px);
  .top {
    height: 100px;
    width: 100%;
    display: flex;
    .topbox {
      margin-left: 16px;
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        margin-right: 16px;
        width: 50px;
        height: 50px;
        background-color: #fff;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
      }
      .msg {
        p {
          color: #606266;
          font-size: 15px;
        }
      }
    }
    .jiashicang {
      background-color: #c0c0c0;
      text-align: center;
      line-height: 100px;
      font-size: 16px;
      color: #409eff;
      cursor: pointer;
    }
    .carNum {
      background-color: #dee9f6;
    }
    .repairNum {
      background-color: #f2e7e7;
    }
    .repairing {
      background-color: #ddf3f6;
    }
    .hege {
      background-color: #f2efe7;
    }
    :first-child {
      margin-left: 0;
    }
  }
  .center {
    height: calc(100% - 100px);
    .charts {
      height: calc(50% - 16px);
      margin-top: 16px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      #piechart {
        width: 40%;
        height: 100%;
        margin-right: 16px;
        background-color: #ffffff;
        padding: 16px;
      }
      #areachart {
        height: 100%;
        width: 60%;
        background-color: #ffffff;
        padding: 16px;
      }
    }
    .table {
      height: calc(50% - 16px);
      margin-top: 16px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      #barchart {
        height: 100%;
        padding: 16px;
        width: 55%;
        margin-right: 16px;
        background-color: #ffffff;
      }
      .waitDealVos {
        color: "#333333";
        font-style: "normal";
        font-weight: 600;
        font-size: 16;
        margin: 0 0 16px;
      }
      .eltable {
        width: 45%;
        padding: 16px;
        height: 100%;
        background-color: #ffffff;
      }
    }
  }
}
</style>