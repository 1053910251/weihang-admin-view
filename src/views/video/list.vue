<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input class="filter-item" style="width: 200px;" v-model="listQuery.title" placeholder="视频名称"></el-input>
      <el-select class="filter-item" v-model="listQuery.state" clearable>
        <el-option v-for="item in stateOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" style="float: right" type="primary" size="small" icon="el-icon-upload2" @click="showUploadDialog">上传视频</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="上传时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate()}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{stateMap[scope.row.state].label || ''}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="视频名称">
        <template slot-scope="scope">
            <span @click="playVideo(scope.row)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-caret-right"
                     @click="playVideo(scope.row)" circle
          ></el-button>
          <el-button type="primary" icon="el-icon-check" circle
                     v-if="scope.row.state === 1"
                     @click="auditConfirm(scope.row.id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle
                     @click="deleteVideo(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="上传视频"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <video-upload @upload-success="uploadSuccess"></video-upload>
    </el-dialog>

    <el-dialog
      title="播放视频"
      :visible.sync="playDialogVisible"
    >
      <video :src="videoUrl" height="400" width="100%" controls>
        your browser does not support the video tag
      </video>
    </el-dialog>

  </div>
</template>

<script>
  import videoUpload from '@/components/Upload/video'
  import { fetchVideo, removeVideo, updateVideo } from '@/api/video'

  export default {
    components: {
      videoUpload
    },
    name: 'videoList',
    data() {
      const stateOptions = [{
        label: '待审核',
        value: '1'
      }, {
        label: '已审核',
        value: '2'
      }]
      return {
        uploadUrl: '/api/video',
        videoFlag: false, // 是否上传
        videoUploadPercent: 0, // 上传进度
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
        }, {}),
        dialogVisible: false,
        playDialogVisible: false,
        videoUrl: ''
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          const param = Object.assign(this.listQuery)
          const result = await fetchVideo(param)
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
      /**
       * 上传之前的校验
       * @param file
       * @returns {boolean}
       */
      beforeUploadVideo(file) {
        const isLt10M = file.size / (1024 * 1024) < 50
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过50MB哦!')
          return false
        }
      },
      /**
       * 展示弹窗
       */
      showUploadDialog() {
        this.dialogVisible = true
      },
      /**
       * 播放视频
       */
      playVideo(row) {
        if (!row.path) {
          this.$message.error('视频不存在')
          return
        }
        this.playDialogVisible = true
        this.videoUrl = row.path
      },
      /**
       * 删除视频
       */
      async deleteVideo(id) {
        if (!id) {
          this.$message.error('id not found')
          return
        }
        const action = await new Promise((resolve, reject) => {
          this.$confirm('是否删除这个视频，不可恢复', '删除视频', {
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
            await removeVideo(id)
            await this.getList()
            this.$message.info('删除成功')
          } catch (e) {
            console.log(e)
            this.$message.error('删除失败')
          }
        }
        console.log(action)
      },

      /**
       * 上传成功
       * @param res
       */
      async uploadSuccess(res) {
        console.log(res)
        this.$message.success('上传成功')
        this.dialogVisible = false
        await this.getList()
      },

      /**
       * 审核通过
       * @returns {Promise<void>}
       */
      async auditConfirm(id) {
        let message = ''
        try {
          await updateVideo(id, { state: 2 })
          message = '审核通过'
        } catch (e) {
          console.log(e)
          message = '审核失败'
        }
        this.$notify({
          title: '成功',
          message,
          type: 'success',
          duration: 2000
        })
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
