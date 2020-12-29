<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <input type="file" @change="changeFile" hidden ref="userimg">

    <!-- 个人信息 -->
    <van-cell class="avatar-cell"  @click="chooseImg" title="头像" is-link center>
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="userInfo.photo"
      />
    </van-cell>
    <van-cell title="昵称" @click="isShowEditName=true" :value="userInfo.name" is-link />
    <van-cell title="性别" @click="isShowEditGender=true" :value="userInfo.gender===0? '男':'女'" is-link />
    <van-cell title="生日" @click="isShowEditBirthday=true" :value="userInfo.birthday" is-link />
    <!-- /个人信息 -->

    <!-- 编辑头像弹出层 -->
    <van-popup v-model="isShowEditAvatar" position="bottom" :style="{height:'100%'}">
      <update-photo
      v-if="isShowEditAvatar"
       :imgurl="previewImgURL"
      @close="isShowEditAvatar=false"
      @addUserPhoto = "addUserPhoto"
      ></update-photo>
    </van-popup>

    <!-- 编辑昵称 -->
    <van-popup
    v-model="isShowEditName"
    position="bottom"
    :style="{height:'100%'}">
    <update-name
      v-if="isShowEditName"
      @close="isShowEditName=false"
      v-model="userInfo.name"
    ></update-name>
    </van-popup>

    <!-- 编辑性别弹出层 -->
    <van-popup
    v-model="isShowEditGender"
    position="bottom"
    :style="{height:'40%'}">
    <update-gender
      v-if="isShowEditGender"
      @close="isShowEditGender=false"
      v-model="userInfo.gender"
    ></update-gender>
    </van-popup>

    <!-- 编辑生日弹出层 -->
    <van-popup
    v-model="isShowEditBirthday"
    position="bottom"
    :style="{height:'50%'}">
    <update-birthday
      v-if="isShowEditBirthday"
      @close="isShowEditBirthday=false"
      v-model="userInfo.birthday"
    ></update-birthday>
    </van-popup>
  </div>
</template>

<script>
import { getUserInfoDetail } from '@/api/users'
import UpdatePhoto from './components/update-photo'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'

export default {
  name: 'UserProfile',
  components: {
    UpdatePhoto,
    UpdateName,
    UpdateGender,
    UpdateBirthday
  },
  props: {},
  data () {
    return {
      userInfo: [], // 用户资料
      isShowEditAvatar: false, // 控制编辑头像弹框的显示和隐藏
      previewImgURL: '',
      isShowEditName: false, // 控制编辑昵称弹框的显示和隐藏
      isShowEditGender: false, // 控制编辑性别弹框的显示和隐藏
      isShowEditBirthday: false // 控制编辑生日弹框的显示和隐藏
    }
  },
  computed: {},
  watch: {},
  created () {
    // 调用获取用户详细资料的方法
    this.loadingGetUserInfoDetail()
  },
  mounted () {},
  methods: {
    // 获取用户详细资料的方法
    async loadingGetUserInfoDetail () {
      try {
        const { data: res } = await getUserInfoDetail()
        // console.log(res)
        // 赋值
        this.userInfo = res.data
      } catch (error) {
        this.$toast.fail('获取用户资料错误')
      }
    },
    // 点击头像
    chooseImg () {
      // 点击相当于点击了input
      this.$refs.userimg.click()
    },
    // 文件发生了变化
    changeFile () {
      // console.log(this.$refs.userimg.files[0]) // 选择的文件信息
      // console.log(URL.createObjectURL(this.$refs.userimg.files[0])) // 预览地址
      const fileImgs = this.$refs.userimg.files
      if (fileImgs.length) {
        // 预览地址
        this.previewImgURL = URL.createObjectURL(fileImgs[0])
        // 打开弹框
        this.isShowEditAvatar = true
      }
    },
    // 更新头像资料
    addUserPhoto (val) {
      this.userInfo.photo = val
      // 关闭弹框
      this.isShowEditAvatar = false
    }
  }
}
</script>

<style scoped lang="scss">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
