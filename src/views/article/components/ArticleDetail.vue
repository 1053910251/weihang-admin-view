<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <!--<PlatformDropdown v-model="postForm.platforms"/>-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-if="postForm.state === 1 && postForm.id" v-loading="loading" style="margin-left: 10px;" type="success" @click="auditConfirm">审核通过</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>

                <el-col :span="8">
                  <el-form-item label-width="73px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.publishTime" type="date" format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="73px" label="状态:" class="postInfo-container-item">
                    <el-select v-model="postForm.state" clearable>
                      <el-option v-for="item in stateOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容"
                    v-model="postForm.summary">
          </el-input>
          <span class="word-counter" v-show="summaryLength">{{summaryLength}}字</span>
        </el-form-item>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.content"/>
        </div>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { findArticleById, createArticle, updateArticle } from '@/api/article'
  import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

  const defaultForm = {
    status: 'draft',
    title: '', // 文章题目
    content: '', // 文章内容
    summary: '', // 文章摘要
    imageUrl: '', // 文章图片
    publishTime: undefined, // 前台展示时间
    id: undefined,
    state: 1
  }

  const stateOptions = [{
    label: '待审核',
    value: 1
  }, {
    label: '已审核',
    value: 2
  }]

  export default {
    name: 'articleDetail',
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback('')
        } else {
          callback()
        }
      }
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        userListOptions: [],
        rules: {
          imageUrl: [{ validator: validateRequire }],
          title: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }]
        },
        stateOptions
      }
    },
    computed: {
      summaryLength() {
        return this.postForm.summary.length
      }
    },
    created() {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
    },
    methods: {
      async fetchData(id) {
        this.loading = true
        try {
          const result = await findArticleById(id)
          this.postForm = result.data.data
        } catch (e) {
          console.log(e)
          this.$message.error('拉去数据失败')
        }
        this.loading = false
      },
      async submitForm() {
        const valid = await new Promise((resolve, reject) => {
          this.$refs.postForm.validate(valid => resolve(valid))
        })
        if (!valid) {
          return
        }
        this.loading = true
        let message = ''
        try {
          this.postForm.articleType = 1
          if (this.postForm.id) {
            await updateArticle(this.postForm.id, this.postForm)
            message = '修改文章成功'
          } else {
            const result = await createArticle(this.postForm)
            message = '发布文章成功'
            this.postForm.id = result.data.data.id
          }
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
        } catch (e) {
          console.log(e)
        }
        this.loading = false
      },

      /**
       * 审核通过
       * @returns {Promise<void>}
       */
      async auditConfirm() {
        let message = ''
        try {
          await updateArticle(this.postForm.id, { state: 2 })
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
