<template>
    <el-upload
      ref="upload"
      class="avatar-uploader camera-uploader"
      action="/pccartview/gfs/imgFileUp"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-change="changeUpload"
      :on-remove="handleRemove"
      >
      <template v-if="imageUrl">
        <div class="img-wrapper">
          <img  :src="imageUrl" class="avatar"/>
          <img  src="../../assets/images/watermark1.png" class="edit-icon   watermark-img"/>
          <img  src="../../assets/images/edit.png" class="edit-icon old-img"/>
        </div>
      </template>
      
      <div v-else class="camera-uploader-icon">
        <img src="../../assets/images/camera1.png"/>
        <p>{{uploadDesc}}</p>
      </div>
  </el-upload>                                
</template>
<script>
export default {
    props: ['uploadDesc','imgNum', 'allowancePicture'],
    data () {
        return {
            demo: true,
            imageUrl: '',
            imgthing: {},
            headerObj: {}
        }
    },
    mounted () {
    },
    watch: {
      imgNum (val) {
        // this.$refs.upload_2.clearFiles();
      }
    },
    methods: {
       handleRemove(file, fileList) {
        //  console.log(file);
        this.$refs.upload.clearFiles();
        this.imageUrl = ""
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = res.response.path
        // this.$emit('getImageUrl', res.response.waterPath, this.allowancePicture, this.imgNum)
        this.$emit('getImageUrl', res.response.path, this.allowancePicture, this.imgNum)
        
      },
      showPictureList (allowanceObj, num) {
        if (this.allowancePicture == 'allowanceOtherImg1' || this.allowancePicture == 'allowanceOtherImg2' || this.allowancePicture == 'allowanceOtherImg3') {
          this.imageUrl = allowanceObj.allowanceOtherImg
        }else {
          this.imageUrl = allowanceObj[this.allowancePicture]
        }
        
      },
      changeUpload () {
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isJPG) {
          this.$message.error('照片仅支持jpg、jpeg格式，请重新上传!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt10M;
      }
    
    }
}
</script>
<style>
    /* 身份证上传 */
    .avatar-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 178px;
    height: 178px;
    position: relative;
    margin: 10px;
    }
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    /* position: relative; */
    overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
    }
    .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    }
    .avatar {
    width: 178px;
    height: 178px;
    display: block;
    }
    .camera-uploader-icon {
    position: absolute;
    width: 100px;
    left: 50%;
    top:35%;
    margin-left: -50px;
    text-align: center;
    }
    .camera-uploader-icon p {
    color: #ccc;
    margin-top: 10px;
    }
    .edit-icon{
      position: absolute;
      top: 0;
      right: 5px;
    }
    .img-wrapper {
      position: relative;
      overflow: hidden;
    }
    .watermark-img {
      z-index: 100;
      width: 100%;
      height: 100%;
    }
    .old-img {
      z-index: 1;
    }
</style>
