<template>
  <div class="view-node">
    <div class="title">
      <span>{{ '查看业务类型' }}</span>
      <el-button
        class="ml20"
        type="text"
        @click="modify">
        修改
      </el-button>
    </div>
    <el-form
      ref="viewNode"
      class="form"
      label-width="180px"
      :model="viewNodeForm">
      <el-form-item
        label="类型层级">
        <span>{{ currentNode && currentNode.level === 1 ? '一级' : '二级' }}</span>
      </el-form-item>
      <el-form-item
        v-show="isFirstLevel"
        label="上级类型">
        <span>{{ getParentNode() }}</span>
      </el-form-item>
      <el-form-item
        label="业务类型名称"
        prop="messageTypeName">
        <span>{{ viewNodeForm.messageTypeName }}</span>
      </el-form-item>
      <el-form-item
        label="业务类型编码"
        prop="messageType">
        <span>{{ viewNodeForm.messageType }}</span>
      </el-form-item>
      <el-form-item
        v-show="isFirstLevel"
        prop="priority">
        <label slot="label">
          优先级
          <el-tooltip
            class="item"
            content="优先级高的会优先保证发送默认的优先级为低"
            placement="top-start">
            <i class="iconfont icon-wenhao" />
          </el-tooltip>
        </label>
        <span>{{ getPriority() }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { orderList } from '../../constant.js';

  export default {
    name: 'ViewNode',
    props: {
      viewNodeForm: {
        type: Object,
        default: () => {}
      },
      currentNode: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        orderList,
      }
    },
    computed: {
      isFirstLevel() {
        const parent = this.currentNode.parent;
        return parent && parent.label;
      }
    },
    methods: {
      // 修改
      modify() {
        this.$emit('modify', this.viewNodeForm);
      },
      // 等级
      getPriority() {
        const finded = this.orderList.find(order => order.value === this.viewNodeForm.priority);
        return finded ? finded.label : '-';
      },
      // 父级类型
      getParentNode() {
        const parent = this.currentNode.parent;
        return parent && parent.label || '-';
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~gui/style/theme/variables';
  .view-node {
    .title {
      margin-bottom: 40px;
      @include H-5;
      text-align: center;
    }
  }
</style>