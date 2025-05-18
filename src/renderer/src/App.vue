<template>

  <vue-dropzone id="vd" class="ripple"
                @mouseleave="mouseleave" @mouseenter="mouseenter"
                @vdropzone-file-added="addFileEvent" @vdropzone-drop="dragOver" ref="vd"
                :options="dropzoneOptions" :useCustomSlot="true">
    <div class="dropzone-custom-content">
      <img src="./assets/android.svg"/>

      <div class="main">
          <span style="font-size:24px;color:#393939">
            <span class="dropzone-custom-title">
              <FontAwesomeIcon class="icon-red" :icon="['fas','caret-right']"/> 拖拽APK文件
            </span> 上传
            <span class="subtitle">(或点击)</span> <br/>
          </span>
        <font-awesome-icon class="icon-blue fa-4x" :icon="['fas', 'cloud-arrow-up']"/>
      </div>
    </div>
  </vue-dropzone>

</template>


<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import Waves from "node-waves";
import vueDropzone from 'vue2-dropzone-vue3'
import ImagePlayer from "./components/ImagePlayer.vue";
import { useRouter } from "vue-router";

export default {
  components: {vueDropzone, FontAwesomeIcon, ImagePlayer},
  data() {
    return {

      dropzoneOptions: {
        url: "#",
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        maxFilesize: 10000, //单位：MB
        maxFiles: 1,
        autoProcessQueue: false, // 关闭自动上传
        addRemoveLinks: true,
        dictRemoveFile: "移除文件",
        dictFileTooBig:
            "文件大小过大 ({{filesize}}MiB). 最大限制: {{maxFilesize}}MiB.",
        accept: function (file, done) {
          done()
        },
      },
    }
  },

  methods: {
    mouseenter(e) {
      Waves.ripple(e.target, {
        wait: 1000, position: {
          x: e.x, //px
          y: e.y  //px
        }
      })
      let that = this
      // that.$refs.player.play()
    },

    mouseleave(e) {
      Waves.calm(e.target)
    },

    async addFileEvent(file) {
      let that = this
      // file.previewElement.querySelector("img").src = "/jar-open-file-format.png"
      let configs = {
        headers: {"Content-Type": "multipart/form-data"},
        onUploadProgress: (progressEvent) => {
          let persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0 //上传进度百分比
          let span = file.previewElement.querySelector(".dz-upload")
          span.style.width = persent + "%"
        },
      }

      // that.$refs.vd.processQueue()


      // 读取文件内容为 Buffer
      const buffer = await file.arrayBuffer().then(buf => Buffer.from(buf));

      // 发送文件名和二进制数据到主进程
      window.electron.ipcRenderer.send('save-file', {
        fileName: file.name,
        fileData: buffer
      });


      let span = file.previewElement.querySelector(".dz-upload")
      span.style.width = 100 + "%"
      file.previewElement.classList.add("dz-success")


    },
    dragOver() {
      // 上传之前清空队列
      this.$refs.vd.removeAllFiles()
    },
  },
  mounted() {
    const that = this
    Waves.init({
      duration: 1000,
    })
    Waves.attach('.ripple')
    const router = useRouter();

    window.electron.ipcRenderer.on('loadImages', (event, data) => {
      // 根据接收到的数据更新UI

      router.push({
        name: 'Handler',
        query: { imgs: data }
      });


    });


  }
}

</script>


<style lang="less">

.dropzone-custom-content {
  height: calc(100vh - 20px);
  display: grid;

  img {
    grid-area: 1 / 1; /* 与元素A同一单元格 */
    justify-self: end; /* 水平靠右 */
    align-self: end; /* 垂直靠下 */
    margin: 0px; /* 可选的边距 */
    width: 300px;
    opacity: 0.5;
  }

  .main {
    grid-area: 1 / 1; /* 占据第一行第一列 */
    justify-self: center; /* 水平居中 */
    align-self: center; /* 垂直居中 */
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vue-dropzone {
  display: grid;
  height: calc(100vh - 20px);

  .dz-message {
    height: 100%;
    margin: 0;

    //:hover {
    //  background: #f1f1f1;
    //}
  }

  .dz-preview > dz-details {
    background-color: rgba(255, 255, 255, 0);
  }

  .dz-preview {
    grid-area: 1 / 1; /* 占据第一行第一列 */
    justify-self: center; /* 水平居中 */
    align-self: center; /* 垂直居中 */

    .dz-success-mark {

      animation: slideIn 1s ease-out forwards !important;
      margin-left: -27px !important;
      margin-top: -27px !important;
      width: auto !important;
      top: 50% !important;
      left: 50% !important;
      z-index: 1000;
    }
  }

  .dz-preview > .dz-image > img {
    width: 200px;
  }

  border: 2px dashed #d3d3d3 !important;
  border-radius: 5px;
  background: #f7f7f7;
  padding: 0;

  .icon-blue {
    color: #478fca !important;
    opacity: 0.7;
    margin-top: 8px;
  }

  .icon-red {
    color: #dd5a43 !important;
  }

  .dropzone-custom-title {
    margin-top: 0;
    font-weight: bolder;
    font-size: 36px;
    color: #555;
  }

  .subtitle {
    color: #777 !important;
  }
}


</style>
