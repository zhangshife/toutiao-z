<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEditShow=!isEditShow"
      >{{isEditShow ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item,index) in userChannels"
        :key="index"
        @click="onUserChannelClick(item,index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-if="isEditShow&&item.name!=='推荐'"
        ></van-icon>
        <span
          class="text"
          slot="text"
          :class="{ active:activeIndex===index }"
        >{{ item.name }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        v-for="(item,index) in recommendChannels"
        :key="index"
        :text="item.name"
        @click="addToChannel(item)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
// 导入
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    // 我的频道数据,外部传入
    userChannels: {
      type: Array,
      required: true
    },
    // 激活下标,父组件传入
    activeIndex: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEditShow: false // 是否修改
    }
  },
  computed: {
    // 推荐频道 = 所有频道- 我的频道
    recommendChannels () {
      // 遍历所有频道,判断每个值是否存在于我的频道中,不存在就是推荐频道
      const channel = [] // 推荐频道
      this.allChannels.forEach(val => {
        // 判断val是否存在于我的频道中,如果不存在就放入channel
        const idx = this.userChannels.findIndex(item => item.id === val.id)
        if (idx === -1) {
          channel.push(val)
        }
      })
      return channel

      // 第二种方法
      // return this.allChannels.filter(item => {
      //   return this.userChannels.findIndex(userItem => {
      //     return userItem.id === item.id
      //   }) === -1
      // })
    }

  },
  watch: {},
  created () {
    // 调用获取所有频道的数据方法
    this.loadGetAllChannels()
  },
  mounted () {},
  methods: {
    async loadGetAllChannels () {
      try {
        const { data: res } = await getAllChannels()
        // console.log(res)
        this.allChannels = res.data.channels
      } catch (error) {
        this.$toast.fail('获取所有频道列表失败')
      }
    },
    // 向我的频道添加
    async addToChannel (value) {
      this.userChannels.push(value)
      // 数据持久化操作
      // 是否登录
      if (this.$store.state.user) {
        // 登陆了保存在线上
        try {
          await addUserChannel([{
            id: value.id, // 频道id
            seq: this.userChannels.length // 顺序序号
          }])
        } catch (error) {
          this.$toast.fail('保存失败')
        }
      } else {
        // 没有登录 保存在本地
        setItem('TOUTIAO_USER_CHANNEL', this.userChannels)
      }
    },
    // 用户频道点击
    async onUserChannelClick (val, idx) {
      // 判断是否处于编辑状态
      // 如果处于编辑状态就是删除,
      // 如果不是编辑状态,就是跳转到对应的tab
      if (this.isEditShow) {
        if (val.name !== '推荐') {
          if (idx <= this.activeIndex) { // 激活及激活左边被点击
          // 激活下标要向左走1位
            this.$emit('update-index', this.activeIndex - 1)
          }
          // 删除元素
          this.userChannels.splice(idx, 1)
          // 删除持久化操作
          // 是否登录,登录保存到线上(提交删除的信息)
          // 没登录保存到本地(保存删除后的列表)
          if (this.$store.state.user) {
            // 登陆了,同步线上
            try {
              await deleteUserChannel(val.id)
            } catch (error) {
              this.$toast.fail('删除失败')
            }
          } else {
            // 没有登录 保存在本地
            setItem('TOUTIAO_USER_CHANNEL', this.userChannels)
          }
        }
      } else {
        // 非编辑状态,执行切换频道操作
        // 通知父修改激活下标
        this.$emit('update-index', idx)
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
