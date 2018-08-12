<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item" style="width: 200px;" v-model="listQuery.tagName" placeholder="标签名称"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" style="float: right" type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">创建标签</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签名称">
        <template slot-scope="scope">
          <span>{{scope.row.tagName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate()}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"
                     @click="updateTag(scope.row)" circle
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle
                     @click="removeTag(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="创建标签"
      :visible.sync="dialogVisible"
      width="30%"
      center
      @close="closeDialog"
    >
      <el-form :model="postForm" :rules="rules" ref="postForm" label-width="80px" size="mini">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="postForm.tagName"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveTag">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchTag, createTag, updateTag, deleteTag } from '@/api/tag'

  export default {
    name: 'tagList',
    components: {},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          tagName: ''
        },
        postForm: {
          id: null,
          tagName: ''
        },
        rules: {
          tagName: [{
            required: true,
            message: '请输入标签名',
            trigger: 'blur'
          }]
        },
        dialogVisible: false
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      /**
       * 标签列表
       * @returns {Promise<void>}
       */
      async getList() {
        this.listLoading = true
        try {
          const param = Object.assign(this.listQuery)
          const result = await fetchTag(param)
          this.list = result.data.data.list
          this.total = result.data.data.count
        } catch (e) {
          console.log(e)
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      },
      /**
       * 创建标签
       * @returns {Promise<void>}
       */
      async saveTag() {
        let message = ''
        const valid = await new Promise((resolve, reject) => {
          this.$refs.postForm.validate(valid => resolve(valid))
        })
        if (!valid) {
          return
        }
        try {
          this.postForm.tagType = 1
          if (this.postForm.id) {
            await updateTag(this.postForm.id, this.postForm)
            message = '修改成功'
          } else {
            await createTag(this.postForm)
            message = '创建成功'
          }
          this.$message.success(message)
          this.closeDialog()
          await this.getList()
        } catch (e) {
          console.log(e)
          message = '保存失败'
          this.$message.error(message)
        }
      },
      /**
       * 删除标签
       * @param id
       * @returns {Promise<void>}
       */
      async removeTag(id) {
        if (!id) {
          this.$message.error('id is required')
        }
        let message = ''
        try {
          await deleteTag(id)
          message = '删除成功'
          this.$message.success(message)
          await this.getList()
        } catch (e) {
          console.log(e)
          message = '删除失败'
          this.$message.error(message)
        }
      },
      updateTag(row) {
        this.postForm = row
        this.dialogVisible = true
      },
      closeDialog() {
        this.postForm = {
          id: null,
          tagName: ''
        }
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
