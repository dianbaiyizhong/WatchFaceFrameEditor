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
      <v-btn class="mt-2" color="primary">确定修改</v-btn>
      &nbsp; &nbsp; &nbsp;
      <v-btn class="mt-2" type="submit">返回</v-btn>

    </v-footer>
  </v-layout>


</template>

<script>
import ImagePlayer from "./components/ImagePlayer.vue";

export default {
  components: {
    ImagePlayer
  },
  data() {
    return {
      formData: {
        frameRate: 30
      },
    }
  }

}
</script>


<style scoped lang="less">

</style>