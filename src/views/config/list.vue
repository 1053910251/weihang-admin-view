<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item" style="width: 200px;" v-model="listQuery.name" placeholder="配置名称"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" style="float: right" type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">创建配置</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="配置名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="配置值">
        <template slot-scope="scope">
          <span>{{scope.row.value}}</span>
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
                     @click="updateconfig(scope.row)" circle
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle
                     @click="removeconfig(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="创建配置"
      :visible.sync="dialogVisible"
      width="30%"
      center
      @close="closeDialog"
    >
      <el-form :model="postForm" :rules="rules" ref="postForm" label-width="80px" size="mini">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>

        <el-form-item label="配置值" prop="value">
          <el-input v-model="postForm.value"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveconfig">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchConfig, createConfig, updateConfig, deleteConfig } from '@/api/config'

  export default {
    name: 'configList',
    components: {},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          name: ''
        },
        postForm: {
          id: null,
          name: '',
          value: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入配置名',
            trigger: 'blur'
          }],
          value: [{
            required: true,
            message: '请输入配置值',
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
       * 配置列表
       * @returns {Promise<void>}
       */
      async getList() {
        this.listLoading = true
        try {
          const param = Object.assign(this.listQuery)
          const result = await fetchConfig(param)
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
       * 创建配置
       * @returns {Promise<void>}
       */
      async saveconfig() {
        let message = ''
        const valid = await new Promise((resolve, reject) => {
          this.$refs.postForm.validate(valid => resolve(valid))
        })
        if (!valid) {
          return
        }
        try {
          this.postForm.configType = 1
          if (this.postForm.id) {
            await updateConfig(this.postForm.id, this.postForm)
            message = '修改成功'
          } else {
            await createConfig(this.postForm)
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
      async removeconfig(id) {
        if (!id) {
          this.$message.error('id is required')
        }
        let message = ''
        try {
          await deleteConfig(id)
          message = '删除成功'
          this.$message.success(message)
          await this.getList()
        } catch (e) {
          console.log(e)
          message = '删除失败'
          this.$message.error(message)
        }
      },
      updateconfig(row) {
        this.postForm = row
        this.dialogVisible = true
      },
      closeDialog() {
        this.postForm = {
          id: null,
          name: '',
          value: ''
        }
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
