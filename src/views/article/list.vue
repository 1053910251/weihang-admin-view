<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input class="filter-item" style="width: 200px;" v-model="listQuery.title" placeholder="文章标题"></el-input>
      <el-select class="filter-item" v-model="listQuery.state" clearable>
        <el-option v-for="item in stateOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      <router-link to="/article/add">
        <el-button class="filter-item" style="float: right" type="primary" size="small" icon="el-icon-plus">新增文章</el-button>
      </router-link>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布日期">
        <template slot-scope="scope">
          <span>{{scope.row.publishTime | formatDate()}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{stateMap[scope.row.state].label || ''}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="文章标题">
        <template slot-scope="scope">

          <router-link class="link-type" :to="'/article/edit/'+scope.row.id">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle
                     @click="deleteArticle(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { fetchArticle, removeArticle } from '@/api/article'

  export default {
    name: 'articleList',
    data() {
      const stateOptions = [{
        label: '待审核',
        value: '1'
      }, {
        label: '已审核',
        value: '2'
      }]
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          title: '',
          state: ''
        },
        stateOptions,
        stateMap: stateOptions.reduce((prev, next) => {
          prev[next.value] = next
          return prev
        }, {})
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          const param = Object.assign({}, this.listQuery)
          console.log(param)
          const result = await fetchArticle(param)
          this.list = result.data.data.list
          this.total = result.data.data.count
        } catch (e) {
          console.log(e)
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      async deleteArticle(id) {
        if (!id) {
          this.$message.error('id not found')
          return
        }
        const action = await new Promise((resolve, reject) => {
          this.$confirm('是否删除这篇文章，不可恢复', '删除文章', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          })
            .then(() => {
              resolve('confirm')
            })
            .catch(action => {
              resolve(action)
            })
        })
        if (action === 'confirm') {
          try {
            await removeArticle(id)
            await this.getList()
            this.$message.info('删除成功')
          } catch (e) {
            console.log(e)
            this.$message.error('删除失败')
          }
        }
        console.log(action)
      },
      async handleSearch() {
        await this.getList()
      }
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .search-container {
    margin-bottom: 10px;
    float: right;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
