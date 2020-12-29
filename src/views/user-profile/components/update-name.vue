<template>
  <div class="update-name">
      <!-- 导航栏 -->
      <van-nav-bar
        title="设置昵称"
        left-text="取消"
        right-text="确定"
        @click-left="$emit('close')"
        @click-right="onSubmit"
      />
      <!-- 输入框 -->
      <div class="field-wrap">
          <van-field
            v-model.trim="localName"
            row="2"
            autosize
            type="textarea"
            maxlength="7"
            placeholder="请输入昵称"
            show-word-limit
          />
      </div>
  </div>
</template>
<script>
import { updataUserMessage } from '@/api/users'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    // console.log(this.value) 拿到原来的昵称
    return {
      localName: this.value
    }
  },
  created () {},
  methods: {
    // 修改资料
    async onSubmit () {
      this.$toast.loading({
        message: '处理中',
        duration: 0
      })
      try {
        const { data: res } = await updataUserMessage({
          name: this.localName
        })
        // console.log(res)
        this.$toast.success('更新成功')
        this.$emit('input', res.data.name)
        // 关闭弹框
        this.$emit('close')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
.field-wrap{
    border:1px solid #aaa;
    margin:30px;
    /deep/ .van-field__control{
        padding: 14px;
    }
}
</style>
