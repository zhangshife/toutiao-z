<template>
   <van-button
          v-if="isFollowed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="isFollowLoading">已关注</van-button>
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

            >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/users'
export default {
  name: 'FollowUser',
  data () {
    return {
      isFollowLoading: false // 是否关注加载中

    }
  },
  // 自定义v-model关联的自定义属性名和自定义事件名
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'updateFollow' // 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    authorId: {
      type: [String, Number, Object],
      required: true
    }
  },
  methods: {
    // 绑定关注事件
    async onFollow () {
      // 开启
      this.isFollowLoading = true
      // 如果关注了就是取消关注,如果没有关乎就是要关注
      try {
        if (this.isFollowed) {
        // 已关注,取消关注
          await deleteFollow(this.authorId)
        } else {
        // 为关注,添加关注
          await addFollow(this.authorId)
        }
        // 通知父组件更新关注按钮
        // this.article.is_followed = !this.article.is_followed
        this.$emit('updateFollow', !this.isFollowed)
      } catch (error) {
        // console.log(error)
        if (error.response && error.response.status === 401) {
          this.$toast('请登录')
          // 跳转到登录页
          this.$router.push('/login')
        }
      }
      this.isFollowLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
