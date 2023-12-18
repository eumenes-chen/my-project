<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue';
const todayWeight = ref('') // 今日体重
const planWeight = ref(' ') // 计划体重
const differWeight = ref('') // 超前几斤
const differDate = ref('') // 超前几日
const money = ref(2200) // 可用金额
const breakLine = ref(129) // 待突破的体重线
// 减脂成果
const realData = [
  155.6,
  156.7,//8/10
  154.9,
  155.3,
  154.3,
  155.1,
  152.8,
  153,
  153.4,
  153.1,
  152.4,
  152.8,//8/20
  151.6,
  151,
  151,
  151.6,
  152,
  151.4,
  150.6,
  151.4,
  150.6,
  149.4,//8/30
  150.4,
  149.2,//9/01
  149.1,
  148.5,
  146.6,
  147.1,
  148,
  147.1,
  146.4,
  146.2,//9/09
  145.8,//9/10
  145.3,//9/11
  145.2,//9/12
  144.6,//9/13
  144,//9/14
  144.4,//9/15 
  143.3,//9/16 
  142.5,//9/17 
  141.7,//9/18 
  141.5,//9/19 
  140.4,//9/20 
  140.2,//9/21 
  139.5,//9/22 
  139.1,//9/23 
  138.2,//9/24 
  139.6,//9/25 
  139.6,//9/26 
  138.9,//9/27 
  139.2,//9/28 
  140.1,//9/29 
  139.5,//9/30 
  140.6,//10/1 
  140.1,//10/2 
  139.2,//10/3 
  139.3,//10/4 
  140.1,//10/5 
  140.3,//10/6 
  139,//10/7 
  138.1,//10/8
  137.3,//10/9
  136.9,//10/10
  138.1,//10/11
  138.6,//10/12
  137.3,//10/13
  138,//10/14
  138,//10/15
  135.8,//10/16
  134.5,//10/17
  134.4,//10/18
  135.6,//10/19
  136.3,//10/20
  136.2,//10/21
  137.1,//10/22
  136.2,//10/23
  136.4,//10/24
  135.1,//10/25
  135.2,//10/26
  136.2,//10/27
  135.3,//10/28
  135.9,//10/29
  134.4,//10/30
  135.4,//10/31
  136.5,//11/01
  135.2,//11/02
  134.7,//11/03
  134.4,//11/04
  132.9,//11/05
  135.3,//11/06
  135.1,//11/07
  134.4,//11/08
  134.2,//11/09
  135.1,//11/10
  133.5,//11/11
  133.2,//11/12
  134.3,//11/13
  134.5,//11/14
  134.9,//11/15
  135.3,//11/16
  134.5,//11/17
  134.3,//11/18
  133.9,//11/19
  134.2,//11/20
  134.7,//11/21
  135.5,//11/22
  134.6,//11/23
  135.2,//11/24
  134.1,//11/25
  133.7,//11/26
  132.9,//11/27
  132.3,//11/28
  131.3,//11/29
  130,//11/30
  131.5,//12/01
  129.8,//12/02
  131.5,//12/03
  133.1,//12/04
  131.7,//12/05
  131.1,//12/06
  130.3,//12/07
  130.6,//12/08
  130.9,//12/09
  132.2,//12/10
  130.7,//12/11
  130.7,//12/12
  129.5,//12/13
  129.8,//12/14
  131.1,//12/15

]

let n = ref(10)
// 练习
const practise = () => {
  console.log('n',n.value);
  if(n.value > 0){
    n.value--;
  }else{
    console.log('执行');
    n.value = 10;
  }
}
// setInterval(() => {
//   console.log('???');
//   practise();
// }, 100);
let oldArr = [3,6,1,2,4,8,5,2,5,4,1,9,6]

let digit = (arr,type = 'rise') => {
  if(arr.length <= 1){
    return arr;
  }
  let mid = Math.floor(arr.length/2);
  let midNum = arr.splice(mid,1);
  let left = [];
  let right = [];
  arr.forEach(item => {
    if(type === 'rise'){
      item <= midNum ? left.push(item) : right.push(item)
    }else {
      item >= midNum ? left.push(item) : right.push(item)
    }
  })
  return (digit(left,type).concat(midNum,digit(right,type)))
}
let newArr = digit(oldArr);
console.log('newArr',newArr);



