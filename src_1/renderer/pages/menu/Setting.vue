<template>
    <div class="">
      <div class="tebox">
        <Row :gutter="40" class-name="def-row"	>
          <Col v-for="(item,index) in settingList" :value="item.id" :key="index" 
            span="8" class-name="def-col" @click="getData(item)">
              <div  @click="getData(item)" class="col-box" :style="{'backgroundColor':item.color}">
                <Icon :type="item.icon"></Icon>
                {{item.label}}管理
              </div>
          </Col>
        </Row>
      </div>

      <Modal v-model="modalShow" :mask-closable="true" :title="modalTitle" @on-cancel="modalShowClose" width="80%">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{modalTitle}}管理</span>
          </p>
          <div style="min-height:160px;overflow:hidden">
            <Table border stripe :columns="currentTableColumn" :data="dataList" :loading="tableLoading"></Table>
            <Page :total="dataListTotalCount" :current="searchParams.pageIndex"
                  :page-size="searchParams.pageSize" @on-change="getDataList" @on-page-size-change="getDataListOnPageChange"
                  :page-size-opts="[10,20,30,40,50]" show-total
                  show-sizer show-elevator transfer></Page>
          </div>
          <div slot="footer">
              <Button  @click="modalShowClose">关闭</Button>
              <Button type="primary" @click="showAddModal('add')">添加</Button>
          </div>
      </Modal>

      <!-- 添加届次Modal -->
      <Modal v-model="addModalForm.period" :mask-closable="true" :title="addModalTitle" @on-cancel="addModalFormClose('period')">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{addModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <Form ref="periodFormVali" :rules="periodRuleValidate" :model="addModalParams" label-position="right" inline
                  :label-width="120">
                <FormItem label="党代表类型" prop="period_type">
                  <Select v-model="addModalParams.period_type" style="width:300px;">
                      <Option value="省">省</Option>
                      <Option value="市">市</Option>
                      <Option value="县">县</Option>
                      <Option value="乡">乡</Option>
                  </Select>
                </FormItem>
                <FormItem label="届次名称" prop="period_name">
                    <Input v-model="addModalParams.period_name" placeholder="必填" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="简介" prop="remark">
                    <Input v-model="addModalParams.remark" type="textarea" :rows="4" placeholder="非必填，长度 200 以内"
                            style="width: 300px"></Input>
                </FormItem>
            </Form>
          </div>
          <div slot="footer">
              <Button  @click="addModalFormClose('period')">关闭</Button>
              <Button type="primary" @click="addPeriodConfirm">保存</Button>
          </div>
      </Modal>


      <!-- 添加党工委Modal -->
      <Modal v-model="addModalForm.party" :mask-closable="true" :title="addModalTitle" @on-cancel="addModalFormClose('party')">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{addModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <Form ref="partyFormVali" :rules="partyRuleValidate" :model="addModalParams" label-position="right" inline
                  :label-width="120">
                <FormItem label="上级党工委" prop="parent_id">
                  <Select v-model="addModalParams.parent_id" style="width:300px;">
                      <Option value="0">做为本系统中一级党工委</Option>
                      <Option v-for="(item,index) in dataList" :value="item.id" :key="index">{{item|filter_item_party_name}}
                      </Option>
                  </Select>
                </FormItem>
                <FormItem label="名称" prop="party_name">
                    <Input v-model="addModalParams.party_name" placeholder="必填" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="简称" prop="party_small_name">
                    <Input v-model="addModalParams.party_small_name" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="简介" prop="party_desc">
                    <Input v-model="addModalParams.party_desc" type="textarea" :rows="4"   placeholder="请输入简介"    style="width: 300px"></Input>
                </FormItem>
            </Form>
          </div>
          <div slot="footer">
              <Button  @click="addModalFormClose('party')">关闭</Button>
              <Button type="primary" @click="addPartyConfirm">保存</Button>
          </div>
      </Modal>



      <!-- 查看信息通用Modal -->
      <Modal v-model="viewModalForm" :mask-closable="true" :title="viewModalTitle" @on-cancel="viewModalFormClose()">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{viewModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <render-view :rdata="viewDetailData|render_detail(viewModalKeys)" ></render-view>
          </div>
          <div slot="footer">
              <Button  @click="viewModalFormClose()">关闭</Button>
          </div>
      </Modal>
      
      <!-- 通用删除数据 -->
      <Modal v-model="delModalShow" width="370">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>删除确认</span>
          </p>
          <div style="line-height: 36px;font-size:18px">
              <p>您将永久删除内容 <strong>{{delModalData.name}}</strong> ，本操作<strong>无法恢复</strong>。</p>
              <p>请在输入框中输入<strong>{{delModalData.name}}</strong>以确认删除。</p>
              <Input v-model="delModalData.input"
                      style="width: 250px"></Input>
          </div>
          <div slot="footer">
              <Button type="error" size="large" long @click="delConfrim" :loading="modalBtnLoading"
                      :disabled="delModalData.name !== delModalData.input">删除
              </Button>
          </div>
      </Modal>

    </div>


    
</template>
<script>

  const demoData = require('../../utils/baseData').default 
  const filters = require('../../utils/filters').default 
  import RenderView from '../../components/RenderView.vue'
  export default {
    components: { RenderView  },

    data () {

      const tableColumn = {
    party : [
{title: '序号',key: 'id',align: 'center',maxWidth: 80},
{title: '简称',key: 'party_small_name',align: 'left',minWidth: 200,
render: (h, params) => {let res = filters.filter_party_name(params.row);return h('span', res);}},
{title: '全称',key: 'party_name',align: 'center',minWidth: 200},
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
          //   on: {
          //     click: () => {
          //       this.direct(params.row)
          //     }
          //   }
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
        //   on: {
        //     click: () => {
        //       this.edit(params.row)
        //     }
        //   }
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
          //   on: {
          //     click: () => {
          //       this.del(params.row)
          //     }
          //   }
        })
      ])
    }
  }
],
period : [
  {
      title: '序号',
      key: 'id',
      align: 'center',
      minWidth: 200
  },
  {
    title: '类型',
    key: 'period_type',
    align: 'center',
    minWidth: 200,
    
  },
  {
      title: '名称',
      key: 'period_name',
      align: 'center',
      minWidth: 200
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
            on: {click: () => this.showViewModal({id:params.row.id,data:params.row,keys:{period_name : '届次名称', period_type : '党代表类型' , remark : '简介' }})}
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
          //   on: {
          //     click: () => {
          //       this.edit(params.row)
          //     }
          //   }
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
                this.del({name : params.row.period_type + params.row.period_name ,id:params.row.id,input:""},'period')
              }
            }
          })
        ])
      }
    }
],
  }
      return {
        tableLoading: false,
        settingList : [],
        modalShow : false,
        modalTitle : "",
        tableColumn : tableColumn,
        // partyList : [] , 
        currentTableColumn : [] ,// 当前显示的列信息
        currentItem : null, //当前编辑的信息
        currentDbSQL : '' , //当前要查询的信息
        dataList : [], //当前要展示的信息
        dataListTotalCount : 0 , //信息总数
        searchParams : {
          pageIndex: 1,
          pageSize: 10
        },
        addModalForm:{
          period : false,

        },
        modalBtnLoading : false,

        //查看信息
        viewModalForm: false, //显示状态
        viewModalTitle : "查看详情", //标题
        viewModalKeys : {}, //键值对
        viewDetailData : {} , //详细内容

        //删除数据
        delModalShow : false ,// 删除modal显示状态
        delModalData : {} , // 待删除的数据
        delDbName : "" ,//待删除的数据表


        addModalTitle : "",
        addModalParams : {},
        periodRuleValidate: {
          period_name: [
            { required: true, message: '请输入名称' },
            { max: 100, message: '长度 100 以内' }
          ],
          remark: [
            { max: 200, message: '备注 长度 200 以内' }
          ]
        },
        partyRuleValidate: {
          parent_id: [
            { required: true, message: '请选择上级党工委' }
          ],
          party_name: [
            { required: true, message: '请输入名称' },
            { max: 100, message: '长度 100 以内' }
          ],
          party_desc: [
            { max: 200, message: '备注 长度 200 以内' }
          ]
        },
      }
    },

    created () {
      //检查是否有权限查看本页面，非管理员用户不可查看和操作本页面
      console.log(this.$store)
      this.settingList = demoData.settingItems
    },

    methods : {
      
      //添加按钮
      showAddModal(method){
        this.addModalForm[this.currentItem.db_name] = true
        const titlePre = {
          'add' : '添加',
          'edit' : '修改',
          'view' : '查看',
        }
        this.addModalTitle = titlePre[method] + this.currentItem.label
      },
      
      //关闭列表modal
      modalShowClose(){
        this.modalTitle = ""
        this.currentTableColumn = [] // 当前显示的列信息
        this.currentItem = null //当前编辑的信息
        this.currentDbSQL = ''  //当前要查询的信息
        this.dataList = [], //当前要展示的信息
        this.dataListTotalCount = 0  //信息总数
        this.searchParams = {
          pageIndex: 1,
          pageSize: 10
        }
        this.modalShow = false;
      },
      //关闭表单Modal
      addModalFormClose(db){
        this.addModalTitle = ''
        this.addModalParams ={}
        this.addModalForm[this.currentItem.db_name] = false
      },

      //addModal 保存
      addPeriodConfirm(){
        this.$refs.periodFormVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const addModalParams = this.addModalParams
          // console.log(addModalParams)
          // return false;
          // 检测名称是否重复
          const SQL = `SELECT COUNT(id) AS totalCount from '${this.currentItem.db_name}' WHERE period_name = '${addModalParams.period_name}' and period_type='${addModalParams.period_type}'`
          this.$db.get(SQL, (err, res) => {
            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '搜索失败',
                desc: err
              })
            } else {
              if (res.totalCount) {
                this.$Message.warning({
                  content: '请勿重复添加'
                })
                this.modalBtnLoading = false
              } else {

      
                const SQL = `INSERT INTO '${this.currentItem.db_name}' (period_name,period_small_name,period_type,start_time,end_time,remark,create_time,update_time)
            VALUES (
              '${addModalParams.period_name}',
              '${addModalParams.period_small_name || ''}',
              '${addModalParams.period_type}',
              '',
              '',
              '${addModalParams.remark || ''}',
              '${Date.now()}',
              '')`
                  this.$logger(SQL)
                  this.$db.run(SQL, err => {
                    if (err) {
                      this.$logger(err)
                      this.$Notice.error({
                        title: '新增失败',
                        desc: err
                      })
                    } else {
                      this.$Message.success({
                        content: '新增成功'
                      })
                      this.getDataList(1)
                    }
                    this.addModalTitle = ''
                    this.addModalParams ={}
                    this.addModalForm[this.currentItem.db_name] = false
                  })
                }
              }
            })
          }
        })
      },


      //addModal 保存党工委信息
      addPartyConfirm(){
        this.$refs.partyFormVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const addModalParams = this.addModalParams
          // 检测名称是否重复
          const SQL = `SELECT COUNT(id) AS totalCount from '${this.currentItem.db_name}' WHERE party_name = '${addModalParams.party_name}'`
          
          this.$db.get(SQL, (err, res) => {
              // 检测名称是否重复

            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '数据库连接失败，请联系管理员！',
                desc: err
              })
            } else {
              if (res.totalCount) {
                this.$Message.warning({
                  content: '请勿重复添加'
                })
                this.modalBtnLoading = false
              } else {
                //检查父类的等级
                const PSQL = `SELECT party_level from '${this.currentItem.db_name}' WHERE id = '${addModalParams.parent_id}'`
                this.$db.get(PSQL, (err, res) => {
                  console.log(res)
                  if (err) {
                    this.$logger(err)
                    this.$Notice.error({
                      title: '数据库连接失败，请联系管理员！',
                      desc: err
                    })
                  } else {
                    let level = 1;
                    if (res&&res.party_level) {
                      level = res.party_level + 1;
                    }
                    const SQL = `INSERT INTO '${this.currentItem.db_name}' (parent_id,party_name,party_small_name,party_desc,party_level,create_time,update_time)
                    VALUES (
                      '${addModalParams.parent_id}',
                      '${addModalParams.party_name}',
                      '${addModalParams.party_small_name}',
                      '${addModalParams.party_desc | ''}',
                      '${level}',
                      '${Date.now()}',
                      '')`
                    this.$logger(SQL)
                    let errMsg = "操作成功"
                    this.$db.run(SQL, err => {
                      if (err) {
                        errMsg = err;
                        this.$logger(err)
                        this.$Notice.error({
                          title: '新增失败',
                          desc: err
                        })
                      } else {
                        this.$Message.success({
                          content: '新增成功'
                        })
                        this.getDataList(1)
                      }
                      this.addModalTitle = ''
                      this.addModalParams ={}
                      this.addModalForm[this.currentItem.db_name] = false
                    })
                    //导步将数据写到日志表中去
                  }
                })
                //查父LEVEL结束
              }
            }
          })
          // 检测名称是否重复结束
        }
      })

    },
    getData : function(item){
        if(item.db_name) {
          this.dataList = [],
          this.currentItem = item;
          this.currentTableColumn = this.tableColumn[item.db_name]
          
          this.getDataList();
          this.modalShow = true ; 
          this.modalTitle = item.label
        }
      },
      // pageSize改变
      getDataListOnPageChange (pageSize) {
        this.searchParams.pageSize = pageSize
        this.getDataList()
      },
      //获取信息
      getDataList(method){
        this.tableLoading = true
        if(typeof method === 'number') {
            this.searchParams.pageIndex = method
        }
        const pageSQL = ` LIMIT ${this.searchParams.pageSize} OFFSET ${(this.searchParams.pageIndex - 1) * this.searchParams.pageSize} `
        const ORDERSQL = `ORDER BY ` +  (this.currentItem.order ? this.currentItem.order : 'id desc');
        let currentDbSQL = `SELECT * from ${this.currentItem.db_name} ` + ORDERSQL + pageSQL;

        const countSQL = `SELECT COUNT(id) AS totalCount from ${this.currentItem.db_name} `;

        this.$logger(currentDbSQL)
        this.$db.all(currentDbSQL, (err, res) => {
          console.log(res)
          if (err) {
            this.$logger(err)
            this.$Notice.error({
              title: '搜索失败',
              desc: err
            })
          } else {
            if (!res.length && this.searchParams.pageIndex !== 1) {
              // 该页没数据，又不是第一页，就往上一页翻
              this.getDataList(this.searchParams.pageIndex - 1)
            } else {
              this.dataList = res
            }
          }
        })

        this.$logger(countSQL);
          this.$db.get(countSQL, (err, res) => {
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: '搜索失败',
                desc: err,
              });
            } else {
              this.dataListTotalCount = res.totalCount;
            }
          });
        this.tableLoading = false
    },

    showViewModal(data){
      this.viewModalTitle = "查看详情";
      this.viewModalForm = true;
      this.viewModalKeys = data.keys
      //获取本条信息详细内容
      this.viewDetailData = data.data;

    },
    //关闭通用查看Modal
    viewModalFormClose(){
      this.viewModalTitle = '查看详情'
      this.viewModalKeys ={}
      this.viewModalForm = false
      this.viewDetailData = {}
    },
    //删除数据
    del(del_data,db_name){
        this.delModalData = del_data;
        this.delModalShow = true;
        this.delDbName = db_name;
    },
    //  删除确认
    delConfrim() {
      if(this.delDbName == "admin" && this.delModalData.id == 1){
        this.$Notice.error({
          title: '您无权删除管理员账号！'
        });
        return false;
      }
      this.$db.serialize(() => {
        this.$db.run('BEGIN');
        // 删除
        const deleteDetailSQL = `DELETE FROM ${this.delDbName} WHERE id = ${this.delModalData.id}`;
        this.$logger(deleteDetailSQL);
        this.$db.run(deleteDetailSQL, err => {
          if (err) {
            this.$logger(err);
            this.$db.run('ROLLBACK');
            this.$Notice.error({
              title: '删除失败',
              desc: err,
            });
          }
        });
        this.$db.run('COMMIT');
        this.delModalShow = false;
        this.delModalData = {};
        this.delDbName = "";
        this.$Message.success({
          content: '删除成功',
        });
        this.$adminLog.write({
          text : deleteDetailSQL,
          status : 1,
          admin_id :1
        })
        this.getDataList();
      });
    },

  },

  filters :{
    //党工委信息格式化
    filter_item_party_name(item){
      return filters.filter_party_name(item);
    },
    //格式化显示结果
      render_detail(data,keys){
        let res = [];
        Object.keys(keys).forEach(function(k){
          let kv = keys[k];
          let title = keys[k];
          let value = data[k];
          if(kv.title){
            title = kv.title;
            value = kv.values[data[k]];
          }
          res.push({
            key : k,
            title : title,
            value : value
          })
        })
        return  res;
      }
  }
}
</script>
<style lang="less">
  .tebox{
    padding : 40px 10%
  }
  .def-col{
    margin-bottom: 40px;
    font-size: 22px;
    line-height: 150px;
    cursor: pointer;
    color: #fff;
    :hover{
      font-size: 23px;
      color: #444;
    }
    .col-box{
      // padding : 50px 0px;
      text-align: center;
      border-radius: 8px;
      
    }
  }
</style>
