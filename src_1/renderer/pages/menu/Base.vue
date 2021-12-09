
<template>
  <div>
    <Button type="primary" @click="test">Primary</Button>
    <v-chart :options="polar"/>
  </div>
  
</template>

<script>
import echarts from 'echarts'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
// require('echarts/lib/chart/line')


export default {
  components: {
    'v-chart': ECharts
  },
  methods:{
    test(){
      console.log("a");
      this.$db.serialize(() => {
        this.$db.run('BEGIN');
        //开始执行
        let TABLE_NAME = "USER"
        let adSql = `alter table ${TABLE_NAME} add column age INTEGER`;
        console.log(adSql)
        this.$db.run(adSql, (err, res) => {
          console.log(res);
          console.log(err)
        });
        //提交修改
        this.$db.run('COMMIT');
        this.delModalShow = false;
        this.$Message.success({
          content: '操作成功',
        });

      });
    },

    
  },
  data () {
    let data = []

    for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
    }

    return {
      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }
    }
  },
  
}
</script>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 s
 */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
