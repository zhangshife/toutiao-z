<template>
  <div class="update-photo">
    <img :src="imgurl" ref="img" alt="" />
    <div class="toolabr">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="updatePhoto">确定</div>
    </div>
  </div>
</template>

<script>
// 导入裁剪插件样式和JS
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

import { updataUserPhoto } from '@/api/users'
export default {
  name: 'UpdatePhoto',
  props: {
    // 选择图片的预览地址
    imgurl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cropper: null // 图片剪切器
    }
  },
  mounted () {
    // 挂载
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 控制图片不让出容器
      dragMode: 'move', // move就是移动图片,如果是crop就是移动裁剪窗口
      aspectRatio: 1, //
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    // console.log(cropper)
  },
  methods: {
    // 上传图片
    updatePhoto () {
      this.$toast.loading({
        message: '处理中',
        duration: 0
      })
      // 获取裁剪后的图片信息
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // blob文件信息
      // 上传裁剪后的图片
        try {
          const fd = new FormData()
          fd.append('photo', blob)
          const { data: res } = await updataUserPhoto(fd)
          // console.log(res)
          this.$toast.success('更新头像成功')
          this.$emit('addUserPhoto', res.data.photo)
        } catch (error) {
          this.$toast.fail('更新头像失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  img {
    max-width: 100%;
  }
  .toolabr {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
  }
  .cancel,
  .confirm {
    width: 120px;
    height: 90px;
    font-size: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
