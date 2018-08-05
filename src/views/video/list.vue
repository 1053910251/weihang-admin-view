<template>
  <div class="app-container">

    <el-button size="small" type="primary" @click="showUploadDialog">上传视频</el-button>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="上传时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="视频名称">
        <template slot-scope="scope">
            <span @click="playVideo(scope.row)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-caret-right" @click="playVideo(scope.row)">preview</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="上传视频"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <video-upload></video-upload>
    </el-dialog>

    <el-dialog
      title="播放视频"
      :visible.sync="playDialogVisible"
    >
      <video :src="videoUrl" :muted="muteStatus" :autoplay="playStatus" height="400" width="100%">
        your browser does not support the video tag
        <span class="ico ico-sound" :class="{ active: isMute }" v-on:click="closeSoundClick()"></span>
        <span class="ico ico-skip"></span>
        <span class="el-icon-caret-right" :class="{ hide: isPlay }" v-on:click="playClick()"></span>
      </video>
    </el-dialog>

  </div>
</template>

<script>
  import videoUpload from '@/components/Upload/video'
  import { fetchVideo } from '@/api/video'

  export default {
    components: {
      videoUpload
    },
    name: 'videoList',
    data() {
      return {
        uploadUrl: '/api/video',
        videoFlag: false, // 是否上传
        videoUploadPercent: 0, // 上传进度
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogVisible: false,
        playDialogVisible: false,
        videoUrl: '',
        isMute: true,
        isPlay: false,
        playStatus: '',
        muteStatus: ''
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          const result = await fetchVideo()
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
        const isLt10M = file.size / (1024 * 1024) < 10
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过10MB哦!')
          return false
        }
      },
      /**
       * 上传进度
       * @param event
       * @param file
       * @param fileList
       */
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0)
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

      playClick() {
        this.isPlay = !this.isPlay
        this.playStatus = 'autoplay'
      },

      closeSoundClick() {
        this.isMute = !this.isMute
        if (this.isMute) {
          this.muteStatus = ''
        } else {
          this.muteStatus = 'muted'
        }
      }
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
