<style lang="less">
    @import "../assets/less/global.less";
    .crow{
        line-height: 40px;
        // border-bottom: 1px solid #eee;
    }
    .ctitle{
        text-align: center;
    }
    .cvalue{
        text-align: left;
    }
</style>

<template>
    <div>
    <Row class="crow" type="flex" v-for="(item,k) in rdata" :key="k">
        <Col span="6" class="ctitle">{{item.title}}</Col>
        <Col span="18" class="cvalue">{{item|renderValue}}</Col>
    </Row>

    </div>
</template>
<script>
import util from '../utils/util'

export default {
    data () {
        return {
        
        }
    },
    props:{
        rdata:{
            type:Array,
            default : []
        }
    },
    methods: {
        
    },
    created () {
        
    },
    filters : {
        renderValue(item){
            if(item == "undefined" || item == 'null' || item =="NaN"){
                return '';
            }
            let res = item.value;
            if(item.istime){
                res = util.dateFilter(item.value)
            }
            return res;
        }
    }
}
</script>
