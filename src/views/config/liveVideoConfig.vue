<template>
    <div class="app-container">
      <el-form :model="postForm" :rules="rules" ref="postForm" label-width="100px" size="mini">
        <el-form-item label="直播预览图" prop="imageUrl">
          <single-image color="#1890ff" class="editor-upload-btn"
                        :value="postForm.imageUrl"
                        @upload-success="imageSuccessCBK"></single-image>
        </el-form-item>

        <el-form-item label="rmtp地址" prop="rmtp">
          <el-input v-model="postForm.rmtp"></el-input>
        </el-form-item>

        <el-form-item label="http地址" prop="http">
          <el-input v-model="postForm.http"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveconfig">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import SingleImage from '@/components/Upload/singleImage'
  import { fetchConfig, createConfig, updateConfig } from '@/api/config'

  export default {
    name: 'live-video-config',
    components: {
      SingleImage
    },
    data() {
      return {
        config: {
          id: null,
          name: 'liveVideoConfig',
          value: ''
        },
        postForm: {
          imageUrl: '',
          rmtp: '',
          http: ''
        },
        rules: {
          name: [{
            imageUrl: true,
            message: '请上传图片',
            trigger: 'blur'
          }],
          rmtp: [{
            required: true,
            message: '请输入rmtp',
            trigger: 'blur'
          }],
          http: [{
            required: true,
            message: '请输入http',
            trigger: 'blur'
          }]
        }
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      async getList() {
        try {
          const param = {
            name: this.config.name
          }
          const result = await fetchConfig(param)
          const list = result.data.data.list
          try {
            if (list.length) {
              this.config.id = list[0].id
              this.config.value = list[0].value
            }
            if (this.config.value) {
              this.postForm = JSON.parse(this.config.value)
            }
          } catch (e) {
            console.log(e)
          }
        } catch (e) {
          console.log(e)
        }
      },
      async saveconfig() {
        let message = ''
        const valid = await new Promise((resolve, reject) => {
          this.$refs.postForm.validate(valid => resolve(valid))
        })
        if (!valid) {
          return
        }
        try {
          this.config.value = JSON.stringify(this.postForm)
          if (this.config.id) {
            await updateConfig(this.config.id, this.config)
            message = '修改成功'
          } else {
            const result = await createConfig(this.config)
            this.config.id = result.data.data.id
            message = '创建成功'
          }
          this.$message.success(message)
        } catch (e) {
          console.log(e)
          message = '保存失败'
          this.$message.error(message)
        }
      },
      /**
       */
      imageSuccessCBK(path) {
        this.postForm.imageUrl = path
      }
    }
  }
</script>

<style scoped>

</style>
