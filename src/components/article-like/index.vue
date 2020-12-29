<template>
  <van-icon
  :color="value===1 ? '#3296fa':'#777'"
  :name="value===1 ? 'good-job':'good-job-o'"
  @click="onLike"
  :loading="goodLoading"
   />

</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'ArticleLike',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },

  data () {
    return {
      goodLoading: false
    }
  },
  methods: {
    async onLike () {
      this.goodLoading = true // 显示加载中
      try {
        let articleLike = 1
        // 判断是否点赞
        if (this.value === 1) {
        // 点赞了,取消点赞
          await deleteLike(this.articleId.toString())
          articleLike = -1
        } else {
        // 未点赞,点赞
          await addLike(this.articleId.toString())
        }
        // 提示框
        this.$toast.success(this.value === 1 ? '取消点赞' : '点赞成功')
        // 通知父组件更新点赞按钮
        this.$emit('input', articleLike)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast('请登录')
          // 跳转到登录页
          this.$router.push('/login')
        }
      }
      this.goodLoading = false
    }
  }
}
</script>
