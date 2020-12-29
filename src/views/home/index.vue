<template>
  <div class="home-container">
     <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to='/search'
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!--
      animated 滑动的动画
      border 底边框线
      swipeable 开启左右手势滑动
     -->
    <van-tabs  class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab v-for="(item,index) in userChannels" :key="index" :title="item.name">
        <!-- 列表组件 -->
        <article-list :channel="item"></article-list>
      </van-tab>
      <!-- 右侧自定义内容 -->
      <!-- 占位元素 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="isEditChannelShow=true">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

      <!-- 频道编辑 -->
     <van-popup
       class="edit-channel-popup"
       v-model="isEditChannelShow"
       position="bottom"
       :style="{ height: '100%' }"
       closeable
       close-icon-position="top-left"
     >
     <channel-edit
     :user-channels="userChannels"
     @update-index = "active = $event"
     @close = "isEditChannelShow=false"
     :activeIndex="active"

     ></channel-edit>

     </van-popup>
<!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannel } from '@/api/channel.js'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit

  },
  props: {},
  data () {
    return {
      active: 0, // 激活下标
      userChannels: [], // 用户频道数据
      isEditChannelShow: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 调用获取频道数据的方法
    this.loadUserChannel()
  },
  mounted () {

  },
  methods: {
    // 获取用户频道数据的方法
    async loadUserChannel () {
      try {
        // console.log(res)
        // const { data: res } = await getUserChannel()

        // this.userChannels = res.data.channels
        let channel = []
        // 判断是否登陆了
        if (this.$store.state.user) {
          // 登陆了
          // 获取线上的频道信息,请求,赋值
          const { data: res } = await getUserChannel()
          channel = res.data.channels
        } else {
          // 没有登录,判断本地是否有
          const localChannel = getItem('TOUTIAO_USER_CHANNEL')
          if (localChannel) {
            // 使用本地
            channel = localChannel
          } else {
            // 获取默认
            const { data: res } = await getUserChannel()
            channel = res.data.channels
          }
        }
        // 赋值
        this.userChannels = channel
      } catch (error) {
        this.$toast.fail('获取频道数据失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  // 深度选择器问题
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
   .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
  /deep/ .van-tab {
    border-right: 1px solid #edeff3;
    min-width: 200px;
  }
  /deep/ .van-tabs__line {
    width: 32px;
    height: 6px;
    background-color: #3296fa;
    bottom: 40px;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