// 获取ECharts
const getChart = () => {
  var myChart = echarts.init(document.getElementById('echart-dom'));
  // 计算echarts数据
  let base = +new Date(2023, 7, 8);
  let oneDay = 24 * 3600 * 1000;
  let dateList = [];
  let planData = []
  let nowWeight = 155
  let k = 3;
  let aday = 0.5;
  for (let i = 1; i < 235; i++) {
    var now = new Date((base += oneDay));
    dateList.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    switch (true) {
      case nowWeight >= 150: k = 4; break;
      case nowWeight >= 145: k = 4; break;
      case nowWeight >= 140: k = 4; break;
      case nowWeight >= 135: k = 5; break;
      case nowWeight >= 130: k = 7; break;
      case nowWeight >= 125: k = 9; break;
      default: k = 10; break;
    }
    aday = 1 / k
    nowWeight = (nowWeight - aday).toFixed(3);
    planData.push(nowWeight > 125 ? nowWeight : 125);
    k--;
  }




  // 处理顶部信息
  todayWeight.value = realData[realData.length - 1]
  planWeight.value = (Number(planData[realData.length - 1])).toFixed(1)
  differWeight.value = (Number(((todayWeight.value - planWeight.value) * 1000).toFixed(0))) / 1000;
  let saveDate = 0
  for (let i = 0; i < planData.length; i++) {
    if (planData[i] < todayWeight.value) {
      saveDate = i;
      break
    }
  }
  differDate.value = realData.length - 1 - saveDate


  // 事件列表
  const eventList = [
    { date: '2023/8/13', value: '云' },
    { date: '2023/8/16', value: '9' },
    { date: '2023/8/22', value: '9' },
    { date: '2023/8/26', value: '分离' },
    { date: '2023/8/31', value: '兴隆' },
    { date: '2023/9/4', value: '中等' },
    { date: '2023/9/8', value: '10' },
    { date: '2023/9/11', value: '10' },
    { date: '2023/9/14', value: '兴隆' },
    { date: '2023/9/17', value: '醒悟' },
    { date: '2023/9/18', value: '面试' },
    { date: '2023/9/23', value: '兴隆' },
    { date: '2023/9/24', value: '毕业' },
    { date: '2023/9/26', value: '火车' },
    { date: '2023/9/27', value: '回齐' },
    { date: '2023/9/29', value: '中秋' },
    { date: '2023/10/1', value: '国庆' },
    { date: '2023/10/7', value: '国庆结束' },
    { date: '2023/10/9', value: '兴隆' },
    { date: '2023/10/11', value: '香槟' },
    { date: '2023/10/13', value: 'offer' },
    { date: '2023/10/16', value: '失去' },
    { date: '2023/10/17', value: '入职' },
    { date: '2023/10/18', value: '交房租' },
    { date: '2023/10/19', value: '10' },
    { date: '2023/10/21', value: '涮肉' },
    { date: '2023/10/23', value: '周一' },
    { date: '2023/10/28', value: '骑行' },
    { date: '2023/10/30', value: '周一' },
    { date: '2023/11/6', value: '周一' },
    { date: '2023/11/13', value: '周一' },
    { date: '2023/11/15', value: '请假' },
    { date: '2023/11/20', value: '周一' },
    { date: '2023/11/25', value: '加班' },
    { date: '2023/11/27', value: '周一' },
    { date: '2023/12/15', value: '发工资' },
    { date: '2024/1/1', value: '元旦' },
    { date: '2024/1/15', value: '发工资' },
    { date: '2024/2/10', value: '春节' },
    { date: '2024/2/17', value: '结束' },
  ]
  // 处理后的事件列表
  let handleEventList = []
  const initEvent = () => {
    let eachData = {}
    let dataIndex = ''
    eventList.forEach(item => {
      dataIndex = dateList.indexOf(item.date)
      eachData = {
        value: item.value,
        coord: [dataIndex, planData[dataIndex]]
      }
      handleEventList.push(eachData)
    })
  }
  initEvent();


  myChart.setOption({
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: '减脂计划'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList
    },
    yAxis: {
      type: 'value',
      interval: 5,
      axisLabel: {
        formatter: '{value} 斤'
      },
      scale: true,
      min: 120,
      max: 160
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10
      },
      {
        start: 0,
        end: 10
      }
    ],
    series: [
      {
        name: '计划体重',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
        markPoint: {
          symbol: 'roundRect',
          symbolOffset: [0, '-140%'],
          itemStyle: {
            color: '#aaa'
          },
          data: handleEventList
        },
        markLine: {
          data: [
            {
              yAxis: 157.5, label: {
                formatter: () => '待业2023'
              }
            },
            {
              yAxis: 155, label: {
                formatter: () => '从益彰离职2023'
              }
            },
            {
              yAxis: 152.5, label: {
                formatter: () => '疫情居家2022'
              }
            },
            {
              yAxis: 150, label: {
                formatter: () => '入职益彰后2022'
              }
            },
            {
              yAxis: 147.5, label: {
                formatter: () => '宇动源2022'
              }
            },
            {
              yAxis: 145, label: {
                formatter: () => '待业期2021'
              }
            },
            {
              yAxis: 142.5, label: {
                formatter: () => '博彦工作2021'
              }
            },
            {
              yAxis: 140, label: {
                formatter: () => '千峰学vue2020'
              }
            },
            {
              yAxis: 137.5, label: {
                formatter: () => '毕业前2018'
              }
            },
            {
              yAxis: 135, label: {
                formatter: () => '大学新寝室2016'
              }
            },
            {
              yAxis: 132.5, label: {
                formatter: () => '大一军训'
              }
            },
            {
              yAxis: 130, label: {
                formatter: () => '少量无氧，正常饮食'
              }
            },
            {
              yAxis: 127.5, label: {
                formatter: () => '大量无氧'
              }
            },
            {
              yAxis: 125, label: {
                formatter: () => '全力无氧，多吃'
              }
            },
          ]
        },
        data: planData
      }, {
        name: '实际体重',
        type: 'line',
        data: realData,
        label: {
          show: true,
          position: 'top'
        },
      }, {
        name: '月份',
        type: 'line',
        smooth: true,
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)'
          },
          data: [
            [
              {
                name: '8月份',
                xAxis: '2023/8/9'
              },
              {
                xAxis: '2023/8/31'
              }
            ],
            [
              {
                name: '10月份',
                xAxis: '2023/10/1'
              },
              {
                xAxis: '2023/10/31'
              }
            ],
            [
              {
                name: '12月份',
                xAxis: '2023/12/1'
              },
              {
                xAxis: '2023/12/31'
              }
            ],
            [
              {
                name: '2月份',
                xAxis: '2024/2/1'
              },
              {
                xAxis: '2024/2/29'
              }
            ],
          ]
        }
      }
    ]
  });
}

