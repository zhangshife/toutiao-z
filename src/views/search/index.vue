<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @clear="isResultShow=false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result :search-text="searchText" v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion @updateSearchText='onSearch' :search-text="searchText" v-else-if="searchText" />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history @updateSearchText='onSearch' :history-list=historyList v-else />
    <!-- /搜索历史记录 -->

  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'Search',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    const historyList = getItem('TOUTIAO_HISTORY_LIST') || []
    return {
      // 输入的内容
      searchText: '',
      // 是否显示搜索结果
      isResultShow: false,
      historyList: historyList
    }
  },
  computed: {},
  watch: {
    // 监听历史记录数组的变化,变了就存储起来
    historyList: {
      handler () {
        setItem('TOUTIAO_HISTORY_LIST', this.historyList)
      }
    }

  },
  created () {},
  mounted () {},
  methods: {
    // 手机上按下entry出发的事件
    onSearch (val) {
      // console.log(val)
      // 设置给输入框
      this.searchText = val
      // 显示搜索结果
      this.isResultShow = true
      // 保存实例记录(没有保存过才保存)
      if (!this.historyList.includes(val)) {
        // 放入顶部
        this.historyList.unshift(this.searchText)
      }
    },
    // 点取消之后出发的事件
    onCancel () {
      this.$router.back()
    }
    // 搜索建议触发点击执行该函数
    // onupdateSearchText (val) {
    //   // 设置给输入框
    //   this.searchText = val
    //   // 搜索结果显示
    //   this.isResultShow = true
    // }

  }
}
</script>

<style scoped lang="scss">
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
