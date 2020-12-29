<template>
  <van-cell>
    <van-image
      slot="icon"
      round
      width="30"
      height="30"
      style="margin-right: 10px;"
      :src="comment.aut_photo"
    />
    <span style="color: #466b9d;" slot="title">{{ comment.aut_name }}</span>
    <div slot="label">
      <p style="color: #363636;">{{ comment.content }}</p>
      <p>
        <span style="margin-right: 10px;">{{
          comment.pubdate | relativeTime
        }}</span>
        <van-button size="mini" type="default" @click="$emit('click-replay',comment)"
          >回复({{ comment.reply_count }})</van-button
        >
      </p>
    </div>
    <!-- 点赞 -->
    <van-button
      @click="onCommentGood"
      class="like-btn"
      :class="{ liked: comment.is_liking }"
      icon="good-job-o"
      >{{ comment.like_count || "赞" }}</van-button
    >
    <!-- 点赞 -->
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 评论点赞
    async onCommentGood () {
      // console.log('1')
      try {
        // console.log(this.comment)
        // 点赞了  取消点赞
        if (this.comment.is_liking) {
          await deleteCommentLike(this.comment.com_id.toString())
          this.comment.like_count--
        } else {
          // 没有赞  点赞
          await addCommentLike(this.comment.com_id.toString())
          this.comment.like_count++
        }
        // 更新视图
        this.comment.is_liking = !this.comment.is_liking
      } catch (error) {
        // console.log(error)
        this.$toast.fail('点赞失败,请重试')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
}
.liked {
  color: cyan;
}
</style>
