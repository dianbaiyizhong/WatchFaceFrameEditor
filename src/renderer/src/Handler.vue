<template>

  <v-layout ref="app" class="rounded rounded-md border">
    <v-main class="d-flex align-center justify-center">
      <v-container>
        <v-number-input
            :reverse="false"
            v-model="formData.frameRate"
            controlVariant="default"
            label="请输入帧率，默认是15"
            :hideInput="false"
            :inset="false"
        ></v-number-input>
        <ImagePlayer ref="imagePlayer"></ImagePlayer>
      </v-container>
    </v-main>

    <v-footer color="surface-light" name="footer" app>
      <v-btn class="mt-2" color="primary" @click="updateFrameRate">确定修改</v-btn>
      &nbsp; &nbsp; &nbsp;
      <v-btn class="mt-2" type="submit" @click="back">返回</v-btn>

    </v-footer>
  </v-layout>


</template>

<script>
import ImagePlayer from "./components/ImagePlayer.vue";
import {useRoute} from 'vue-router';


export default {
  components: {
    ImagePlayer
  },
  data() {
    return {
      formData: {
        frameRate: 15
      },
    }
  },
  created() {
    const that = this

    //

  },

  methods: {
    updateFrameRate() {
      const that = this
      that.$refs.imagePlayer.setFrameRate(this.formData.frameRate)


    },
    back() {
      const that = this
      const route = useRoute();
      that.$refs.imagePlayer.stop()
      window.history.back();

    }
  },
  mounted() {
    const that = this
    // 在渲染进程中监听loadImages事件
    const route = useRoute();
    that.$refs.imagePlayer.play(route.query.imgs)
  }

}
</script>


<style scoped lang="less">

</style>