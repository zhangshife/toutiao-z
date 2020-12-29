<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count===0? '暂无回复':`${comment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('click-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <comment-item :comment="comment"></comment-item>
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <comment-list :list= "commentList" :sourceId="comment.com_id" type="c"></comment-list>
    <!-- /评论的回复列表 -->

    <!-- 评论回复弹框组件 -->
     <van-popup
          v-model="isCommentPostShow"
          position="bottom" :style="{ height:'15%' }">
            <comment-post
            v-if="isCommentPostShow"
           @updateCommentList="onUpdateCommentList"
           :targetId="comment.com_id"
           :articleId="articleId"
           ></comment-post>
          </van-popup>

    <!-- 底部 -->
     <div class="post-wrap">
      <van-button class="post-btn" size="small" @click="isCommentPostShow=true">写评论</van-button>
    </div>
    <!-- /底部 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {

    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [String, Number, Object]
    }

  },
  data () {
    return {
      isCommentPostShow: false, // 评论回复弹框默认关闭
      // 定义一个commentList和子组件共享评论列表
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onUpdateCommentList (val) {
      // 将comment-post组建传递进入的数据,发放入commentList数组的顶部
      // commentList和组件comment-list里面的list是共享的,从而实现了列表的共享
      this.commentList.unshift(val)
      // 更新回复条数
      this.comment.reply_count++
      // 关闭回复弹框
      this.isCommentPostShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.post-wrap{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.17333rem;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    background-color: #fff;
    border-top: 0.01333rem solid #d8d8d8;
    .post-btn{
      width: 60%;
    }
}
</style>
