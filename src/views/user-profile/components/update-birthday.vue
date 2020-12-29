<template>
  <div class="update-birthday">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onSubmit"
        @cancel="$emit('close')"
      />
  </div>
</template>
<script>
import { updataUserMessage } from '@/api/users'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: [String, Number]
    }
  },
  data () {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: this.value ? new Date(this.value) : new Date()
    }
  },
  created () {},
  methods: {
    // 修改资料
    async onSubmit (val) {
      this.$toast.loading({
        message: '处理中',
        duration: 0
      })
      this.currentDate = dayjs(val).format('YYYY-MM-DD')
      try {
        const { data: res } = await updataUserMessage({
          birthday: this.currentDate
        })
        // console.log(res)
        this.$toast.success('更新成功')
        this.$emit('input', res.data.birthday)
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
    margin:30px;
    /deep/ .van-field__control{
        padding: 14px;
    }
}
</style>
