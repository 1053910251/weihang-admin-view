<template>
  <div class="upload-container">
    <el-upload
      class="video-uploader"
      action="/api/upload/video"
      drag
      :multiple="false"
      :show-file-list="false"
      :headers="uploadHeaders"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      v-loading="loading"
      v-show="!value.length"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="video-preview" v-show="value.length>1">
      <div class="video-preview-wrapper">
        <video :src="videoUrl" height="100" width="100%">
          your browser does not support the video tag
        </video>
        <div class="video-preview-action">
          <i @click="rmVideo" class="el-icon-delete"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ACCESS_TOKEN_HEADER, getAccessToken } from '@/utils/auth'

  export default {
    name: 'videoUpload',
    props: {
      value: String
    },
    computed: {
      videoUrl() {
        return this.value
      }
    },
    data() {
      return {
        uploadHeaders: {
          [ACCESS_TOKEN_HEADER]: getAccessToken()
        },
        loading: false
      }
    },
    methods: {
      rmImage() {
        this.emitInput('')
      },
      emitSuccess(res) {
        this.$emit('upload-success', res)
      },
      handleUploadSuccess(res) {
        this.loading = false
        this.emitSuccess(res.data.path || '')
      },
      beforeUpload(file) {
        const isLt10M = file.size / (1024 * 1024) < 100
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过100MB哦!')
          return false
        }
        this.loading = true
      },
      handleUploadError() {
        this.loading = false
        this.$message.error('上传失败')
      },
      rmVideo() {
        this.emitSuccess('')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .upload-container {
    width: 100%;
    position: relative;
    @include clearfix;
    .video-uploader {
      width: 100%;
      float: left;
    }
    .video-preview {
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      .video-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .video-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;
        .el-icon-delete {
          font-size: 36px;
        }
      }
      &:hover {
        .video-preview-action {
          opacity: 1;
        }
      }
    }
  }
</style>
