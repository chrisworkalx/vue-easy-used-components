<template>
  <div>
    <easy-used-throttle :events="baseConfig">
      <!-- 默认是500ms -->
      <!-- 没有配置 blur事件 无效的 -->
      <input type="text" @blur="handleBlur" />
      <!-- 有效的 -->
      <button @click="handleClick">点击</button>
    </easy-used-throttle>
    <hr />
    <easy-used-throttle :time="3000" :events="config">
      <!-- 默认全局配置为3s -->
      <!-- 可以额外给特定事件配置时间 -->
      <input type="text" @blur="handleBlur" @change="handleChange" />
      <!-- 2s 的时间间隔 -->
      <button @click="handleClick">点击</button>
    </easy-used-throttle>
  </div>
</template>

<script>
export default {
  name: 'ThrottlePage',
  data() {
    return {
      baseConfig: 'click',
      config: {
        click: { time: 2000 },
        blur: { time: 5000 },
        change: { time: 10000 }
      }
    };
  },
  methods: {
    handleBlur() {
      console.log('失去焦点');
    },
    handleClick() {
      console.log('点击一');
    },
    handleChange(e) {
      console.log(e.target.value);
    }
  }
};
</script>

<style lang="scss" scoped></style>
