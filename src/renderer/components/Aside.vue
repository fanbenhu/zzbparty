<style lang="less">
    @import "../assets/less/global.less";

    aside {
        position: relative;
        background-color: @aside-color;
        box-shadow: 0 0 7px #000;
        .layout-menu-left {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 50px;
        }
        .aside-drop-menu {
            position: absolute;
            height: 35px;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            .ivu-dropdown {
                .ivu-dropdown-rel {
                    cursor: pointer;
                }
            }
        }
    }

    .aboutText {
        p {
            line-height: 26px;
        }
    }

    .psText {
        margin-top: 20px;
    }

</style>

<template>
    <aside>
        <Menu ref="menu" @on-select="selectMenu"
              theme="dark" width="100%" :active-name="activeMenuName" accordion class="layout-menu-left">
            <Menu-item v-for="(menu, index) in MENU" :name="menu.path" :key="index">
                <Tooltip :content="menu.title" placement="right" :delay="800">
                    <Icon :type="menu.icon" :size="20"></Icon>
                </Tooltip>
            </Menu-item>
        </Menu>
        <div class="aside-drop-menu">
            <Dropdown trigger="click" placement="top-start" @on-click="dropMenuClick">
                  <Icon type="md-settings" :size="20" color="white"></Icon>
                  <DropdownMenu slot="list">
                      <!-- <DropdownItem name="resetpwd">
                        <Icon type="md-lock" :size="14"></Icon>
                        修改密码<Icon type="ios-grid" />
                      </DropdownItem> -->

                      <DropdownItem name="logout">
                        <Icon type="md-exit" :size="14" color="red"></Icon>
                        退出登陆
                      </DropdownItem>
                      <DropdownItem name="update">
                          <Icon type="ios-cloud-download" :size="14"></Icon>
                          手动更新
                      </DropdownItem>
                      <Dropdown-item name="about">
                        <Icon type="ios-alert" :size="14"></Icon>
                        意见反馈
                      </Dropdown-item>
                  </DropdownMenu>
              </Dropdown>
        </div>
        <Modal
            v-model="modalShow"
            title="意见反馈">
            <div class="aboutText">
                <p>如果您有BUG反馈、意见或建议，请联系我。</p>
                <p>我的邮箱：<strong>460175121@qq.com</strong></p>
            </div>
            <div class="psText">
                <p></p>
            </div>
            <div slot="footer">
                <Button @click="modalShow = false">
                    关闭
                </Button>
            </div>
        </Modal>

        <Modal
            v-model="modalShowUpdate"
            title="手动更新">
            <div class="aboutText">
                <p><strong>当前版本号 {{version}}</strong></p>
                <p>功能暂未完善</p>
            </div>
            <div class="psText">
                <p></p>
            </div>
            <div slot="footer">
                <Button @click="modalShowUpdate = false">
                    关闭
                </Button>
            </div>
        </Modal>
    </aside>
</template>

<script>
import MENU from '../menu'
import packageJson from '../../../package.json'
import { docDir } from '../utils/settings'

export default {
  data () {
    return {
      MENU,
      activeMenuName: '',
      modalShow: false,
      modalShowUpdate: false,
      version: packageJson.version,
      docDir
    }
  },
  methods: {
    selectMenu (path) {
      this.$router.push({ path })
    },
    dropMenuClick (name) {
      switch (name) {
        case 'update':
          this.modalShowUpdate = true
          break
        case 'about':
          this.modalShow = true
          break
        case 'resetpwd':
          console.log('resetPWD')
          break
        case 'logout':
          this.$router.push({path: '/'})
          break
        default:
          break
      }
    },
    openUrl (url) {
      this.$electron.shell.openExternal(url)
    },
    openPath (path) {
      this.$electron.shell.openItem(path)
    }
  },
  watch: {
    $route () {
      this.activeMenuName = this.$route.path
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName()
      })
    }
  },
  created () {
    this.activeMenuName = this.$route.path
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName()
    })
  }
}
</script>
