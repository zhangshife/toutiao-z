<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="resultCode === 1" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-if="resultCode === 2" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- 关注组件 -->
          <!-- <follow-user
            :author-id="article.aut_id"
            :is-followed="article.is_followed"
            @updateFollow="article.is_followed=$event"

          ></follow-user> -->
          <follow-user
            :author-id="article.aut_id"
            v-model="article.is_followed"

          ></follow-user>
          <!-- <van-button
          v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="isFollowLoading"

          >已关注</van-button>
          <van-button
          v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="isFollowLoading"

            >关注</van-button
          > -->

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div ref="content" class="article-content markdown-body" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论列表组件 -->
        <comment-list
        :sourceId="article.art_id"
        :list="commentList"
        @updateTotalCommentNum = "totalCommentNum = $event"
        @click-reply="onClickReply"
        ></comment-list>

        <!-- 评论弹框组件 -->
        <van-popup
          v-model="isCommentPostShow"
          position="bottom" :style="{ height:'15%' }">
          <comment-post
           @updateCommentList="onUpdateCommentList"
           :targetId="article.art_id"></comment-post>
          </van-popup>
        <!-- /评论弹框组件 -->

        <!--评论回复弹框组件 -->
        <!-- van-popup是懒渲染,
        没有打开就创建一次,
        打开过了,只不过是显示隐藏,里面的内容不更新
        用v-if="isReplyShow来解决"-->
        <van-popup
        v-model="isReplyShow"
        position="bottom"
        :style="{ height:'100%'}"
        >
        <!-- 评论回复组件 -->
        <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        :articleId="article.art_id"
        @click-close="isReplyShow = false"
        ></comment-reply>

        </van-popup>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button @click="isCommentPostShow=true" class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCommentNum" color="#777" />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <!-- 收藏组件 -->
          <article-collect
          v-model="article.is_collected"
          :articleId="article.art_id"
          ></article-collect>

          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <!-- 点赞组件 -->
          <article-like
           v-model="article.attitude"
          :articleId="article.art_id"
          ></article-like>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-if="resultCode === 3" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-if="resultCode === 4" @click="getLoadArticle" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import './github-markdown.css'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import ArticleCollect from '@/components/article-collect'
import ArticleLike from '@/components/article-like'
import commentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
// import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    ArticleCollect,
    ArticleLike,
    commentList,
    CommentPost,
    CommentReply
    // CommentReply
  },
  props: {
    // 定义props去接手动态路由的数据信息
    // 可以直接通过this.articleId读取动态路由数据
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      resultCode: 1, // 1表示加载中 2表示成功,3表示资源不存在,4表示错误
      article: {}, // 文章数据信息
      // isFollowLoading: false
      totalCommentNum: '',
      isCommentPostShow: false,
      commentList: [],
      isReplyShow: false, // 评论回复弹框为false
      currentComment: {} // 当前点击的品论信息

    }
  },
  computed: {},
  watch: {},
  created () {
    // 调用获取文章的方法
    this.getLoadArticle()
  },
  mounted () {},
  methods: {
    // 获取文章的方法
    async getLoadArticle () {
      try {
        // 测试代码
        // if (Math.random() > 0.5) {
        //   console.log(JSON.parse('asdfaf'))
        // }
        const { data: res } = await getArticleById(this.articleId)
        // console.log(res)
        // 赋值
        this.article = res.data
        // 成功获取数据
        this.resultCode = 2

        // 给所有图片绑定预览事件 (等到DOM渲染完成之后再做)
        this.bindImgClick()
      } catch (error) {
        // 测试代码
        // this.resultCode = 4

        if (error.response.status === 404) {
          // 资源不存在
          this.resultCode = 3
        } else {
          // 获取错误
          this.resultCode = 4
        }
        this.$toast.fail('获取文章失败')
      }
    },
    // 绑定图片预览功能
    bindImgClick () {
      this.$nextTick(() => {
        // 1找到所有文章正文里面的图片节点
        let imgNodes = this.$refs.content.getElementsByTagName('img')
        imgNodes = Array.from(imgNodes) // 节点集合编程数组
        // 2取出所有图片地址
        const imgURLs = imgNodes.map(val => val.src)
        // 3每个图片节点绑定事件
        imgNodes.forEach((img, index) => {
          img.onclick = function () {
            // 4调用图片预览器
            ImagePreview({
              images: imgURLs,
              startPosition: index
            })
          }
        })
      })
    },
    onUpdateCommentList (val) {
      // 接受comment-post组件传递过来的评论信息
      // 将其插入到commentList的顶部
      // 因为commentList和article-comment组件里的list是关联的,所以评论列表也是最新的
      this.commentList.unshift(val)
      // 关闭评论弹框
      this.isCommentPostShow = false
    },
    onClickReply (val) {
      console.log(val)
      this.isReplyShow = true // 弹框显示
      this.currentComment = val
    }
    //
    // 绑定关注事件
    // async onFollow () {
    //   // 开启
    //   this.isFollowLoading = true
    //   // 如果关注了就是取消关注,如果没有关乎就是要关注
    //   try {
    //     if (this.article.is_followed) {
    //     // 已关注,取消关注
    //       await deleteFollow(this.article.aut_id)
    //     } else {
    //     // 为关注,添加关注
    //       await addFollow(this.article.aut_id)
    //     }
    //     // 更新关注按钮
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (error) {
    //     console.log(error)
    //     if (error.response && error.response.status === 401) {
    //       this.$toast('请登录')
    //       // 跳转到登录页
    //       this.$router.push('/login')
    //     }
    //   }
    //   this.isFollowLoading = false
    // }
  }
}
</script>

<style scoped lang="scss">
// @import url("./github-markdown.css");
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    z-index: 3;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
