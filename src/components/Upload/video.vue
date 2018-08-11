<template>
  <div class="upload-container">
    <el-upload
      class="image-uploader"
      action="/api/video"
      drag
      :multiple="false"
      :show-file-list="false"
      :headers="uploadHeaders"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
    >

      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
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
      imageUrl() {
        return this.value
      }
    },
    data() {
      return {
        tempUrl: '',
        uploadHeaders: {
          [ACCESS_TOKEN_HEADER]: getAccessToken()
        }
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
        this.emitSuccess(res)
      },
      beforeUpload(file) {
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
      handleUploadError() {
        this.$message.error('上传失败')
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
    .image-uploader {
      width: 100%;
      float: left;
    }
    .image-preview {
      width: 200px;
      height: 200px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      margin-left: 50px;
      .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .image-preview-action {
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
        .image-preview-action {
          opacity: 1;
        }
      }
    }
    .image-app-preview {
      width: 320px;
      height: 180px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      margin-left: 50px;
      .app-fake-conver {
        height: 44px;
        position: absolute;
        width: 100%; // background: rgba(0, 0, 0, .1);
        text-align: center;
        line-height: 64px;
        color: #fff;
      }
    }
  }
</style>
