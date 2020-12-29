<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isEditShow && historyList.length">
        <span @click="delAllHistory">全部删除</span>
        <span @click="isEditShow=false">完成</span>
      </div>
      <van-icon v-else @click="isEditShow=true" name="delete" />
    </van-cell>
    <van-cell @click="onHistoryClick(item,index)" v-for="(item,index) in historyList" :key="index" :title="item">
      <van-icon name="close"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    // 从父组件获取历史记录
    historyList: {
      type: Array,
      required: true

    }
  },
  data () {
    return {
      isEditShow: false // 是否显示删除图标
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 历史记录点击事件
    onHistoryClick (val, index) {
      // 判断是否为编辑状态
      if (this.isEditShow) {
        // 编辑状态,那么就是删除操作
        this.historyList.splice(index, 1)
      } else {
        // 非编辑状态,那么就是点击某个历史记录去查询对应结果
        this.$emit('updateSearchText', val)
      }
    },
    // 全部删除
    delAllHistory () {
      this.historyList.splice(0, this.historyList.length)
    }
  }
}
</script>

<style scoped lang="scss"></style>
