<template>
  <div class="article-list">
     <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
     <!-- 下拉刷新 -->
     <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
     :success-text="successText"
     success-duration="1000"
     >
         <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败,点击重新加载"
    >
      <!-- <van-cell v-for="(item,index) in list" :key="index" :title="item.title" /> -->
      <article-item v-for="(item,index) in list" :key="index" :article="item">

      </article-item>
        </van-list>
     </van-pull-refresh>

  </div>
</template>

<script>
// 导入
import { getArticleList } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    // 定义自定义属性接受自己的频道信息
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: Date.now(), // 当前时间戳
      error: false,
      isLoading: false, // 是否正在下拉加载
      successText: '' // 成功的提示文字
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      // console.log('111')
      try {
        // 测试代码
        if (Math.random() > 0.5) {
          console.log(JSON.parse('abc'))
        }
        // 1. 请求获取数据
        const { data: res } = await getArticleList({
          channel_id: this.channel.id, // 频道Id
          timestamp: this.timestamp,
          with_top: 1
        })
        // console.log(res)
        // 2.设置给列表数据(追加数据,不能复制,否则会死循环)
        this.list.push(...res.data.results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        // 返回的长度小于10就说明这是最后一页
        if (res.data.results.length < 10) {
          this.finished = true
        } else {
          // 还有数据,就设置下页数据的页码时间戳
          this.timestamp = res.data.pre_timestamp
        }
      } catch (error) {
        this.$toast.fail('获取列表数据失败')
        this.error = true // 出错了
        this.loading = false // 出错了也要甘比加载框
      }
    },
    // 下拉刷新函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data: res } = await getArticleList({
          channel_id: this.channel.id, // 频道Id
          timestamp: Date.now(), // 最新数据就是传入当前时间戳
          with_top: 1
        })
        console.log(res)
        // 2.设置给列表数据(追加数据,不能复制,否则会死循环)
        this.list.unshift(...res.data.results)
        this.successText = `以为刷新${res.data.results.length}条数据`
      } catch (error) {
        this.$toast.fail('获取列表数据失败')
      }
      // 无论成功还是失败都要关闭下拉刷新
      this.isLoading = false
    }
  }

}
</script>

<style scoped lang="scss">
.article-list{
  overflow-y: scroll;
  height: 79vh;
}
</style>
