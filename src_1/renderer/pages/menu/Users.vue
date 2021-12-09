<template>
    <div>
        <Form :label-width="90" inline @keydown.native.enter.prevent="getDataList('search')" >
            <FormItem label="届次">
                <Select v-model="search.period_id" style="width:200px;">
                    <Option v-for="(item,index) in periodList" :value="item.id" :key="index">{{item.period_name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="类型">
                <Select v-model="search.type_id" style="width:200px;">
                    <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{item.type_name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="姓名">
                <Input v-model="search.name" style="width: 203px" clearable></Input>
            </FormItem>
            <br>
            <FormItem :label-width="50">
                <Button type="primary" icon="ios-search" @click="getDataList('search')">搜索</Button>
                <Button style="margin-left:5px;" type="primary" @click="openInsertModal"
                        title="批量导入">批量导入</Button>
                <Button style="margin-left:5px;" type="primary" @click="downloadExcel"
                        title="导出" :loading="downloadExcelLoading">导出结果</Button>
            </FormItem>
        </Form>
        <Table border stripe :columns="dataList_table_column" :data="dataList" :loading="tableLoading"
               @on-row-dblclick="tableRowDblClick"></Table>
        <Page :total="dataListTotalCount" :current="searchParams.pageIndex"
              :page-size="searchParams.pageSize" @on-change="getDataList" @on-page-size-change="getDataListOnPageChange"
              :page-size-opts="[10,20,30,40,50]" show-total
              show-sizer show-elevator transfer></Page>

              
      <!-- 上传MODAL -->
      <Modal v-model="insertModalShow" :mask-closable="true" title="批量导入数据" @on-cancel="insertModalShowClose"  width="50%">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>批量导入数据</span>
          </p>
          <div style="min-height:160px;overflow:hidden">
            <div class="stepbox">
              <Steps :current="0">
                  <Step title="数据模板" content=""></Step>
                  <Step title="导入数据" content=""></Step>
                  <Step title="导入完成" content=""></Step>
              </Steps>
            </div>
            <div class="stepcont">
              <div class="step0">
                <Button type="primary" :loading="renderExcelLoading" @click="renderExcelModel">生成数据模板</Button>
                <Button type="primary" :disabled="renderExcelLoading">下载模板</Button>
              </div>
            </div>

          </div>
          
      </Modal>
        
    </div>
</template>
<script>
import util from '../../utils/util'
import download from '../../utils/download'
import demoData from '../../utils/baseData'
import packageJson from '../../../../package.json';


export default {
  data () {
    let typeList = demoData.typeList
    let statusList  = demoData.statusList
    return {
      // loading
      downloadExcelLoading: false,
      modalBtnLoading: false,
      tableLoading: false,
      insertModalShow : false,
      renderExcelLoading : false,
      currentVersion: packageJson.version, //当前版本号
      //模拟届次数据
      periodList: [],
      typeList: [],
      statusList : [],
      eduList : [],
      // ----特殊枚举
      sortList: [],
      // ----常用
      search: {
        name: '',
        period_id: null,
        sort: 'DESC',
        type_id: null,
        pageIndex: 1,
        pageSize: 10
      },
      searchParams: {},
      dataList: [],
      dataListTotalCount: 0,
      dataList_table_column: [
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          minWidth: 200
        },
        {
          title: '届次',
          key: 'period_id',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            console.log(this.periodList)
            let renderText = this.periodList.filter(e=>{
              if(e.id == params.row.period_id) {
                return e
              }
            })
            return h('span', renderText[0].period_name);
          },
        },
        {
          title: '类型',
          key: 'type_id',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let renderText = typeList.filter(e=>{
              if(e.id == params.row.type_id) {
                return e
              }
            })
            return h('span', renderText[0].type_name + '代表');
          },
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            let renderText = statusList.filter(e=>{
              if(e.value == params.row.status) {
                return e
              }
            })
            return h('span', renderText[0].label);
          },
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-paper-outline'
                },
                attrs: {
                  title: '详情'
                },
                on: {
                  click: () => {
                    this.direct(params.row)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  icon: 'md-create'
                },
                attrs: {
                  title: '修改'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'md-chatbubbles'
                },
                attrs: {
                  title: '议题诉求'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-school-outline'
                },
                attrs: {
                  title: '培训记录'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash-outline'
                },
                attrs: {
                  title: '删除'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click: () => {
                    this.del(params.row)
                  }
                }
              })
            ])
          }
        }
      ],
      
      downloadExcelSQL: ''
    }
  },
  created () {
    this.getPeriodList()
    this.typeList = demoData.typeList
    this.statusList = demoData.statusList
    this.eduList = demoData.eduList
    
    this.getDataList('search')
  },
  computed: {
    modalTitle () {
      return this.modalParams.id ? '修改' : '创建'
    }
  },
  methods: {
    //生成数据模板
    renderExcelModel(){
      this.renderExcelLoading = true;
      const SQL = `select * from auto_fileds where table_name='USER' or table_name='user' order by id asc`;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '查询失败',
            desc: err
          })
        } else {
          console.log(res)
          let titleLine = [];
          let keyLine = [];
          res.forEach(e => {
            keyLine.push(e.filed_name);
          });
          res.forEach(e => {
            titleLine.push(e.filed_des);
          });
          
          let outData = [];

          outData.push(titleLine); //第一行
          // outData.push(keyLine);  //第二行
          const name = '信息模板';
          
          console.log(outData)
          
  download.excel(name, [
    {
      name,
      outData,
    },
  ]).then(arg => {
    console.log(arg)
    this.renderExcelLoading = false;
    if (arg === 'completed') {
      this.$Message.success({
        content: '导出成功',
      });
    } else {
      this.$Message.warning({
        content: '导出取消',
      });
    }
  }).catch(err => {
    console.log('err')
    this.renderExcelLoading = false;
    this.$Notice.error({
      title: '导出失败',
      desc: err,
    });
  });

console.log('arg')
        }
      })
    },
    getPeriodList(){
      let periodSQL = 'SELECT * from PERIOD ORDER BY id desc';
      this.$logger(periodSQL)
      this.$db.all(periodSQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '查询失败',
            desc: err
          })
        } else {
          if (!res.length && this.searchParams.pageIndex !== 1) {
          } else {
            this.periodList = res
          }
        }
      })
    },
    // 搜索
    getDataList (method) {

      this.tableLoading = true
      if (method === 'search') {
        this.searchParams = JSON.parse(JSON.stringify(this.search))
      }
      if (typeof method === 'number') {
        this.searchParams.pageIndex = method
      }
      const searchParams = this.searchParams
      let whereSQL = `WHERE name LIKE '%${searchParams.name}%' `
      searchParams.period_id !== null ? whereSQL += `AND period_id = ${searchParams.period_id} ` : null
      searchParams.type_id !== null ? whereSQL += `AND type_id = ${searchParams.type_id} ` : null

      const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageIndex - 1) * searchParams.pageSize} `
      const orderSQL = `ORDER BY id ${searchParams.sort} `

      // 导出sql
      this.downloadExcelSQL = 'SELECT * from USER ' + whereSQL + orderSQL
      const rowSQL = this.downloadExcelSQL + pageSQL
      const countSQL = 'SELECT COUNT(id) AS totalCount from USER ' + whereSQL
 
      this.$logger(rowSQL)
      this.$db.all(rowSQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '搜索失败',
            desc: err
          })
        } else {
          if (!res.length && searchParams.pageIndex !== 1) {
            // 该页没数据，又不是第一页，就往上一页翻
            this.getDataList(searchParams.pageIndex - 1)
          } else {
            this.dataList = res
          }
        }
        this.tableLoading = false
      })
      this.$logger(countSQL)
      this.$db.get(countSQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '搜索失败',
            desc: err
          })
        } else {
          this.dataListTotalCount = res.totalCount
        }
      })
    },
    // pageSize改变
    getDataListOnPageChange (pageSize) {
      this.search.pageSize = pageSize
      this.getDataList('search')
    },
    // 双击表格某行
    tableRowDblClick (row) {
      this.direct(row)
    },
    
    // 跳转
    direct (row) {
      this.$router.push({
        path: '/detailList',
        query: {
          goods_id: row.id
        }
      })
    },
    
    // 导出表格
    downloadExcel () {
      this.downloadExcelLoading = true
      this.$db.all(this.downloadExcelSQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '搜索失败',
            desc: err
          })
        } else {
          const data = [
            [ '品名', '数量', '标准进价', '标准售价', '总金额', '备注', '创建时间', '修改时间' ]
          ]
          for (const item of res) {
            data.push([ item.name, item.total_count, item.standard_buy_unit_price, item.standard_sell_unit_price, item.total_amount, item.remark, util.dateFilter(item.create_time), util.dateFilter(item.update_time) ])
          }
          const name = '物品管理'
          download.excel(name, [
            {
              name,
              data
            }
          ]).then(arg => {
            this.downloadExcelLoading = false
            if (arg === 'completed') {
              this.$Message.success({
                content: '导出成功'
              })
            } else {
              this.$Message.warning({
                content: '导出取消'
              })
            }
          }).catch(err => {
            this.downloadExcelLoading = false
            this.$Notice.error({
              title: '导出失败',
              desc: err
            })
          })
        }
      })
    },

    openInsertModal(){
      
      this.insertModalShow = true;
    },
    insertModalShowClose(){
      this.insertModalShow = false;
    }
  }
  
}
</script>
<style lang="less">
.stepbox{
  margin: 0 auto;
  text-align: center;
}
.stepcont{
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
