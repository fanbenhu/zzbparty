<template>
    <div class="login-background">
        
        <div class="body-box">
          <div class="main-box">
              <div class="logo">
                  <img id="logo" src="~@/assets/danghui.png" alt="electron-vue">
              </div>
              <div class="form">
                  
                  <Form ref="formInline" :model="formInline" :rules="ruleInline">
                      <Form-item prop="admin_name">
                          <Input type="text" v-model="formInline.admin_name" placeholder="账号/手机号" size="large">
                              <Icon type="ios-person-outline" slot="prepend"></Icon>
                          </Input>
                      </Form-item>
                      <Form-item prop="admin_pass">
                          <Input type="password" v-model="formInline.admin_pass" placeholder="请输入密码">
                              <Icon type="ios-lock-outline" slot="prepend"></Icon>
                          </Input>
                      </Form-item>
                      <Form-item>
                          <Button long type="primary" @click="handleSubmit('formInline')">登录</Button>
                      </Form-item>
                  </Form>
              </div>
          </div>
        </div>
    </div>
</template>
<script>
import util from "../utils/util"

export default {

  data () {
    return {
      formInline: {
        admin_name: '',
        admin_pass: ''
      },
      ruleInline: {
        admin_name: [
          { required: true, message: '请填写用户名或手机号', trigger: 'blur' }
        ],
        admin_pass: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  created(){

  },
  methods: {
    handleSubmit (name) {
      // this.$Message.success('登陆成功!')
      //             this.$router.push({path: '/base', query: {id: 'abc'}})
      //             return false;
      this.$refs[name].validate((valid) => {
        if (valid) {
          const SQL = `select * from ADMIN where admin_name = '${this.formInline.admin_name}' or mobile = '${this.formInline.admin_name}'`
          console.log(SQL)
          this.$db.get(SQL, (err, res) => {
            if (err) {
              this.$logger(err)
              this.$Notice.error({
                title: '搜索失败',
                desc: err
              })
            } else {
              if(res){
                let pwd = util.encryptPwd(this.formInline.admin_pass,res.salt_key);
                if(pwd == res.admin_pass){
                  this.$store.dispatch("init_user",res);
                  this.$adminLog.write({
                    text : '用户登陆,账号 :' + this.formInline.admin_name,
                    status : 1,
                    admin_id :res.id
                  })
                  
                  this.$Message.success('登陆成功!')
                  this.$router.push({path: '/base', query: {id: 'abc'}})
                  return false;
                }
              }
              this.$Message.error('账号或密码错误，请重试！');
              this.$adminLog.write({
                text : '用户登陆,账号 :' + this.formInline.admin_name,
                status : 0,
                admin_id :0
              })
            
            }
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },

    
  }
}
</script>
<style lang="less">
    @import "../assets/less/global.less";
    #particles-js {
      width: 100%;
      height: calc(100% - 100px);
      position: absolute;
    }
    
    .login-background {
        position: relative;
        background-image: url(../assets/bg.jpg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // background-color: @bg-color;
       
        .body-box{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            // background-color: #fff;
            .main-box{
                width: 40%;
                min-width: 400px;
                max-width: 500px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;;
                background-color: @bg-color;
                padding: 40px;
                border-radius: 10px;
                .logo{
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f00;
                    border-radius: 10px;
                    img{
                        width: 70%;
                    }
                }
                .form{
                    width: 80%;
                    margin-top: 30px;
                    text-align: center;
                }
            }
        }
    }
</style>
