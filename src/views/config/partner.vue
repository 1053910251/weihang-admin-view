<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item" style="width: 200px;" v-model="listQuery.name" placeholder="合作伙伴"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" style="float: right" type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="合作伙伴">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="logo地址">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" v-if="scope.row.imageUrl">
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | formatDate()}}</span>
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
      title="新增合作伙伴"
      :visible.sync="dialogVisible"
      width="30%"
      center
      @close="closeDialog"
    >
      <el-form :model="postForm" :rules="rules" ref="postForm" label-width="80px" size="mini">
        <el-form-item label="合作伙伴" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>

        <el-form-item label="上传logo" prop="imageUrl">
          <single-image color="#1890ff" class="editor-upload-btn"
                        :value="postForm.imageUrl"
                        @upload-success="imageSuccessCBK"></single-image>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveconfig">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import SingleImage from '@/components/Upload/singleImage'
  import { fetchPartner, createPartner, updatePartner, deletePartner } from '@/api/partner'

  export default {
    name: 'configList',
    components: {
      SingleImage
    },
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
          imageUrl: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入合作伙伴名称',
            trigger: 'blur'
          }],
          imageUrl: [{
            required: true,
            message: '请输入logo地址',
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
       * 合作伙伴列表
       * @returns {Promise<void>}
       */
      async getList() {
        this.listLoading = true
        try {
          const param = Object.assign(this.listQuery)
          const result = await fetchPartner(param)
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
       * 创建合作伙伴
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
          if (this.postForm.id) {
            await updatePartner(this.postForm.id, this.postForm)
            message = '修改成功'
          } else {
            await createPartner(this.postForm)
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
       * 删除合作伙伴
       * @param id
       * @returns {Promise<void>}
       */
      async removeconfig(id) {
        if (!id) {
          this.$message.error('id is required')
        }
        let message = ''
        try {
          await deletePartner(id)
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
          imageUrl: ''
        }
        this.dialogVisible = false
      },
      imageSuccessCBK(path) {
        this.postForm.imageUrl = path
      }
    }
  }
</script>

<style scoped>

</style>
