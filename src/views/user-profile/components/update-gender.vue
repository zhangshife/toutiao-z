<template>
  <div>
    <van-picker
      title="选择性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      :default-index="value"
    />
  </div>
</template>

<script>
import { updataUserMessage } from '@/api/users'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女']
    }
  },
  methods: {
    async onConfirm (val, index) {
      this.$toast.loading({
        message: '处理中',
        duration: 0
      })
      try {
        await updataUserMessage({
          gender: index
        })
        // console.log(res)
        this.$toast.success('更新成功')
        this.$emit('input', index)
        // 关闭弹框
        this.$emit('close')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.field-wrap{
    margin:30px;
    /deep/ .van-field__control{
        padding: 14px;
    }
}
</style>
