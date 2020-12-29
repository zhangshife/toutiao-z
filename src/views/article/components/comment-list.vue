<template>
  <div class="comment-list">
    <!-- van-list里的onLoad事件只有在可视范围内才会触发
    immediate-check是否在初始化时立即执行滚动位置检查 -->
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- <van-cell v-for="(item,index) in list" :key="index">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
            <van-button size="mini" type="default">回复({{item.reply_count}})</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell> -->
      <!-- 评论项组件 -->
      <comment-item
      @click-replay="$emit('click-reply',$event)"
      v-for="(item,index) in list" :key="index" :comment="item"

      ></comment-item>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  components: { CommentItem },
  name: 'CommentList',
  props: {
    // 文章Id或者评论Id
    sourceId: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    type: {
      type: String,
      default: 'a', // 默认是文章
      validate (val) {
        return ['a', 'c'].includes(val)
      }
    }
  },
  data () {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 页码数
      limit: 10 // 每页数量
    }
  },
  created () {
    // 主动触发onLoad事件,因为一些文章较长,
    // 所以van-list组价不在可视范围内,就不会触发
    // 手动打开等待框
    this.loading = true
    this.onLoad() // 页面一加载就调用onLoad事件
  },

  methods: {
    async onLoad () {
      try {
        // 1请求数据
        const { data: res } = await getComments({
          type: this.type, // a表示获取文章评论,c表示获取评论回复
          source: this.sourceId.toString(), // 文章ID或者评论ID
          offset: this.offset ? this.offset.toString() : this.offset, // 偏移量
          limit: this.limit // 每页数量
        })
        console.log(res)
        // 2.追加数据
        this.list.push(...res.data.results) // 和父组件共享数据列表
        // 将评论总数传递给父组件
        this.$emit('updateTotalCommentNum', res.data.total_count)
        // 3.关闭加载
        this.loading = false
        // 4判断会否结束
        if (res.data.results.length < this.limit) {
          // 没有数据
          this.finished = true
        } else {
          // 下一页的开始位置,最后UI个评论的ID
          this.offset = res.data.last_id
        }
      } catch (error) {
        this.$toast.fail('获取文章评论失败')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .publish-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .van-list {
    margin-bottom: 45px;
  }
</style>
