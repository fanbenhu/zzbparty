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
        <Col span="18" class="cvalue">{{item.value}}</Col>
    </Row>

    </div>
</template>
<script>

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
        
    }
}
</script>
