<template>
  <div class="article-container">
    <div class="article-search-container">
      <el-form class="search-form" ref="searchForm" :inline="true" :model="searchForm" label-width="80px">
        <el-form-item prop="title" label="文章名称:">
          <el-input name="title" type="text" v-model="searchForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-table-container">
      <el-table :data="articleList" style="width: 100%">
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <tempalte slot-scope="scope">
            <el-button @click="showInfo(scope.row)" type="text" size="查看">查看</el-button>
          </tempalte>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    name: 'list',
    data() {
      return {
        searchForm: {
          title: ''
        },
        articleList: []
      }
    },
    methods: {
      /**
       * 查询列表
       */
      searchSubmit() {
        const { searchForm } = this.searchForm
        console.log(searchForm)
        this.articleList = [{
          title: '文章1',
          createTime: '2018-07-01'
        }]
      },

      /**
       * 查看详情
       * @param row
       */
      showInfo(row) {
        console.log(row)
      }
    }
  }
</script>

<style scoped>

</style>