onMounted(() => {
  getChart();
})

</script>

<template>
  <div class="weight">
    <div class="info">
      <div class="info-box">
        今日体重：{{ todayWeight }} 斤
      </div>
      <div class="info-box">
        计划体重：{{ planWeight }} 斤
      </div>
      <div class="info-box">
        {{ (differWeight > 0 ? '落后 ' : '超前 ') + Math.abs(differWeight) + ' 斤' }}
      </div>
      <div class="info-box">
        {{ (differDate > 0 ? '落后 ' : '超前 ') + Math.abs(differDate) + ' 天' }}
      </div>
      <div class="info-box">
        可用 {{ money }} 元
      </div>
      <div class="info-box">
        待突破： {{ breakLine }} 斤
      </div>
    </div>
    <div id="echart-dom"></div>
  </div>
</template>

<style scoped lang="scss">
.weight {
  width: 100%;
  height: calc(100vh - 50px);
  background-color: rgb(255, 240, 212);

  .info {
    height: 60px;
    display: flex;
    margin: 0 5%;
    justify-content: space-around;

    .info-box {
      // width: 240px;
      margin: 0 10px;
      line-height: 60px;
      font-size: 20px;
    }
  }

  #echart-dom {
    width: 90%;
    // padding: 50px 0;
    margin: 0 5%;
    height: calc(100% - 60px);
    background-color: white;
  }
}
</style>
