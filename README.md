# vue-easy-used-components

> 1. `vue-easy-used-components`主要是为了解决一些常用功能场景、服务于vue系列框架开发的组件升级库
> 2. 目前组件很少，后续慢慢增加迭代

## 安装及使用

```shell
npm i vue-easy-used-components
```

## main.js配置

```js
import VueEasyUsedComponents from 'vue-easy-used-components';

//引入css
import 'vue-easy-used-components/lib/vue-easy-used-components.css';


Vue.use(VueEasyUsedComponents);
```

## 具体组件使用方法

```js
    <easy-used-collapse-transition
      @beforeEnter="handleBeforeEnter"
      @afterEnter="handleAfterEnter"
      @beforeLeave="handleBeforeLeave"
      direction="horizon"
      :duration="5000"
      :easing="cubic"
    >
      <div v-show="isShow" class="list">
        <div v-for="i in 8" :key="i" class="list-item">{{ i }}</div>
      </div>
    </easy-used-collapse-transition>
```

[使用文档](https://chrisworkalx.github.io/blog/vueFolder/repos/1.%E4%BB%8B%E7%BB%8D.html#main-js%E9%85%8D%E7%BD%AE)

## 本地环境安装

```shell
npm install (yarn)
```

### 本地项目调试启动

```shell
npm run serve
```
