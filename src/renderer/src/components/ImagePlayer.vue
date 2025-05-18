<template>
  <div>
    <canvas id="animationCanvas" ref="canvas" width="300" height="300"></canvas>
  </div>
</template>

<script>

export default {
  data() {
    return {
      frames: [],
      currentFrame: 0,
      rafId: null,
      frameRate: 10,
      timer: null,
      images: null

    };
  },
  mounted() {
    this.loadFrames();
  },
  methods: {
    loadFrames() {
    },
    setFrameRate(frameRate) {
      this.frameRate = frameRate
      this.stop()
      this.resume()
    },
    play(images) {
      const that = this
      that.images = images

      this.resume()

    },

    resume() {
      const that = this
      this.currentFrame = 0
      let canvas = document.getElementById('animationCanvas');
      let ctx = this.$refs.canvas.getContext('2d');
      let imgPaths = []
      for (let i = 0; i < this.images.length; i++) {
        imgPaths.push("http://localhost:2408/?img=" + this.images[i])
      }

      let currentIndex = 0;

      function loadImageAndDraw(index) {
        const img = new Image();

        // 当图片加载完成后绘制到 canvas 上
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // 设置下一帧的索引
          currentIndex = (currentIndex + 1) % imgPaths.length;
        };

        // 如果需要从本地文件系统加载图片，请确保路径正确
        img.src = imgPaths[index];
      }

      // 控制帧率和动画循环,
      // 每秒帧数
      this.timer = setInterval(() => {
        loadImageAndDraw(currentIndex);
      }, 1000 / that.frameRate);
    },

    stop() {
      clearInterval(this.timer)
    }
  },
};
</script>