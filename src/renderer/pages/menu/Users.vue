<template>
    <div>
        <Form :label-width="80" inline @keydown.native.enter.prevent="getDataList('search')" >
            <FormItem label="姓名">
              <Input v-model="search.name" clearable></Input>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="search.status" >
                    <Option value="正常">正常</Option>
                    <Option value="停止">停止</Option>
                    <Option value="终止">终止</Option>
                </Select>
            </FormItem>
            <FormItem label="代表时间">
              <Row>
                <Col span="11">
                    <DatePicker type="date" placeholder="请选择开始代表时间" v-model="search.period_start"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <DatePicker type="date" placeholder="请选择结束代表时间" v-model="search.period_end"></DatePicker>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="代表类型">
                <CheckboxGroup v-model="search.checkbox">
                  <Checkbox label="is_province_deputy">省级</Checkbox>
                  <Checkbox label="is_city_deputy">市级</Checkbox>
                  <Checkbox label="is_county_deputy">县级</Checkbox>
                  <Checkbox label="is_township_deputy">乡级</Checkbox>
                </CheckboxGroup>
            </FormItem>

            
            <br>
            <FormItem :label-width="50">
                <Button type="primary" icon="ios-search" @click="getDataList('search')">搜索</Button>
                <Button style="margin-left:5px;" type="primary" @click="openInsertModal"
                        title="批量导入">批量导入</Button>
                <Button style="margin-left:5px;" type="primary" @click="openDownModal"
                        title="导出">导出结果</Button>
            </FormItem>
        </Form>
        <Table border stripe :columns="dataList_table_column" :data="dataList" :loading="tableLoading"
               @on-row-dblclick="tableRowDblClick" :row-class-name="rowClassName"></Table>
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
              <Steps :current="insertStepCurrent">
                  <Step title="数据模板" content=""></Step>
                  <Step title="导入数据" content=""></Step>
                  <Step :title="steptitle3" content=""></Step>
              </Steps>
            </div>
            <div class="stepcont">
              <div class="step0" v-if="insertStepCurrent==0">
                <Button type="primary" :loading="renderExcelLoading" @click="renderExcelModel">下载数据模板</Button>
              </div>

              <div class="step0" v-if="insertStepCurrent==1">
                <Upload
                    :before-upload="handleUpload"
                    action="//jk108.cn/posts/">
                    <Button icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
              </div>

              <div class="step0" v-if="insertStepCurrent==2">
                <p>总数据：{{insertTotalCount}} 条</p>
                <p>导入成功：{{insertSuccessCount}} 条</p>
                <p>导入失败：{{insertErrCount}} 条</p>
              </div>  
            </div>

          </div>
          <div slot="footer">
              <Button  @click="insertModalShowClose()">关闭</Button>
              <Button  :loading="renderExcelLoading" @click="insertModalNextClick">{{insertModalNextText}}</Button>
          </div>
      </Modal>


      <!-- 下载MODAL -->
      <Modal v-model="downModalShow" :mask-closable="true" title="请选择需要下载的字段" @on-cancel="downModalShowClose"  width="60%">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>请选择需要下载的字段</span>
          </p>
          <div class="outcheckbox" style="min-height:160px;overflow:hidden">
            <Form :model="downFormItem" :label-width="20">
                <FormItem label="">
                    <CheckboxGroup v-model="downFormItem.checkbox">
                          <Checkbox :label="filed.filed_name" v-for="(filed,i) in autoFileds" :key="i">{{filed.filed_des}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
          </div>
          <div slot="footer">
              <Button  @click="downModalShowClose()">关闭</Button>
              <Button  :loading="downloadExcelLoading" @click="downloadExcel">下载</Button>
          </div>
      </Modal>
      <!-- 个人信息下载MODAL -->
      <Modal v-model="downUserModalShow" :mask-closable="true" title="下载用户资料" @on-cancel="downUserModalShowClose"  width="60%">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>下载用户信息</span>
          </p>
          <div style="min-height:160px;overflow:hidden;display:flex;align-items:center;justify-content: center;">
            <Button style="margin-left:5px;" size="large" type="primary" @click="downUserExcel"
                    title="批量导入">下载Excel格式</Button>
            <Button size="large" style="margin-left:5px;" type="success" @click="downUserPdf"
                    title="导出">下载PDF格式</Button>
          </div>
          <div slot="footer">
              <Button  @click="downUserModalShowClose()">关闭</Button>
              <!-- <Button  :loading="downloadExcelLoading" @click="downloadUserExcel">下载</Button> -->
          </div>
      </Modal>

      <!-- 查看信息通用Modal -->
      <Modal v-model="viewModalForm" :mask-closable="true" :title="viewModalTitle" @on-cancel="viewModalFormClose()" width="80%" class-name="view-modal">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{viewModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <render-view-user :rdata="viewDetailData|render_detail(viewModalKeys)" ></render-view-user>
          </div>
          <div slot="footer">
              <Button  @click="viewModalFormClose()">关闭</Button>
          </div>
      </Modal>
      <!-- 查看信息通用单列Modal -->
      <Modal v-model="viewListModalForm" :mask-closable="true" :title="viewModalTitle" @on-cancel="viewModalFormClose()" class-name="view-modal">
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
      <!-- 信息列表Modal -->
      <Modal v-model="listModalShow" :mask-closable="true" :title="listModalTitle" @on-cancel="listModalShowClose" width="80%">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{listModalTitle}}</span>
          </p>
          <div style="min-height:160px;overflow:hidden">
            <Table border stripe :columns="currentListTableColumn" :data="currentListDataList" :loading="listTableLoading"></Table>
            <Page :total="listDataListTotalCount" :current="listSearchParams.pageIndex"
                  :page-size="listSearchParams.pageSize" @on-change="getListModalDataList" @on-page-size-change="getListModalDataListOnPageChange"
                  :page-size-opts="[10,20,30,40,50]" show-total
                  show-sizer show-elevator transfer></Page>
          </div>
          <div slot="footer">
              <Button  @click="listModalShowClose">关闭</Button>
              <Button type="primary" @click="showListAddModal('add')">添加</Button>
          </div>
      </Modal>

      <!-- 添加用户培训数据 -->
      <Modal v-model="addModalForm.user_training" :mask-closable="true" :title="addModalTitle" @on-cancel="addModalFormClose('user_training')">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{addModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <Form ref="userTrainingFormVali" :rules="userTrainingRuleValidate" :model="addModalParams" label-position="right"
                  :label-width="80">
                <FormItem label="培训主题" prop="train_title">
                    <Input v-model="addModalParams.train_title" placeholder="请填写培训主题"></Input>
                </FormItem>
                <FormItem label="培训时间" prop="train_time">
                    <DatePicker type="date" placeholder="请选择时间" v-model="addModalParams.train_time"></DatePicker>
                </FormItem>
                <FormItem label="培训内容" prop="train_desc">
                    <Input v-model="addModalParams.train_desc" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="请添加培训内容"></Input>
                </FormItem>
            </Form>
          </div>
          <div slot="footer">
              <Button  @click="addModalFormClose('user_training')">关闭</Button>
              <Button type="primary" @click="addUserTrainingConfirm">保存</Button>
          </div>
      </Modal>
      
      <!-- 添加党代表议题情况 -->
      <Modal v-model="addModalForm.user_issue" :mask-closable="true" :title="addModalTitle" @on-cancel="addModalFormClose('user_issue')">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{addModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <Form ref="userIssueFormVali" :rules="userIssueRuleValidate" :model="addModalParams" label-position="right"
                  :label-width="80">
                <FormItem label="议题主题" prop="issue_name">
                    <Input v-model="addModalParams.issue_name" placeholder="请填写培训主题"></Input>
                </FormItem>
                <FormItem label="详细内容" prop="issue_content">
                    <Input v-model="addModalParams.issue_content" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="详细内容"></Input>
                </FormItem>
            </Form>
          </div>
          <div slot="footer">
              <Button  @click="addModalFormClose('user_issue')">关闭</Button>
              <Button type="primary" @click="addUserIssueConfirm">保存</Button>
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
import util from '../../utils/util'
import download from '../../utils/download'
import demoData from '../../utils/baseData'
import packageJson from '../../../../package.json';
import RenderViewUser from '../../components/RenderViewUser.vue'
import RenderView from '../../components/RenderView.vue'
export default {
  components: { RenderViewUser,RenderView  },
  data () {
    return {
      // loading
      downloadExcelLoading: false,
      modalBtnLoading: false,
      tableLoading: false,
      insertModalShow : false,
      renderExcelLoading : false,

      //信息列表，弹出层
      listModalShow:false,
      listModalTitle:"信息列表",
      currentListTableColumn:[],//当前打开的数据列
      currentListDataList:[],//当前打开的数据
      listTableLoading:false,//打开表的加载状态
      listDataListTotalCount:0,//打开表的数据总数
      listSearchParams : {
          pageIndex: 1,
          pageSize: 10
      },//打开表的分页
      currentItem : null, //当前编辑的信息
      //添加子信息
      addModalForm:{
        user:false,
        user_training :false,
        user_issue:false
      },
      addModalTitle : '',
      addModalParams : {},
     
      //下载相关
      downModalShow:false,
      downFormItem : {},
      autoFileds:[],
      
      //下载个人信息
      downUserModalShow:false,
      currentDownUser : {},

      //查看信息
      viewModalForm: false, //显示状态
      viewModalTitle : "查看详情", //标题
      viewModalKeys : {}, //键值对
      viewDetailData : {} , //详细内容
      viewListModalForm : false,

      //删除数据
      delModalShow : false ,// 删除modal显示状态
      delModalData : {} , // 待删除的数据
      delDbName : "" ,//待删除的数据表

      currentVersion: packageJson.version, //当前版本号
      insertModalNextText : '下一步',
      insertFilePath : '',
      insertFile :null,
      insertStepCurrent : 0,
      steptitle3: "完成",
      insertErrData : [], //导入失败的数据
      insertErrCount : 0,//导入失败数
      insertSuccessCount : 0, //导入成功数
      insertTotalCount : 0, //待导入总数
      autoFileds : [] ,//自定义字段
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
          title: '序号',
          key: 'id',
          // type: 'selection',
          align: 'center',
          maxWidth: 100,
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return h('span', params.row.name);
          },
        },
                          
        {
          title: '状态',
          key: 'status',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.status);
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
                    let rendObj = {};
                    for(var n in this.autoFileds){
                      rendObj[this.autoFileds[n].filed_name] = this.autoFileds[n].filed_des
                    }
                    this.showViewModal({id:params.row.id,keys:rendObj,data:params.row})
                    }
                  }
              }),
              // h('Button', {
              //   props: {
              //     type: 'warning',
              //     size: 'small',
              //     icon: 'md-create'
              //   },
              //   attrs: {
              //     title: '修改'
              //   },
              //   style: {
              //     'margin-left': '5px'
              //   },
              //   on: {
              //     click: () => {
              //       this.edit(params.row)
              //     }
              //   }
              // }),
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
                    this.showListModal({user_id:params.row.id,db_name:"user_issue",label:"议题诉求"})
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
                    this.showListModal({user_id:params.row.id,db_name:"user_training",label:"培训经历"})
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
                // on: {
                //   click: () => {
                //     this.del(params.row)
                //   }
                // }
              }),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'md-arrow-down'
                },
                attrs: {
                  title: '下载'
                },
                style: {
                  'margin-left': '5px'
                },
                on: {
                  click: () => {
                    this.downUserModal(params.row);
                  }
                }
              }),
            ])
          }
        }
      ],
      listTableColumn : {
        user_training :[
          {
            title: '序号',
            key: 'id',
            align: 'center',
            maxWidth: 100,
          },
          {
            title: '培训主题',
            key: 'train_title',
            align: 'center',
            minWidth: 200,
          },
                            
          {
            title: '培训时间',
            key: 'train_time',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              return h('span', util.dateFilter(params.row.train_time));
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
                  on: {click: () => this.showListViewModal({data:params.row,keys:{train_title : '培训主题' , train_time:{title:"培训时间",istime:1}, train_desc : '培训内容'}})}
                }),
                // h('Button', {
                //   props: {
                //     type: 'warning',
                //     size: 'small',
                //     icon: 'md-create'
                //   },
                //   attrs: {
                //     title: '修改'
                //   },
                //   style: {
                //     'margin-left': '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.edit(params.row)
                //     }
                //   }
                // }),
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
                      this.del({name : params.row.train_title ,id:params.row.id,input:""},'user_training')
                    }
                  }
                })
              ])
            }
          }
        ],
        user_issue :[
          {
            title: '序号',
            key: 'id',
            align: 'center',
            maxWidth: 100,
          },
          {
            title: '议题',
            key: 'issue_name',
            align: 'center',
            minWidth: 200,
            // render: (h, params) => {
            //   return h('span', params.row.train_title);
            // },
          },
                            
          {
            title: '议题状态',
            key: 'issue_status',
            align: 'center',
            maxWidth: 150
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
                    click: () => {}
                    }
                }),
                // h('Button', {
                //   props: {
                //     type: 'warning',
                //     size: 'small',
                //     icon: 'md-create'
                //   },
                //   attrs: {
                //     title: '修改'
                //   },
                //   style: {
                //     'margin-left': '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.edit(params.row)
                //     }
                //   }
                // }),
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
                      this.del({name : params.row.issue_name ,id:params.row.id,input:""},'user_issue')
                    }
                  }
                })
              ])
            }
          }
        ],
      },
      userTrainingRuleValidate:{
        train_title: [{ required: true, message: '请填写培训主题' }],
        train_time: [{ required: true, message: '请选择培训时间' }],
        train_desc: [{ required: true, message: '请填写培训内容' }],
      },
      userIssueRuleValidate : {
        issue_name: [{ required: true, message: '请填写主题' }],
        issue_content: [{ required: true, message: '请填写内容' }],
      },
      downloadExcelSQL: '',
      whereSQL : ''
    }
  },
  created () {
    // console.log(this.viewModalForm)
    // this.getPeriodList()
    this.typeList = demoData.typeList
    this.statusList = demoData.statusList
    this.eduList = demoData.eduList
    
    this.getAutoFileds();
    this.getDataList('search')
  },
  computed: {
    modalTitle () {
      return this.modalParams.id ? '修改' : '创建'
    }
  },
  destroyed () {
    // this.viewModalFormClose()
  },
  methods: {
    //下载用户pdf
    downUserPdf(){
      this.downUserExcel()
    },
    //下载用户Excel
    downUserExcel(){
        let autoFileds = this.autoFileds;
        let currentDownUser = this.currentDownUser;
        let outData = [];
        for(const filed of autoFileds){
          let row1 = filed.filed_des;
          let row2 = currentDownUser[filed.filed_name];
          if(filed.data_input == 'date'){
            row2 = util.dateFilter(row2)
          }
          if(row2 == 'undefined' || row2 == 'null' || row2 == 'NaN'){
            row2 = "";
          }
          outData.push([row1,row2])
        }
        const name = '导出-' + currentDownUser.name
        download.excel.output(name, [
          {
            name:'sheet1',
            data:outData
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
    },
    //打开下载用户信息界面
    downUserModal(item){
      this.currentDownUser = item;
      let sql = `SELECT * from auto_fileds`;
      this.$db.all(sql,(err,res)=>{
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '查询失败',
            desc: err
          })
        } else {
          this.autoFileds = res;
          this.downUserModalShow =true;
        }
      })
    },
    downUserModalShowClose(){
      this.currentDownUser = {};
      this.downUserModalShow = false;
    },
    //打开下载选择字段界面
    openDownModal(){
      let sql = `SELECT * from auto_fileds`;
      this.$db.all(sql,(err,res)=>{
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '查询失败',
            desc: err
          })
        } else {
          // let t = {};
          // for(var i in res){
          //   t[res[i].filed_name] = res[i].filed_des
          // }
          this.autoFileds = res;
          this.downModalShow = true;
        }
      })
      
    },

    // 导出表格
    downloadExcel () {

      var fileds = '*';
      if(this.downFormItem && this.downFormItem.checkbox && this.downFormItem.checkbox.length){
        fileds = this.downFormItem.checkbox.join(',');
      }

      const outData = [];
      let checked = this.downFormItem.checkbox;
      let line1 = [];
      let line2 = [];
      let autoFileds = this.autoFileds
      for(var filed of autoFileds){
        //生成标题信息
        if(fileds == "*"){
          line1.push(filed.filed_des);
          if(filed.data_input == 'date'){
            line2.push({name:filed.filed_name});
          }else{
            line2.push(filed.filed_name);
          }
        }else{
          if(checked.indexOf(filed.filed_name) > -1){
            line1.push(filed.filed_des);
            if(filed.data_input == 'date'){
              line2.push({name:filed.filed_name});
            }else{
              line2.push(filed.filed_name);
            }
          }
        }
      }
      outData.push(line1);
      this.downloadExcelLoading = true
      var downSql = `SELECT ${fileds} FROM USER ` + this.whereSQL;
      console.log(downSql)
      this.$db.all(downSql, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '搜索失败',
            desc: err
          })
        } else {
          for (const item of res) {
            let line = [];
            for(const x of line2){
              if(x.name){
                line.push(util.dateFilter(item[x.name]))
              }else{
                if(item[x] == 'undefined' || item[x] == 'null' || item[x] == 'NaN'){
                  line.push('');
                }else{
                  line.push(item[x]);
                }
              }
            }
            outData.push(line)
          }
          

          const name = '数据导出'
          download.excel.output(name, [
            {
              name:'sheet1',
              data:outData
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

    downModalShowClose(){
      this.downModalShow = false;
    },
    //添加按钮
    showListAddModal(method){
      this.addModalForm[this.currentItem.db_name] = true
      const titlePre = {
        'add' : '添加',
        'edit' : '修改',
        'view' : '查看',
      }
      this.addModalTitle = titlePre[method] + this.currentItem.label
    },

    //关闭添加信息表单Modal
    addModalFormClose(){
      this.addModalTitle = ''
      this.addModalParams ={}
      this.addModalForm[this.currentItem.db_name] = false
    },
    //打开弹出层
    showListModal(item){
      this.currentItem = item;
      this.listModalShow = true;
      this.currentListTableColumn = this.listTableColumn[item.db_name];
      this.getListModalDataList()
    },
    //培训经历修改
    editUserTrainingConfirm(){

    },
    //培训经历保存
    addUserTrainingConfirm(){
      if(this.addModalParams.is_edit){
        this.editUserTrainingConfirm();
        return false;
      }
      this.$refs.userTrainingFormVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const addModalParams = this.addModalParams

          let userId = this.currentItem.user_id;
          let trainTime = addModalParams.train_time.getTime();
          const SQL = `INSERT INTO '${this.currentItem.db_name}' (user_id,train_time,train_title,train_desc,create_time,update_time)
                VALUES (
                '${userId}',
                '${trainTime}',
                '${addModalParams.train_title}',
                '${addModalParams.train_desc}',                
                '${Date.now()}',
                0)`; 
          this.$logger(SQL)
          this.$db.run(SQL, err => {
            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '新增失败',
                desc: err
              })
              this.$adminLog.write({
                text : SQL,
                status : 0,
                admin_id :1
              })
            } else {
              this.$Message.success({
                content: '添加成功'
              })
              this.$adminLog.write({
                text : SQL,
                status : 1,
                admin_id :1
              })
              this.getListModalDataList(1)
            }
            this.addModalFormClose()
          })
          
       
        }
      })
    },
    
    //党代表议题情况修改
    editUserIssueConfirm(){

    },
    //党代表议题情况保存
    addUserIssueConfirm(){
      if(this.addModalParams.is_edit){
        this.editUserIssueConfirm();
        return false;
      }
      this.$refs.userIssueFormVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const addModalParams = this.addModalParams
          let userId = this.currentItem.user_id;
          const SQL = `INSERT INTO '${this.currentItem.db_name}' (user_id,issue_name,issue_content,create_time,update_time)
                VALUES (
                '${userId}',
                '${addModalParams.issue_name}',
                '${addModalParams.issue_content}',                
                '${Date.now()}',
                0)`; 
          this.$logger(SQL)
          this.$db.run(SQL, err => {
            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '新增失败',
                desc: err
              })
              this.$adminLog.write({
                text : SQL,
                status : 0,
                admin_id :1
              })
            } else {
              this.$Message.success({
                content: '添加成功'
              })
              this.$adminLog.write({
                text : SQL,
                status : 1,
                admin_id :1
              })
              this.getListModalDataList(1)
            }
            this.addModalFormClose()
          })
          
       
        }
      })
    },

    //关闭弹出list残表
    listModalShowClose(){
      //信息列表，弹出层
      this.listModalShow = false
      this.listModalTitle = "信息列表"
      this.currentListTableColumn = []//当前打开的数据列
      this.currentListDataList=[]//当前打开的数据
      this.listTableLoading = false//打开表的加载状态
      this.listDataListTotalCount = 0//打开表的数据总数
      this.listSearchParams = {
          pageIndex: 1,
          pageSize: 10
      }//打开表的分页
      this.currentItem = null //当前编辑的信息
    },
    // pageSize改变
    getListModalDataListOnPageChange (pageSize) {
      this.searchParams.pageSize = pageSize
      this.getListModalDataList()
    },
    //获取弹出层信息列表
    getListModalDataList(method){
      this.listTableLoading = true
      if(typeof method === 'number') {
          this.listSearchParams.pageIndex = method
      }
      const pageSQL = `LIMIT ${this.listSearchParams.pageSize} OFFSET ${(this.listSearchParams.pageIndex - 1) * this.listSearchParams.pageSize} `
      let currentDbSQL = `SELECT * from ${this.currentItem.db_name} where user_id=${this.currentItem.user_id} ORDER BY id asc ` + pageSQL;

      const countSQL = `SELECT COUNT(id) AS totalCount from ${this.currentItem.db_name} `;

      this.$logger(currentDbSQL)
      this.$db.all(currentDbSQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '搜索失败',
            desc: err
          })
        } else {
          if (!res.length && this.listSearchParams.pageIndex !== 1) {
            // 该页没数据，又不是第一页，就往上一页翻
            this.getListModalDataList(this.listSearchParams.pageIndex - 1)
          } else {
            this.currentListDataList = res
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
          this.listDataListTotalCount = res.totalCount;
        }
      });
      this.listTableLoading = false
  },
  
    //设置行颜色
    rowClassName(row, index){
      if(row.status == "停止"){
        return 'table-warning-row';
      } else if (row.status == "终止") {
        return 'table-error-row';
      }
    },
    //通用查看
    showViewModal(data){
      this.viewModalTitle = "查看详情";
      this.viewModalForm = true;
      this.viewModalKeys = data.keys
      //获取本条信息详细内容
      this.viewDetailData = data.data;
    },
    //通用查看单列
    showListViewModal(data){
      this.viewModalTitle = "查看详情";
      this.viewListModalForm = true;
      this.viewModalKeys = data.keys
      //获取本条信息详细内容
      this.viewDetailData = data.data;
    },
    //关闭通用查看Modal
    viewModalFormClose(){
      this.viewModalTitle = '查看详情'
      this.viewModalKeys ={}
      this.viewModalForm = false
      this.viewListModalForm = false
      this.viewDetailData = {}
    },
    getAutoFileds(){
      const SQL = `select * from auto_fileds where table_name='USER' or table_name='user' order by id asc`;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '查询失败',
            desc: err
          })
        } else {
          this.autoFileds = res;
        }
      })
    },
    //生成数据模板
    renderExcelModel(){
      this.renderExcelLoading = true;
      const SQL = `select * from auto_fileds where (table_name='USER' or table_name='user') and is_insert=1 order by id asc`;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err)
          this.$Notice.error({
            title: '查询失败',
            desc: err
          })
        } else {
          let titleLine = [];
          let keyLine = [];
          res.forEach(e => {
            if(e.filed_name == 'create_time' || e.filed_name =="update_time" || e.filed_name == "primary_party_id" || e.filed_name == "more_keys"){
            }else{
              keyLine.push(e.filed_name);
            }
          });
          res.forEach(e => {
            if(e.filed_name == 'create_time' || e.filed_name =="update_time" || e.filed_name == "primary_party_id" || e.filed_name == "more_keys"){
              
            }else{
              let ie = e.filed_des;
              if(e.data_init){
                ie = ie + " " + e.data_init 
              }
              titleLine.push(ie);
            }
            
          });
          
          let outData = [];

          outData.push(titleLine); //第一行
          outData.push(keyLine);  //第二行
          const name = '信息模板';
          
        download.excel.output(name, [
          {
            name:"sheet1",
            data:outData,
          },
        ]).then(arg => {

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

          this.renderExcelLoading = false;
          this.$Notice.error({
            title: '导出失败',
            desc: err,
          });
        });
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
      console.log(this.searchParams)

      const searchParams = this.searchParams
      //姓名
      let whereSQL = `WHERE name LIKE '%${searchParams.name}%' `

      searchParams.status ? whereSQL += `AND status = ${searchParams.status} ` : null
      if(searchParams.checkbox && searchParams.checkbox.length){
        whereSQL += `AND (`;
        for(const checked of searchParams.checkbox){
          whereSQL += `${checked} = '是' or `
        }
        whereSQL = whereSQL.substring(0,whereSQL.length-3) + ') '
      }
      // searchParams.sex !== null ? whereSQL += `AND type_id = ${searchParams.type_id} ` : null
      
      const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageIndex - 1) * searchParams.pageSize} `
      const orderSQL = `ORDER BY id ${searchParams.sort} `

      // 导出sql
      this.downloadExcelSQL = 'SELECT * from USER ' + whereSQL + orderSQL
      this.whereSQL = whereSQL + orderSQL;
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
      // this.direct(row)
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
    
    

    openInsertModal(){
      this.insertModalShow = true;
    },
    
    insertModalShowClose(){
      this.insertFile = null
      this.insertModalShow = false;
      this.insertStepCurrent = 0;
      this.insertModalNextText = '下一步'
      this.insertSuccessCount = 0;
      this.insertErrCount = 0;
      this.insertErrData = [];
      this.insertTotalCount = 0;
      this.renderExcelLoading = false;
    },
    // :before-upload="handleUpload"
    handleUpload(file){
      //选择上传的文件
      this.insertFile = file
      return false;
    },
    //上传文件点击下一步
    insertModalNextClick(){
      if(this.insertStepCurrent == 0) {
        this.insertModalNextText = '导入'
      }else if(this.insertStepCurrent == 1){
        if(!this.insertFile){
          this.$Message.warning({
            content: '请上传文件'
          })
          return false;
        }
        this.insertExcel();
        return false;
      }else if(this.insertStepCurrent == 2){
        if(this.insertErrCount == 0){
          this.insertModalShowClose();
          return false;
        }else{
          this.outErrData();
          return false;
        }
      }else{
        
        this.insertModalShowClose();
        return false;
      }
      this.insertStepCurrent += 1;
    },
    //导出错误数据
    outErrData(){
      this.renderExcelLoading = true;
      download.excel.output("导入失败数据", [
        {
          name:"sheet1",
          data:this.insertErrData,
        },
      ]).then(arg => {
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
        this.insertModalShowClose();
      }).catch(err => {

        this.renderExcelLoading = false;
        this.$Notice.error({
          title: '导出失败',
          desc: err,
        });
      });
    },
    //导入数据
    insertExcel(){
      this.renderExcelLoading = true;
      let res = download.excel.parse(this.insertFile.path);
      if(res && res[0] && res[0].data){
        let data = res[0].data;
        console.log(data)
        //检查必填项
        let autoFiledSql = `select * from auto_fileds`;
        this.$db.all(autoFiledSql, (err, res) => {
          if (err) {
            this.$logger(err)
            this.$Notice.error({
              title: '操作失败',
              desc: err
            })
          } else {
            //不合格的数据
            this.insertTotalCount = data.length - 2;
            let errorLine1 = data[0];
            let errorLine2 = data[1];
            this.insertErrData.push(errorLine1);
            this.insertErrData.push(errorLine2);
            //必填项
            let requireVals = [];
            //日期项
            var dateVals = [];
            // 去除指定的数据
            var nres = new Array();
            for(const i in res){
              if(res[i].filed_name == 'create_time' || res[i].filed_name =="update_time" || res[i].filed_name == "primary_party_id" || res[i].filed_name == "more_keys"){
              }else{
                nres.push(res[i]);
              }
            }
            for(const ix in nres){
              //日期类型
              if(nres[ix].data_input == 'date'){
                dateVals.push(nres[ix].filed_name);
              }
              //必填项
              if(nres[ix].is_need == 1){
                requireVals.push(nres[ix].filed_name);
              }
            }
            //键名
            let keys = data[1];
            let stringKeys = keys.join(',');
            //查找必填项键名的位置
            let whereKeys = [];
            //日期类型的位置
            let dateKeys = [];
            //校验数据;
            let valiteObj = {'name':0,'card_id':0,'period_start':0};

            for(const x in keys){
              //校验重复性的位置
              if(valiteObj.hasOwnProperty(keys[x])){
                valiteObj[keys[x]] = x;
              }
              //日期类型数据的位置
              if(dateVals.indexOf(keys[x]) > -1 ){
                dateKeys.push(parseInt(x))
              }
              //必填项的位置
              if(requireVals.indexOf(keys[x]) > -1 ){
                whereKeys.push(x)
              }
            }
            

            for(let j=2 ;j< (data.length) ; j++){
              //每一列就是一组数据;
              let bj = 0;
              let tmpData = data[j];
              //防止最后几列的数据为空
              let dl = tmpData.length;
              let al = errorLine2.length;
              if(dl < al){
                for(var bx=0; bx<(al-dl) ; bx++){
                  tmpData.push('null');
                }
              }
              //检查数据是否存在
              for(let t in whereKeys){
                if(!tmpData || !tmpData[whereKeys[t]]){
                  //数据不合格，把不合格的数据保存到临时
                  let tmpErr = tmpData;
                  tmpErr.push(errorLine1[whereKeys[t]] + '不可为空');
                  this.insertErrData.push(tmpErr);
                  this.insertErrCount += 1;
                  bj = 1;
                }
              }
              //数据检查没有错，进行存储
              if(bj == 0){
                let stringVal = "";
                for(let n=0;n<tmpData.length;n++){
                  
                  // stringVal += "\'" + tmpData[n] + "\'" + ',';
                  let str = tmpData[n];
                  //检查n这个键值的位置是不是日期类型
                  if(dateKeys.indexOf(n) > -1 ){
                    //日期数据转化
                    str = util.dateExcelToJs(str); 
                  }
                  //格式化特殊字符
                  if(str){
                    str = util.sqliteEscape(str); 
                  }
                  stringVal += "'" + str + "'" + ',';
                }
                stringVal = stringVal.substring(0,stringVal.length-1)
                let insertSQL = `INSERT INTO USER (${stringKeys}) VALUES(${stringVal})`;
                
                
                // console.log(nres)
                // console.log(dateKeys)
                // console.log(tmpData)
                
                // return false;
                //检查是否有重复的用户，验证姓名、起始时间、身份证号
                // 1. 拼接查重数据
                var bdSql = `SELECT COUNT(id) AS totalCount from USER WHERE `
                for(var kx in valiteObj){
                  var kw = valiteObj[kx]; //下标
                  var sv = tmpData[kw];
                  //检查n这个键值的位置是不是日期类型
                  if(dateKeys.indexOf(parseInt(kw)) > -1 ){
                    //日期数据转化
                    sv = util.dateExcelToJs(sv); 
                  }
                  //kx 字段
                  bdSql += `${kx}= '${sv}' AND `
                }
                bdSql = bdSql.substring(0,bdSql.length-5);
                //检查重复项
                this.$db.get(bdSql,(err,res)=>{
                  if(err){
                    this.renderExcelLoading = false;
                    this.$Message.warning({
                      content: '未知错误，请联系管理员'
                    })
                    return false;
                  }else{
                    let insertErr = tmpData;  
                    if (res.totalCount) {
                      //重复数据
                      insertErr.push("数据重复");
                      //把插入失败的内容也写到数据表里
                      this.insertErrData.push(insertErr);
                      this.insertErrCount += 1;
                    } else {
                      

                      this.$db.run(insertSQL,err => {
                        if(err){
                          console.log(insertSQL)
                          this.$logger(err);
                          insertErr.push("导入失败," + err);
                          //把插入失败的内容也写到数据表里
                          this.insertErrData.push(insertErr);
                          this.insertErrCount += 1;
                        }else{
                          this.insertSuccessCount += 1;
                        }
                      })
                    }
                  }
                })

              }
              
            }
            //导出错误数据
            this.renderExcelLoading = false;
            this.insertStepCurrent = 2;
            if(this.insertErrCount == 0){
              this.insertModalNextText = '完成'
              this.steptitle3 = "完成"
            }else{
              this.steptitle3 = "下载错误数据"
              this.insertModalNextText = '下载错误数据'
            }

            this.getDataList();
          }
        })
      }else{
        this.renderExcelLoading = false;
        this.$Message.warning({
          content: '数据解析错误，请检查文件！'
        })
      }

      
      
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
        this.getListModalDataList();
      });
    }
  },
  filters :{
    //党工委信息格式化
    // filter_item_party_name(item){
    //   return filters.filter_party_name(item);
    // },
    //格式化显示结果
    render_detail(data,keys){
      return util.formatRenderText(data,keys);
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
.ivu-table .table-warning-row td{
    background-color: #ffd1b2;
    // color: #fff;
}
.ivu-table .table-error-row td{
    background-color: #ffaa9c;
    // color: #fff;
}
.outcheckbox .ivu-checkbox-group-item{
  display: inline-block;
  width: 30%;
}
</style>
