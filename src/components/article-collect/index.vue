<template>
  <van-icon
  :color="value ? '#3296fa':'#777'"
  :name="value ? 'star':'star-o'"
  @click="onCollect"
  :loading="collectLoading"
   />

</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'ArticleCollect',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },

  data () {
    return {
      collectLoading: false
    }
  },
  methods: {
    async onCollect () {
      this.collectLoading = true // 显示加载中
      try {
        // 判断是否收藏
        if (this.value) {
        // 收藏,要取消收藏
          await deleteCollect(this.articleId.toString())
        } else {
        // 未收藏,收藏
          await addCollect(this.articleId.toString())
        }
        // 提示框
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
        // 通知父组件更细收藏按钮
        this.$emit('input', !this.value)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast('请登录')
          // 跳转到登录页
          this.$router.push('/login')
        }
      }
      this.collectLoading = false
    }
  }
}
</script>
