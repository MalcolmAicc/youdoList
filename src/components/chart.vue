<template>

  <div id="lottie_box" style="width:300px,height:300px" class="animation" @mouseover="showOrNotShow" v-show="animationShow">
  </div>

  <div id="container">

  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch ,getCurrentInstance} from "vue";
import { Chart } from "@antv/g2";
import * as anData from '@/components/chart.json'
import lottie from 'lottie-web'
import { reqGetUserInfo , reqGetListInfo } from '@/api/index.js'
import dayjs from 'dayjs' ;

const ins = getCurrentInstance();
const bus = ins.appContext.config.globalProperties.$bus
// task列表
let listInfo= ref({
    Ready:[],
    Progress:[],
    Review:[],
    Done:[],
})

// getData初始化总任务长度
let allLength = ref(0)
// getData初始化完成任务的长度
let doneLength = ref(0)

const datas = ref([
  { item: "剩余", count: 0, percent: 0 },
  { item: "已完成", count: '真棒全完成了', percent: 1 },
]);

let data = datas.value

const props = defineProps(['doneLength'])

// 接受添加任务后的总任务数
bus.on('changecount',(value) => {
  // console.log(doneLength.value,value);
  allLength.value = value; //  接受最新的任务长度
  datas.value[0].count = allLength.value-doneLength.value
  datas.value[0].percent = (allLength.value-doneLength.value)/allLength.value

  datas.value[1].count = doneLength.value
  datas.value[1].percent = doneLength.value/allLength.value
  data = datas.value
  console.log(data);
  changechart()
})

// 接收删除任务
bus.on('remove',(value) => {
  console.log(value);
  if (value === 'Done') {
    doneLength.value -= 1
    allLength.value -= 1
    datas.value[0].count = allLength.value-doneLength.value
    datas.value[0].percent = (allLength.value-doneLength.value)/allLength.value
    datas.value[1].count = doneLength.value
    datas.value[1].percent = doneLength.value/allLength.value
    changechart();
    
  }else{
    allLength.value -= 1
    datas.value[0].count = allLength.value-doneLength.value
    datas.value[0].percent = (allLength.value-doneLength.value)/allLength.value
    datas.value[1].count = doneLength.value
    datas.value[1].percent = doneLength.value/allLength.value
    data = datas.value
    console.log(data);
    changechart()
  }
})

// 监听完成任务总数
watch(props,(props) => {
  doneLength.value = props.doneLength
  // console.log(doneLength.value,props.allListLength)
  datas.value[0].count = allLength.value-doneLength.value
  datas.value[0].percent = (allLength.value-doneLength.value)/allLength.value

  datas.value[1].count = doneLength.value
  datas.value[1].percent = doneLength.value/allLength.value
  
  changechart();
})

const getData = async function () {
    let result = await reqGetUserInfo();
    // userInfo.value = result.data;
    // userInfo.value.user_pic = userInfo.value.user_pic === "" ? 'http://127.0.0.1:3007/upload/piulianggaigai.jpg' : result.data.user_pic;
    
    let list = await reqGetListInfo({
        id:result.data.user_id,
        time:dayjs().format('MMM DD YYYY ddd')
    });
    // 将任务列表分组
    list.data.forEach((item) => {
        item.tag = item.tag !== '' ? JSON.parse(item.tag) : ''
        switch(item.area){
            case 'Ready':
                // item.date = item.date.split(' ');
                listInfo.value.Ready.push(item);
                break;
            case 'Done':
                // item.date = item.date.split(' ');
                listInfo.value.Done.push(item)
                break;
            case 'Progress':
                // item.date = item.date.split(' ');
                listInfo.value.Progress.push(item)
                break;
            case 'Review':
                // item.date = item.date.split(' ');
                listInfo.value.Review.push(item)
                break;
            default:
                alert('任务完成了')
        }
    })
    doneLength.value =  listInfo.value.Done.length // 初始化完成任务长度
    allLength.value = list.data.length // 初始化总任务长度
    datas.value[0].count = allLength.value-listInfo.value.Done.length
    datas.value[0].percent = (allLength.value-listInfo.value.Done.length)/allLength.value
    datas.value[1].count = listInfo.value.Done.length
    datas.value[1].percent = listInfo.value.Done.length/allLength.value
}

