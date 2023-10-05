<template>
  <div class="watermark-container" ref="parentRef">
    <slot></slot>
    <!-- 我们要做的就是在这里添加一个 div，填充满整个区域，设置水印背景并且重复 -->
  </div>
</template>

<script>
export default {
  name: 'EasyUsedWaterMark',
  props: {
    isShowWaterMark: {
      type: Boolean,
      default: true
    },
    text: {
      // 传入水印的文本
      type: String,
      default: 'watermark'
    },
    fontSize: {
      // 字体的大小
      type: Number,
      default: 40
    },
    fontStyle: {
      type: String,
      default: 'rgba(0, 0, 0, 0.3)'
    },
    gap: {
      // 水印重复的间隔
      type: Number,
      default: 20
    },
    rotateDeg: {
      type: Number,
      default: 45
    }
  },
  data() {
    return {
      flag: 0,
      ob: null,
      waterMarkContainer: null,
      watchTag: null
    };
  },
  mounted() {
    this.$watch(
      'isShowWaterMark',
      (n) => {
        if (n) {
          this.execFun([
            () => {
              if (this.watchTag) {
                //先销毁
                this.watchTag();
              }
              this.watchTag = this.$watch('flag', () => {
                this.createWaterMarkElement();
                this.$emit('violation');
              });
            },
            this.listenDOMNodes,
            this.createWaterMarkElement
          ]);
        } else {
          this.formatWaterMark();
        }
      },
      {
        immediate: true
      }
    );
  },
  beforeDestroy() {
    this.execFun(this.formatWaterMark);
  },
  methods: {
    formatWaterMark() {
      this.ob && this.ob.disconnect();
      if (this.waterMarkContainer) {
        this.waterMarkContainer.remove();
        this.waterMarkContainer = null;
      }
      if (this.watchTag) {
        this.watchTag();
        this.watchTag = null;
      }
    },
    execFun(fn) {
      const self = this;
      fn = Array.isArray(fn) ? fn : [fn];
      if (!this.isShowWaterMark) {
        return;
      }
      fn.forEach((f) => f.call(self));
    },
    listenDOMNodes() {
      if (!this.isShowWaterMark) {
        return;
      }
      this.ob = new MutationObserver((records) => {
        for (const record of records) {
          for (const dom of record.removedNodes) {
            if (dom === this.waterMarkContainer) {
              this.flag++; // 删除节点的时候更新依赖
              return;
            }
          }
          if (record.target === this.waterMarkContainer) {
            this.flag++; // 修改属性的时候更新依赖
            return;
          }
        }
      });
      this.ob.observe(this.$refs.parentRef, {
        childList: true,
        attributes: true,
        subtree: true
      });
    },
    getWaterMarkBg(props) {
      // 创建一个 canvas
      const canvas = document.createElement('canvas');
      const devicePixelRatio = window.devicePixelRatio || 1;
      // 设置字体大小
      const fontSize = props.fontSize * devicePixelRatio;
      const font = fontSize + 'px serif';
      const ctx = canvas.getContext('2d');
      // 获取文字宽度
      ctx.font = font;
      const { width } = ctx.measureText(props.text);
      const canvasSize = Math.max(100, width) + props.gap * devicePixelRatio;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      // 旋转 45 度让文字变倾斜
      ctx.rotate((Math.PI / 180) * -props.rotateDeg);
      ctx.fillStyle = props.fontStyle;
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // 将文字画出来
      ctx.fillText(props.text, 0, 0);
      return {
        base64: canvas.toDataURL(),
        size: canvasSize,
        styleSize: canvasSize / devicePixelRatio
      };
    },
    createWaterMarkElement() {
      if (this.waterMarkContainer) {
        this.waterMarkContainer.remove();
      }
      const { base64, size, styleSize } = this.getWaterMarkBg({
        text: this.text,
        fontSize: this.fontSize,
        gap: this.gap,
        rotateDeg: this.rotateDeg,
        fontStyle: this.fontStyle
      });
      this.waterMarkContainer = document.createElement('div');
      this.waterMarkContainer.style.backgroundImage = `url(${base64})`;
      this.waterMarkContainer.style.backgroundSize = `${styleSize}px ${styleSize}px`;
      this.waterMarkContainer.style.backgroundRepeat = 'repeat';
      this.waterMarkContainer.style.inset = 0;
      this.waterMarkContainer.style.zIndex = 9999;
      // 设置绝对定位
      this.waterMarkContainer.style.position = 'absolute';
      // 设置点击穿漏，防止底部元素失去鼠标事件的交互
      this.waterMarkContainer.style.pointerEvents = 'none';
      this.$refs.parentRef.appendChild(this.waterMarkContainer);
    }
  }
};
</script>

<style lang="scss" scoped>
.watermark-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
