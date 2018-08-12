<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item" style="width: 200px;" v-model="listQuery.tagName" placeholder="标签名称"></el-input>
      <el-select class="filter-item" v-model="listQuery.state" clearable>
        <el-option v-for="item in stateOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" style="float: right" type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">创建标签</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{stateMap[scope.row.state] ? stateMap[scope.row.state].label : ''}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位名称">
        <template slot-scope="scope">
          <span>{{scope.row.jobName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位描述">
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span>{{scope.row.tag ? scope.row.tag.tagName : ''}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | formatDate()}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"
                     @click="updateJob(scope.row)" circle
          ></el-button>
          <el-button type="primary" icon="el-icon-check" circle
                     v-if="scope.row.state === 1"
                     @click="auditConfirm(scope.row.id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle
                     @click="removeJob(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="创建或修改职位"
      :visible.sync="dialogVisible"
      width="30%"
      center
      @close="closeDialog"
    >
      <el-form :model="postForm" :rules="rules" ref="postForm" label-width="80px" size="mini">
        <el-form-item label="职位名称" prop="jobName">
          <el-input v-model="postForm.jobName"></el-input>
        </el-form-item>

        <el-form-item label="职位描述" prop="desc">
          <el-input type="textarea" v-model="postForm.desc"></el-input>
        </el-form-item>

        <el-form-item label="职位标签" prop="tagId">
          <el-select v-model="postForm.tagId" clearable>
            <el-option v-for="item in tagOptions"
                       :key="item.id"
                       :label="item.tagName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item center>
          <el-button type="primary" @click="saveJob">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchJob, createJob, updateJob, deleteJob } from '@/api/job'
  import { fetchAllTag } from '@/api/tag'

  export default {
    name: 'jobList',
    components: {},
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
          jobName: '',
          state: null
        },
        postForm: {
          id: null,
          jobName: '',
          desc: '',
          tagId: ''
        },
        rules: {
          jobName: [{
            required: true,
            message: '请输入职位名称',
            trigger: 'blur'
          }],
          desc: [{
            required: true,
            message: '请输职位描述',
            trigger: 'blur'
          }],
          tagId: [{
            required: true,
            message: '请选择标签',
            trigger: 'blur'
          }]
        },
        dialogVisible: false,
        tagOptions: [],
        stateOptions,
        stateMap: stateOptions.reduce((prev, next) => {
          prev[next.value] = next
          return prev
        }, {})
      }
    },
    async created() {
      await this.getList()
      await this.fetchTagList()
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
       * 职位列表
       * @returns {Promise<void>}
       */
      async getList() {
        this.listLoading = true
        try {
          const param = Object.assign(this.listQuery)
          const result = await fetchJob(param)
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
       * 创建职位
       * @returns {Promise<void>}
       */
      async saveJob() {
        let message = ''
        const valid = await new Promise((resolve, reject) => {
          this.$refs.postForm.validate(valid => resolve(valid))
        })
        if (!valid) {
          return
        }
        try {
          if (this.postForm.id) {
            await updateJob(this.postForm.id, this.postForm)
            message = '修改成功'
          } else {
            await createJob(this.postForm)
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
       * 删除职位
       * @param id
       * @returns {Promise<void>}
       */
      async removeJob(id) {
        if (!id) {
          this.$message.error('id is required')
        }
        let message = ''
        try {
          await deleteJob(id)
          message = '删除成功'
          this.$message.success(message)
          await this.getList()
        } catch (e) {
          console.log(e)
          message = '删除失败'
          this.$message.error(message)
        }
      },
      updateJob(row) {
        this.postForm = row
        this.dialogVisible = true
      },
      closeDialog() {
        this.postForm = {
          id: null,
          jobName: '',
          desc: '',
          tagId: ''
        }
        this.dialogVisible = false
      },
      /**
       * 查询所有的标签数据
       * @returns {Promise<void>}
       */
      async fetchTagList() {
        try {
          const result = await fetchAllTag({ tagType: 1 })
          this.tagOptions = result.data.data
        } catch (e) {
          console.log(e)
          this.tagOptions = []
        }
      },
      /**
       * 审核通过
       * @param id
       * @returns {Promise<void>}
       */
      async auditConfirm(id) {
        let message = ''
        try {
          await updateJob(id, { state: 2 })
          message = '审核成功'
          this.$message.success(message)
          await this.getList()
        } catch (e) {
          console.log(e)
          message = '审核失败'
          this.$message.error(message)
        }
      }
    }
  }
</script>

<style scoped>

</style>
