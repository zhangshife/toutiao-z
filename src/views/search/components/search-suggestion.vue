<template>
  <div class="search-suggestion">
    <van-cell @click="$emit('updateSearchText',item)" v-for="(item,index) in suggestionList" :key="index"  icon="search">
      <div slot="title" v-html="highlight(item)"></div>

    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getSearchSuggestion } from '@/api/search'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    // 父组件的搜索内容
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 搜索建议列表
      suggestionList: []
    }
  },
  computed: {},
  watch: {
    // 监听输入内容的变化
    searchText: {
      // handler (newval) {
      //   this.loadSuggestion()
      // },
      handler: debounce(function () {
        this.loadSuggestion()
        // console.log(this.searchText)
      }, 1000),
      // 第一次就执行
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 获取联想建议
    async loadSuggestion () {
      try {
        const { data: res } = await getSearchSuggestion(this.searchText)
        // console.log(res)
        // 赋值
        this.suggestionList = res.data.options
      } catch (error) {
        this.$toast.fail('获取联想建议失败')
      }
    },
    // 高亮处理函数
    highlight (val) {
      // 设置一个正则,根据搜索关键字匹配,忽略大小写,全局匹配
      const reg = new RegExp(this.searchText, 'gi')
      // 将搜索关键字变成带上span的搜索关键字进行替换
      const newStr = val.replace(reg, `<span style="color:red">${this.searchText}</span>`)
      return newStr
    }
  }
}
</script>

<style scoped lang="less"></style>
