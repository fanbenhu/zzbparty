<template>
    <Modal v-model="modalShow" :mask-closable="false" :title="modalTitle" @on-cancel="modalShow = false" width="80%">
    <div>
        <Form ref="formVali" :model="modalParams" :rules="ruleValidate" label-position="right" inline
                :label-width="80">
            <FormItem label="姓名" prop="name">
                <Input v-model="modalParams.name" placeholder="必填" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="性别" prop="sex">
                <Select v-model="modalParams.sex" style="width:120px;">
                    <Option value="1">男</Option>
                    <Option value="0">女</Option>
                </Select>
            </FormItem>
            
            <!-- <FormItem label="证件号" prop="card_id">
                <Input v-model="modalParams.card_id" placeholder="请输入证件号"
                        style="width: 334px"></Input>
            </FormItem> -->
            <FormItem label="届次" prop="period_id">
                <Select v-model="modalParams.period_id" style="width:120px;">
                    <Option v-for="(item,index) in periodList" :value="item.id" :key="index">{{item.period_name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="类型" prop="type_id">
                <Select v-model="modalParams.type_id" style="width:120px;">
                    <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{item.type_name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="状态" prop="status">
                <Select v-model="modalParams.status" style="width:120px;">
                    <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{item.label}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="生日" prop="birthday">
                <DatePicker type="date" placeholder="请选择" style="width: 120px"  v-model="modalParams.birthday"></DatePicker>
            </FormItem>
            <FormItem label="民族" prop="national">
                <Input v-model="modalParams.national" placeholder="" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="籍贯" prop="native">
                <Input v-model="modalParams.native" placeholder="" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="出生地" prop="birth_place">
                <Input v-model="modalParams.birth_place" placeholder="请输入出生地"
                        style="width: 334px"></Input>
            </FormItem>
            <FormItem label="入党时间" prop="jion_time">
                <DatePicker type="date" placeholder="请选择" style="width: 120px"  v-model="modalParams.jion_time"></DatePicker>
            </FormItem>
            <FormItem label="工作时间" prop="work_time">
                <DatePicker type="date" placeholder="请选择" style="width: 120px"  v-model="modalParams.work_time"></DatePicker>
            </FormItem>
            <FormItem label="职业" prop="job">
                <Input v-model="modalParams.job" placeholder="" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="健康状态" prop="health">
                <Input v-model="modalParams.health" placeholder="" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="全日制教育" prop="edu_full">
                <Select v-model="modalParams.edu_full" style="width:120px;">
                    <Option v-for="(item,index) in eduList" :value="item.label" :key="index">{{item.label}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="在职教育" prop="edu_after">
                <Select v-model="modalParams.edu_after" style="width:120px;">
                    <Option v-for="(item,index) in eduList" :value="item.label" :key="index">{{item.label}}
                    </Option>
                </Select>
            </FormItem>
            
            <FormItem label="个人简历" prop="small_text">
                <Input v-model="modalParams.small_text" type="textarea" :rows="4" placeholder="非必填，长度 200 以内"
                        style="width: 334px"></Input>
            </FormItem>
        </Form>
    </div>
    <div slot="footer">
        <Button @click="modalShow = false">
            取消
        </Button>
        <Button type="primary" v-if="!modalParams.id" @click="addConfirm" :loading="modalBtnLoading">确认
        </Button>
        <Button type="primary" v-if="modalParams.id" @click="editConfirm" :loading="modalBtnLoading">确认
        </Button>
    </div>
</Modal>


<!-- <Modal v-model="delModalShow" width="370">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center;line-height: 26px;">
                <p>将永久删除 <strong>{{modalParams.name}}</strong> ，并删除该物品所有进出明细，且<strong>无法恢复</strong>。</p>
                <p>请输入该物品品名以确认删除。</p>
                <Input v-model="modalParams.input"
                       style="width: 250px"></Input>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="delConfrim" :loading="modalBtnLoading"
                        :disabled="modalParams.name !== modalParams.input">删除
                </Button>
            </div>
        </Modal> -->
</template>


<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    setup() {
        
    },
    data(){
      return {
        modalShow: false,
      modalParams: {
        name: '',
        card_id: '',
        status: '',
        type_id: '',
        period_id: '',
        sex: '',
        birthday: '',
        age: '',
        national: '',
        native: '',
        jion_time: '',
        work_time: '',
        job: '',
        health: '',
        skill: '',
        skill_specialty: '',
        edu_full: '',
        edu_full_info: '',
        edu_after: '',
        edu_after_info: '',
        current_postion: '',
        primary_party: '',
        small_text: '',
        political_history: '',
        rewards: '',
        party_desc_current: '',
        party_desc_history: '',
      },
      delModalShow: false,
      ruleValidate: {
        name: [
          { required: true, message: '请输入 姓名' },
          { max: 100, message: '姓名 长度 100 以内' }
        ],
        small_text: [
          { max: 200, message: '备注 长度 200 以内' }
        ]
      },
    }
    },
    methods:{
        // 新增
    add () {
      this.$refs.formVali.resetFields()
      this.modalParams = this.$options.data().modalParams
      this.modalShow = true
    },
    // 新增确认
    addConfirm () {
      this.$refs.formVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const modalParams = this.modalParams
          // 检测是否存在
          const SQL = `SELECT COUNT(id) AS totalCount from USER WHERE name = '${modalParams.name}' and period_id = '${modalParams.period_id}'`
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
                  content: '代表已存在'
                })
                this.modalBtnLoading = false
              } else {

      
                const SQL = `INSERT INTO USER (name,card_id,status,type_id,period_id,sex,birthday,age,national,native,birth_place,jion_time,work_time,health,skill,skill_specialty,edu_full,edu_full_info,edu_after,edu_after_info,current_postion,primary_party,small_text,political_history,rewards,party_desc_current,party_desc_history,create_time,update_time)
          VALUES (
            '${modalParams.name}',
            '',
            '${modalParams.status}',
            '${modalParams.type_id}',
            '${modalParams.period_id}',
            '${modalParams.sex}',
            '${modalParams.birthday}',
            '',
            '${modalParams.national}',
            '${modalParams.native}',
            '${modalParams.birth_place}',
            '${modalParams.jion_time}',
            '${modalParams.work_time}',
            '${modalParams.health}',
            '${modalParams.skill}',
            '${modalParams.skill_specialty}',
            '${modalParams.edu_full}',
            '${modalParams.edu_full_info}',
            '${modalParams.edu_after}',
            '${modalParams.edu_after_info}',
            '${modalParams.current_postion}',
            '${modalParams.primary_party}',
            '${modalParams.small_text}',
            '${modalParams.political_history}',
            '${modalParams.rewards}',
            '${modalParams.party_desc_current}',
            '${modalParams.party_desc_history}',
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
                    this.modalShow = false
                    this.$Message.success({
                      content: '新增成功'
                    })
                    this.getDataList(1)
                  }
                  this.modalBtnLoading = false
                })
              }
            }
          })
        }
      })
    },



    // 编辑
    edit (row) {
      this.$refs.formVali.resetFields()
      this.modalParams = {
        id: row.id,
        name: row.name,
        standard_buy_unit_price: row.standard_buy_unit_price,
        standard_sell_unit_price: row.standard_sell_unit_price,
        remark: row.remark
      }
      this.modalShow = true
    },
    // 编辑确认
    editConfirm () {
      this.$refs.formVali.validate(valid => {
        if (valid) {
          this.modalBtnLoading = true
          const modalParams = this.modalParams
          // 检测品名是否存在
          const SQL = `SELECT id from GOODS WHERE name = '${modalParams.name}'`
          this.$db.get(SQL, (err, res) => {
            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '搜索失败',
                desc: err
              })
            } else {
              if (res && res.id !== modalParams.id) {
                this.$Message.warning({
                  content: '品名已存在'
                })
                this.modalBtnLoading = false
              } else {
                const SQL = `UPDATE GOODS SET
          name='${modalParams.name}'
          ,standard_buy_unit_price='${modalParams.standard_buy_unit_price}'
          ,standard_sell_unit_price='${modalParams.standard_sell_unit_price}'
          ,remark='${modalParams.remark}'
          ,update_time='${Date.now()}'
          WHERE id = ${modalParams.id}`
                this.$logger(SQL)
                this.$db.run(SQL, err => {
                  if (err) {
                    this.$logger(err)
                    this.$Notice.error({
                      title: '编辑失败',
                      desc: err
                    })
                  } else {
                    this.modalShow = false
                    this.$Message.success({
                      content: '编辑成功'
                    })
                    this.getDataList()
                  }
                  this.modalBtnLoading = false
                })
              }
            }
          })
        }
      })
    },
    enterConfirm (id) {
      if (id) {
        this.editConfirm()
      } else {
        this.addConfirm()
      }
    },
    // 删除
    del (row) {
      this.modalParams = {
        id: row.id,
        name: row.name,
        input: ''
      }
      this.delModalShow = true
    },
    //  删除确认
    delConfrim () {
      this.$db.serialize(() => {
        this.$db.run('BEGIN')
        // 删除所有明细
        const deleteDetailSQL = `DELETE FROM GOODS_DETAIL_LIST WHERE goods_id = ${this.modalParams.id}`
        this.$logger(deleteDetailSQL)
        this.$db.run(deleteDetailSQL, err => {
          if (err) {
            this.$logger(err)
            this.$db.run('ROLLBACK')
            this.$Notice.error({
              title: '删除失败',
              desc: err
            })
          }
        })
        const deleteSQL = `DELETE FROM GOODS WHERE id = ${this.modalParams.id}`
        this.$logger(deleteSQL)
        this.$db.run(deleteSQL, err => {
          if (err) {
            this.$logger(err)
            this.$db.run('ROLLBACK')
            this.$Notice.error({
              title: '删除失败',
              desc: err
            })
          }
        })
        this.$db.run('COMMIT')
        this.delModalShow = false
        this.$Message.success({
          content: '删除成功'
        })
        this.getDataList()
      })
    },
  }
})
</script>