let charShow = ref(false)
let animationShow = ref(true);

let animation = {};

let changechart; //闭包刷新图标
const showOrNotShow = () => {
  animationShow.value = false
  charShow.value = true;
  changechart = canvas(data)
}

const canvas = function (data) {

  const container = document.getElementById("container");

  const chart = new Chart({
      container: document.getElementById("container"),
      autoFit: true,
      height: 300,
  });
  // 新建一个 view 用来单独渲染Annotation
  chart.clear()
  const innerView = chart.createView();
  chart.coordinate("theta", {
    radius: 0.9,
    innerRadius: 0.8,
  });

  chart.changeVisible(charShow.value)

  chart.data(data);

  chart.scale("percent", {
    formatter: (val) => {
      val = val * 100 + "%";
      return val;
    },
  });

  chart.tooltip(false);

  // 声明需要进行自定义图例字段： 'item'
  chart.legend(false);

  chart
    .interval()
    .adjust("stack")
    .position("percent")
    .color("item")
    .style({
      fillOpacity: 1,
    })
    .state({
      active: {
        style: (element) => {
          const shape = element.shape;
          return {
            lineWidth: 10,
            stroke: shape.attr("fill"),
            strokeOpacity: shape.attr("fillOpacity"),
          };
        },
      },
    });

  // 移除图例点击过滤交互
  chart.removeInteraction("legend-filter");
  chart.interaction("element-active");

  chart.annotation().html({
    position: ['50%', '50%'],
    html: () => {
      return `<div id="one" style="transform:translate(-50%,-50%)"></div>`;
    },
    
  });
  chart.annotation().clear(true);
  chart.render();

  // 监听 element 上状态的变化来动态更新 Annotation 信息
  chart.on("element:statechange", (ev) => {
    const { state, stateStatus, element } = ev.gEvent.originalEvent;

    // 本示例只需要监听 active 的状态变化
    if (state === "active") {
      const data = element.getData();
      console.log(state, stateStatus, element,data.item)
      if (stateStatus) {
        // 更新 Annotation
        updateAnnotation(data);
      } else {
        // 隐藏 Annotation
        clearAnnotation();
      }
    }
  });

  // chart.changeData(data)
  // 绘制 annotation
  let lastItem;
  function updateAnnotation(data) {
    chart.annotation().clear(true);
    if (data.item !== lastItem) {
      innerView.annotation().clear(true);
      innerView
        .annotation()
        .text({
          position: ["50%", "50%"],
          content: data.item,
          style: {
            fontSize: 16,
            fill: "#8c8c8c",
            textAlign: "center",
          },
          offsetY: -20,
          animate:true,
          animation: {
            // 配置图表第一次加载时的入场动画
            enter: {
              animation: 'wave-in', // 动画效果
              duration: 5000,  // 动画执行时间
            },
          }
        })
        .text({
          position: ["53%", "50%"],
          content: data.count,
          style: {
            fontSize: 28,
            fill: "#8c8c8c",
            textAlign: "center",
          },
          offsetX: -10,
          offsetY: 20,
        })
      
      innerView.render(true);
      lastItem = data.item;
      // innerView.annotation().clear(true);
    }
  }

  // 清空 annotation
  function clearAnnotation() {
    innerView.annotation().clear(true);
    innerView.annotation().html({
        position: ['50%', '50%'],
        html: () => {
          return `<div id="one" style="transform:translate(-50%,-50%)"></div>`;
        },
        animate:true,
        animateOption:{
           appear: {
              animation: 'fade-in', // 动画效果
              duration: 2000,  // 动画执行时间
            },
        }
      });
    nextTick(() => {
      let animation = {};
      animation = lottie.loadAnimation({
        container: document.getElementById("one"), // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData:anData.default // the path to the animation json
      });
    })
    
    innerView.render(true);
    lastItem = null;
  }

  const changeDatas = function(){
    chart.changeData(data)
  }

  return changeDatas;
};

onMounted(() => {
    changechart = canvas(data);
    animation = lottie.loadAnimation({
      container: document.getElementById("lottie_box"), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData:anData.default // the path to the animation json
    });
    getData()
});
</script>

<style>
  #lottie_box{
    /* width: 300px; */
    height: 300px;
  }
</style>