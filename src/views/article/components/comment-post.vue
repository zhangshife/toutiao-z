<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      :disabled="!message.length"
      @click="onSendComment"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    // 文章Id或评论ID
    targetId: {
      type: [String, Number, Object],
      required: true
    },
    articleId: {
      type: [String, Number, Object]

    }
  },
  data () {
    return {
      message: '' // 绑定的数量
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 发布评论
    async onSendComment () {
      try {
        const { data: res } = await addComment({
          target: this.targetId.toString(),
          content: this.message,
          // art_id: null // 文章Id
          art_id: this.articleId ? this.articleId.toString() : null
        })
        console.log(res)
        this.$toast.success('文章发布成功')
        // 将最新的数据传递给父组件,父组件设置给commentList
        this.$emit('updateCommentList', res.data.new_obj)
        // 清空输入框
        this.message = ''
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录')
          this.$router.push('/login')
        } else if (error.response && error.response.status === 403) {
          this.$toast.fail('关闭评论')
        } else {
          this.$toast.fail('发布评论失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
