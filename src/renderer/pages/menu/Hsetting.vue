<template>
    <div class="">
      <div class="tebox">
        <Row :gutter="40" class-name="def-row"	>
          <Col v-for="(item,index) in hSettingList" :value="item.id" :key="index" 
            span="8" class-name="def-col" @click="getData(item)">
              <div  @click="getData(item)" class="col-box" :style="{'backgroundColor':item.color}">
                <Icon :type="item.icon"></Icon>
                {{item.label}}
              </div>
          </Col>
        </Row>
        <Form inline  :label-width="80">
          <Form-item label="超级管理">
            <Input type="password" v-model="dbManageInput" placeholder="key||sql，请在管理员的帮助下执行此操作" style="width:500px"></Input>
          </Form-item>
          <Form-item :label-width="10">
              <Button type="primary" @click="rootManagerDB">执行</Button>
          </Form-item>
        </Form>
        
      </div>

      <!-- 信息列表 -->
      <Modal v-model="modalShow" :mask-closable="true" :title="modalTitle" @on-cancel="modalShowClose" width="80%">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{modalTitle}}</span>
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
              <span v-if="currentItem && currentItem.db_name =='auto_fileds'">
                <Button type="warning" @click="initDb('auto_fileds')">初始化</Button>
              </span>
              <span>
                <Button type="primary" @click="showAddModal('add')">添加</Button>
              </span>
          </div>
      </Modal>

      <!-- 添加自定义数据 -->
      <Modal v-model="addModalForm.auto_fileds" :mask-closable="true" :title="addModalTitle" @on-cancel="addModalFormClose('auto_fileds')">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{addModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <Form ref="autoFiledsFormVali" :rules="autoFiledsRuleValidate" :model="addModalParams" label-position="right"
                  :label-width="120">
                <FormItem label="字段名称" prop="filed_des">
                    <Input v-model="addModalParams.filed_des" placeholder="起个好记的名字，可以是汉字" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="字段标识" prop="filed_name">
                    <Input v-model="addModalParams.filed_name" placeholder="只可使用小写英文和_(英文下划线)" style="width: 300px" :disabled="addModalParams.is_edit"></Input>
                </FormItem>
                <FormItem label="数据类型" prop="data_type">
                  <Select v-model="addModalParams.data_type" style="width:300px;">
                    <Option value="TEXT">TEXT(不清楚就选这个)</Option>
                    <Option value="INTEGER">INTEGER(纯数字就选这个)</Option>
                  </Select>
                </FormItem>
                <FormItem label="输入类型" prop="data_input">
                    <Select v-model="addModalParams.data_input" style="width:300px;">
                      <Option value="input">输入框</Option>
                      <Option value="textarea">文本框</Option>
                      <Option value="date">记录日期(用来记录日期)</Option>
                      <Option value="select">选择框(多个内容用来选择)</Option>
                    </Select>
                </FormItem>
                <FormItem label="初始值" prop="data_init">
                    <Input v-model="addModalParams.data_init" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入类型为选择框时填写此内容，以英文逗号间隔，例：  值1,值2,值3" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="是否统计">
                  <i-switch v-model="addModalParams.is_count" size="large">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                  </i-switch>
                </FormItem>
                <FormItem label="是否为必填项">
                  <i-switch v-model="addModalParams.is_need" size="large">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                  </i-switch>
                </FormItem>
            </Form>
          </div>
          <div slot="footer">
              <Button  @click="addModalFormClose('auto_fileds')">关闭</Button>
              <Button type="primary" @click="addAutoFiledsConfirm">保存</Button>
          </div>
      </Modal>

      <!-- 添加管理员Modal -->
      <Modal v-model="addModalForm.admin" :mask-closable="true" :title="addModalTitle" @on-cancel="addModalFormClose('admin')">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>{{addModalTitle}}</span>
          </p>
          <div style="overflow:hidden">
            <Form ref="adminFormVali" :rules="adminRuleValidate" :model="addModalParams" label-position="right"
                  :label-width="120">
                <FormItem label="所属党工委" prop="party_id">
                  <Select v-model="addModalParams.party_id" style="width:300px;">
                      <Option value="0">超级管理员</Option>
                      <Option v-for="(item,index) in partyList" :value="item.id" :key="index">{{item|filter_item_party_name}}
                      </Option>
                  </Select>
                </FormItem>

                <FormItem label="用户名" prop="admin_name">
                    <Input v-model="addModalParams.admin_name" placeholder="必填" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="登陆密码" prop="admin_pass">
                    <Input v-model="addModalParams.admin_pass"  autocomplete="off" placeholder="必填" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="重复密码" prop="admin_repass">
                    <Input v-model="addModalParams.admin_repass"  autocomplete="off" placeholder="必填" style="width: 300px"></Input>
                </FormItem>

                <FormItem label="手机号" prop="mobile">
                    <Input v-model="addModalParams.mobile"  placeholder="必填" style="width: 300px"></Input>
                </FormItem>

            </Form>
          </div>
          <div slot="footer">
              <Button  @click="addModalFormClose('admin')">关闭</Button>
              <Button type="primary" @click="addAdminConfirm">保存</Button>
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
// @rdata={viewDetailData|render_detail(viewModalKeys)} 
  import util from '../../utils/util';
  import demoData from '../../utils/baseData';
  import filters from '../../utils/filters';
  import RenderView from '../../components/RenderView.vue'
  export default {
    components: { RenderView  },
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value.length < 6){
          callback(new Error('密码长度不能小于6位'));
        } else {
          
          if (this.addModalParams.admin_repass !== '') {
            this.$refs.adminFormVali.validateField('admin_repass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if(value.length < 6){
          callback(new Error('密码长度不能小于6位'));
        } else if (value !== this.addModalParams.admin_pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
const tableColumn = {
  admin_log:[{title:'序号',key:'id',align:'center',maxWidth:80},{title:'操作人',key:'admin_id',align:'left',maxWidth:120,render:(h,params)=>{let res=filters.filter_admin_name(params.row.admin_id);return h('span',res)},},{title:'时间',key:'create_time',align:'center',minWidth:120,render:(h,params)=>{return h('span',util.dateFilter(params.row.create_time))},},{title:'状态',key:'status',align:'center',maxWidth:80,render:(h,params)=>{return h('span',params.row.status==1?'成功':'失败')},},{title:'内容',key:'log',align:'center',ellipsis:true,minWidth:200},{title:'操作',key:'action',width:200,align:'center',fixed:'right',render:(h,params)=>{return h('div',[h('Button',{props:{type:'primary',size:'small',icon:'ios-paper-outline'},attrs:{title:'详情'},on:{click:()=>this.showViewModal({id:params.row.id,keys:{admin_id:'管理员ID',create_time:{title:"操作时间",istime:1},status:{title:'操作状态',values:{0:'失败',1:'成功'}},log:"详细内容"}})}}),])}}],
        admin : [
          {
              title: '序号',
              key: 'id',
              align: 'center',
              maxWidth: 80
          },
          {
              title: '用户名',
              key: 'admin_name',
              align: 'center',
              maxWidth: 120
          },
          {
            title: '党工委',
            key: 'party_id',
            align: 'center',
            minWidth: 180,
            // render: (h, params) => {
            //   return h('span', params.row.status == 1?'成功':'失败');
            // },
          },
          {
            title: '手机号',
            key: 'mobile',
            align: 'center',
            maxWidth: 200
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
                    on: {click: () => this.showViewModal({id:params.row.id,keys:{admin_name : '用户名', mobile : '手机号' , party_id : '党工委' , create_time:{title:"操作时间",istime:1}}})}
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
                        this.del({name : params.row.admin_name,mobile:params.row.mobile,id:params.row.id,input:""},'admin')
                      }
                    }
                  })
                ])
              }
          }
        ],
        auto_fileds : [
          {
              title: '序号',
              key: 'id',
              align: 'center',
              maxWidth: 80
          },
          {
              title: '列名',
              key: 'filed_des',
              align: 'center',
              maxWidth: 200
          },
          {
            title: '字段名',
            key: 'filed_name',
            align: 'center',
            minWidth: 120,
            // render: (h, params) => {
            //   return h('span', params.row.status == 1?'成功':'失败');
            // },
          },
          {
            title: '已初始化',
            key: 'is_insert',
            align: 'center',
            maxWidth: 200,
            render: (h, params) => {
              return h('span',{class: params.row.is_insert == 1?['green']:['yellow']}, params.row.is_insert == 1?'是':'否');
            },
          },
          {
            title: '是否统计',
            key: 'is_count',
            align: 'center',
            maxWidth: 200,
            render: (h, params) => {
              return h('span', {class: params.row.is_count == 1?['green']:['yellow']},params.row.is_count == 1?'是':'否');
            },
          },
          
          {
            title: '是否必填',
            key: 'is_need',
            align: 'center',
            maxWidth: 200,
            render: (h, params) => {
              return h('span',{class: params.row.is_need == 1?['green']:['yellow']},params.row.is_need == 1?'是':'否');
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
                    on: {click: () => this.showViewModal({id:params.row.id,keys:{table_name : '表名', filed_des : '列名' , base_filed : {title:'是否为系统字段',values:{0:'否',1:'是'}} ,is_need :  {title:'是否为必填项',values:{0:'否',1:'是'}},is_count : {title:'是否需要统计',values:{0:'否',1:'是'}},data_input:"数据类型"}})}
                  }),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      icon: 'md-create'
                    },
                    attrs: {
                      title: '编辑'
                    },
                    style: {
                      'margin-left': '5px'
                    },
                    on: {
                      click: () => {
                        this.editAutoFileds(params.row)
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
                        this.del({name : params.row.filed_des + params.row.filed_name + '字段',id:params.row.id,data:params.row,input:""},'auto_fileds')
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      icon: 'ios-alert'
                    },
                    attrs: {
                      title: '初始化'
                    },
                    style: {
                      'margin-left': '5px'
                    },
                    on: {
                      click: () => {
                        this.insertToUser(params.row)
                      }
                    }
                  }),

                ])
              }
          }
        ]
  }
      return {
        tableLoading: false,
        modalBtnLoading : false,
        hSettingList : [],
        dbManageInput:"",
        modalShow : false,
        modalTitle : "",
        partyList : [] , //党工委信息
        tableColumn : tableColumn, //表单操作列
        currentTableColumn : [] ,// 当前显示的列信息
        currentItem : null, //当前编辑的信息
        currentDbSQL : '' , //当前要查询的信息
        dataList : [], //当前要展示的信息
        dataListTotalCount : 0 , //信息总数
        searchParams : {
          pageIndex: 1,
          pageSize: 10
        },
        //查看信息
        viewModalForm: false, //显示状态
        viewModalTitle : "查看详情", //标题
        viewModalKeys : {}, //键值对
        viewDetailData : {} , //详细内容

        //删除数据
        delModalShow : false ,// 删除modal显示状态
        delModalData : {} , // 待删除的数据
        delDbName : "" ,//待删除的数据表

        //添加编辑
        addModalForm:{
          admin : false,

        },
        addModalTitle : "",
        addModalParams : {},
        adminRuleValidate: {
          admin_name: [
            { required: true, message: '请输入用户名' },
            { min:4, message: '长度4位数以上' }
          ],
          admin_pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          admin_repass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号' , trigger: 'blur'},
            // { type: 'mobile', message: '请输入正确的手机号' , trigger: 'blur'}
          ],
        },
        autoFiledsRuleValidate:{
          filed_des: [
            { required: true, message: '请输入字段名称' },
          ],
          filed_name: [
            { required: true, message: '请输入字段标识' },
          ],
          data_type: [
            { required: true, message: '请选择数据类型' },
          ],
        },
 
      }
    },

    created () {
      this.hSettingList = demoData.hSettingItems;
      
    },

    methods : {
      
      getData : function(item){
        if(item.db_name) {
          this.dataList = [],
          this.currentItem = item;
          this.currentTableColumn = this.tableColumn[item.db_name]
          if(this.currentItem.db_name == "admin"){
            //拉取党工委信息
            this.getPartyInfos();
          }
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
      getPartyInfos(){
        let dbSQL = `SELECT * from party ORDER BY id asc `;
        this.$logger(dbSQL)
          this.$db.all(dbSQL, (err, res) => {
            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '搜索失败',
                desc: err
              })
            } else {
              if (res.length) {
                this.partyList = res
              }
            }
          })
      },
      //获取信息
      getDataList(method){
          this.tableLoading = true
          if(typeof method === 'number') {
              this.searchParams.pageIndex = method
          }
          const pageSQL = `LIMIT ${this.searchParams.pageSize} OFFSET ${(this.searchParams.pageIndex - 1) * this.searchParams.pageSize} `
          let currentDbSQL = `SELECT * from ${this.currentItem.db_name} ORDER BY id asc ` + pageSQL;

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
      showViewModal(data){
        this.viewModalTitle = "查看详情";
        this.viewModalForm = true;
        this.viewModalKeys = data.keys
        //获取本条信息详细内容
        this.getDetail(data.id);
      },
      //关闭通用查看Modal
      viewModalFormClose(){
        this.viewModalTitle = '查看详情'
        this.viewModalKeys ={}
        this.viewModalForm = false
        this.viewDetailData = {}
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
      addModalFormClose(){
        this.addModalTitle = ''
        this.addModalParams ={}
        this.addModalForm[this.currentItem.db_name] = false
      },
      //数据表字段初始化
      insertToUser(data){
        if(data.is_insert != 1){
          this.$db.serialize(() => {
            this.$db.run('BEGIN');
            let adSql = `alter table USER add column ${data.filed_name} ${data.data_type}`;

            //开始执行插入数据表
            this.$db.run(adSql, (err, res) => {
              if(err){
                this.$Notice.error({
                  title: '请勿重复操作'
                });
              }
              console.log(err)
            });
            // 更新本表信息
            let upSql = `UPDATE AUTO_FILEDS SET is_insert=1 where id=${data.id}`;
            this.$db.run(upSql, (err, res) => {
              console.log(err)
            });
            //提交修改
            this.$db.run('COMMIT');
            this.$Message.success({
              content: '操作成功',
            });
            //更新当前页
            this.getDataList(this.searchParams.pageIndex);
          });
        }else{
          this.$Notice.error({
            title: '字段已初始化'
          });
        }
        
      },
    //删除数据
    del(del_data,db_name){
        if(db_name == 'auto_fileds'){
          if(del_data.data && del_data.data.base_filed == 1){
            this.$Notice.error({
              title: '您无权删除系统字段！'
            });
            return false ;
          }
        }
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

      //获取 信息详细内容
      getDetail(id){
        const SQL = `SELECT * from '${this.currentItem.db_name}' WHERE id = '${id}'`
        this.$db.get(SQL, (err, res) => {
          if (err) {
            this.$logger(err)
            this.$Notice.error({
              title: '搜索失败',
              desc: err
            })
          } else {
            if(res){
              this.viewDetailData = res;
            }
          }
        })
      },
      editAutoFileds(item){
        if(item.base_filed){
          this.$Message.warning({
            content: '您不可以修改此内容'
          })
          return false;
        }
        item.is_count = Boolean(item.is_count)
        item.is_need = Boolean(item.is_need)
        this.addModalParams = item;
        this.addModalParams.is_edit = true;

        this.showAddModal('edit')
      },
      editAutoFiledsConfirm(){
        this.$refs.autoFiledsFormVali.validate(valid => {
          if (valid) {
            this.modalBtnLoading = true
            const addModalParams = this.addModalParams

            const SQL = `UPDATE '${this.currentItem.db_name}' set 
                    filed_des='${addModalParams.filed_des}', 
                    data_type='${addModalParams.data_type}', 
                    data_input='${addModalParams.data_input||""}', 
                    data_init='${addModalParams.data_init||""}', 
                    is_count='${addModalParams.is_count?1:0}', 
                    is_need='${addModalParams.is_need?1:0}' 
                    where id=${addModalParams.id}`;
            this.$logger(SQL)
            this.$db.run(SQL, err => {
              if (err) {
                this.$logger(err)
                this.$Notice.error({
                  title: '修改失败',
                  desc: err
                })
                this.$adminLog.write({
                  text : SQL,
                  status : 0,
                  admin_id :1
                })
              } else {
                this.$Message.success({
                  content: '修改成功'
                })
                this.$adminLog.write({
                  text : SQL,
                  status : 1,
                  admin_id :1
                })
                this.getDataList(this.searchParams.pageIndex)
              }
              this.addModalFormClose()
            })
          }
        })
      },
      //自定义字段保存
      addAutoFiledsConfirm(){
        if(this.addModalParams.is_edit){
          this.editAutoFiledsConfirm();
          return false;
        }
        this.$refs.autoFiledsFormVali.validate(valid => {
          if (valid) {
            this.modalBtnLoading = true
            const addModalParams = this.addModalParams

            // 检测名称是否重复
            const SQL = `SELECT COUNT(id) AS totalCount from '${this.currentItem.db_name}' WHERE filed_name = '${addModalParams.filed_name}'`
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
                    content: '已存在的字段标识'
                  })
                  this.modalBtnLoading = false
                } else {
                  const SQL = `INSERT INTO '${this.currentItem.db_name}' (table_name,filed_des,filed_name,data_type,data_input,data_init,is_count,is_need)
                  VALUES (
                  'USER',
                  '${addModalParams.filed_des}',
                  '${addModalParams.filed_name}',
                  '${addModalParams.data_type}',
                  '${addModalParams.data_input||""}',
                  '${addModalParams.data_init||""}',
                  '${addModalParams.is_count?1:0}',
                  '${addModalParams.is_need?1:0}'
                  )`; 
                  
                // console.log(addModalParams)
                // console.log(SQL)
                // return false;
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
                        this.getDataList(1)
                      }
                      this.addModalFormClose()
                    })
                  }
                }
              })
            }
        })
      },
      //addModal 保存
      addAdminConfirm(){
        this.$refs.adminFormVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const addModalParams = this.addModalParams
          //检查是否有权限创建超级管理员

          // 检测名称是否重复
          const SQL = `SELECT COUNT(id) AS totalCount from '${this.currentItem.db_name}' WHERE admin_name = '${addModalParams.admin_name}'`
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
                  content: '已存在的用户名'
                })
                this.modalBtnLoading = false
              } else {
                let salt_key = util.randomString();
                const encrypt_pwd = util.encryptPwd(this.addModalParams.admin_pass,salt_key);
                const SQL = `INSERT INTO '${this.currentItem.db_name}' (admin_name,admin_pass,salt_key,mobile,admin_level,party_id,create_time,update_time)
            VALUES (
              '${addModalParams.admin_name}',
              '${encrypt_pwd}',
              '${salt_key}',
              '${addModalParams.mobile}',
              '${addModalParams.admin_level}',
              '${addModalParams.party_id}',
              '${Date.now()}',
              0)`
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



      // 初始化自定义数据
      initDb(db_name){
        const sqls = demoData['init_'+db_name];
        if(sqls){
          sqls.forEach(e=>{
            this.$db.run(e, (err, res) => {
              if(err){
                this.$logger(err)
                this.$Notice.error({
                  title: '操作失败',
                  desc: err
                })
              }
            })
          })
          this.getDataList()
        }
      },
      //超级管理员操作数据库
      rootManagerDB(){
        if(this.dbManageInput){
          let tmp = this.dbManageInput.split('||');
          if(tmp.length >= 2){
            //查询超级管理员账户
            let SQL = `SELECT * from admin where id=1`;
            this.$db.get(SQL, (err, res) => {
              if (err) {
                this.$logger(err)
                this.$Notice.error({
                  title: '操作失败',
                  desc: err
                })
              } else {
                //验证超级管理员密码
                const encrypt_pwd = util.encryptPwd(tmp[0],res.salt_key);
                if(encrypt_pwd == res.admin_pass){
                  this.$db.run(tmp[1], (err, res) => {
                    if (err) {
                      this.$logger(err)
                      this.$Notice.error({
                        title: '操作失败',
                        desc: err
                      })
                    } else {
                      this.$Message.success({
                        content: '操作成功',
                      });
                    }
                  })
                }
              }
            })
          }
        }
        this.dbManageInput = '';
      },
    },

    filters :{
      //党工委信息格式化
      filter_item_party_name(item){
        return filters.filter_party_name(item);
      },

      //格式化显示结果
      render_detail(data,keys){
        
        return util.formatRenderText(data,keys);
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
  .green{
    padding:5px 8px;
    background: green;
    color:#fff
  }
  .yellow{
    padding: 5px;
    background: orange;
    color:#fff
  }
</style>
