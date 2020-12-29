<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(item,index) in resultlist" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      resultlist: [],
      loading: false,
      finished: false,
      pagenum: 1,
      pagesize: 10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // console.log(this.searchText)
      try {
        // 1请求数据
        const { data: res } = await getSearchResult({
          page: this.pagenum,
          per_page: this.pagesize,
          q: this.searchText
        })
        console.log(res)
        // 2.追加赋值给列表
        this.resultlist.push(...res.data.results)
        // 3关闭加载框
        this.loading = false
        // 4判断所有是否完成
        if (res.data.results.length < this.pagesize) {
          this.finished = true
        } else {
          this.pagenum++
        }
      } catch (error) {
        this.$toast.fail('查询失败')
      }
    }
  }

}
</script>

<style scoped lang="scss"></style>
