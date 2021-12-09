<!--
 * @Author: Firen
 * @Date: 2021-12-09 22:31:26
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-10 03:07:43
 * @Description: 
-->
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
    <div style="overflow-y:scroll">
        <Row class="crow" type="flex">
            <Col span="12" class="ctitle" v-for="(item,k) in rdata" :key="k">
                <Row class="crow" type="flex">
                    <Col span="6" class="ctitle">{{item.title}}</Col>
                    <Col span="18" class="cvalue">{{item|renderValue}}</Col>
                </Row>
            </Col>
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
            
            
            let res = item.value;
            if(res == "undefined" || res == 'null' || res =="NaN"){
                return '';
            }

            if(item.istime){
                res = util.dateFilter(item.value)
            }
            return res;
        }
    }
}
</script>
