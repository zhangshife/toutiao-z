<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon name="cross" slot="left" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" :show-error="false" ref="formRef">
      <van-field :rules="formRules.mobile" v-model="user.mobile" name="mobile" placeholder="请输入手机号" maxlength="11">
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>
      <van-field :rules="formRules.code" v-model="user.code" type="text" name="code" placeholder="请输入验证码" maxlength="6">
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-button v-if="isShowTime" class="send-sms-btn" native-type="button" round size="small" type="default" >
            <van-count-down @finish="isShowTime=false" :time="time" format="ss秒"/>
          </van-button>

          <!-- 发送验证码按钮 -->
          <van-button @click="onSendCode" class="send-sms-btn" native-type="button" round size="small" type="default">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
// 导入请求方法
import { userLogin, getPhoneSms } from '@/api/users'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      // 1.表单数据
      user: {
        mobile: '18805604142',
        code: '246810'
      },
      time: 1000 * 60,
      isShowTime: false,
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // values是表单提交的数据
    async onSubmit (values) {
      // console.log('submit', values)
      // 2.表单验证
      // 3.获取表单数据
      const user = this.user

      this.$toast.loading({
        message: '加载中...', // 提示文字
        forbidClick: true, // 防止背景点击
        duration: 0 // 0表示一直存在,后面如果再出现弹框就会关闭
      })
      try {
        // 4.发送请求
        const { data: res } = await userLogin(user)
        // 5处理请求结果
        this.$toast.success('登录成功')
        // 将信息存储到Vuex里和本地存储
        this.$store.commit('SET_USER', res.data)
        // 是否指定了跳转地址,如果地址了就跳转对应地址去,如果没有就返回
        if (this.$route.query.url) {
          this.$router.replace(this.$route.query.url)
        } else {
          // 跳转返回
          this.$router.back()
        }
        // this.$router.back()
        // console.log(res.data)
      } catch (error) {
        // 登录出错
        if (error.response.status === 400) {
          this.$totst.fail('验证码错伏')
        } else {
          this.$toast.fail('登录出错,稍后重试')
        }
      }
    },
    // 发送验证码
    async onSendCode () {
      // 验证手机号是否符合规则(手动自己判断一个字段是否符合效验规则)
      try {
        await this.$refs.formRef.validate('mobile')
      } catch (error) {
        this.$toast.fail('请检查手机号')
        return
      }
      // 让倒计时显示
      this.isShowTime = true

      try {
        // 发送验证码请求
        await getPhoneSms(this.user.mobile)
        // 处理结果
        this.$toast.success('发送成功')
      } catch (error) {
        // 发送错误
        if (error.response.status === 404) {
          this.$toast.fail('手机号错误')
        } else if (error.response.status === 429) {
          this.$toast.fail('发送频繁,稍后再试')
        } else {
          // 显示发送按钮
          this.isShowTime = false
          this.$toast.fail('发送出错,稍后再试')
          // console.log(error)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
