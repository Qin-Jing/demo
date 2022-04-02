<template>
  <div 
    class="table-header-menu clearfix"
    @keyup.enter="searchBtnClick">
    <slot />
    <el-input
      v-model="searchValue"
      :placeholder="placeholder"
      class="table-header-menu-search-menu">
      <el-select
        v-if="typeList.length"
        slot="prepend"
        v-model="searchType"
        placeholder="请选择">
        <el-option
          v-for="item in formatTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.code" />
      </el-select>
      <el-button
        slot="append"
        @click="searchBtnClick">
        搜索
      </el-button>
    </el-input>
    <div class="table-header-menu-right-menu">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      typeList: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        // 查询内容
        searchValue: '',
        // 查询类型
        searchType: ''
      }
    },
    computed: {
      formatTypeList() {
        const list = [{
          name: '全部',
          code: ''
        }, ...this.typeList]
        return list
      }
    },
    methods: {
      // 查询按钮点击
      searchBtnClick() {
        // 广播点击事件
        this.$emit('search-click', {
          value: this.searchValue,
          type: this.searchType
        });
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .table-header-menu {
    &:after {
      content: '';
      display: block;
      clear: both;
    }
    .el-input-group__prepend {
      background-color: #fff;
    }
    .table-header-menu-search-menu {
      float: right;
      width: 450px;
      border-color: $CM-5;
      // .el-select {
      //   width: 138px;
      // }
      .el-input-group__prepend {
        border-color: $CM-5 !important;
      }
      .el-input-group__prepend + .el-input__inner {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .el-input-group__append {
        border-color: $CM-5 !important;
        background-color: $CM-10;
        &:hover {
          background-color: $CM-9
        }
      }
    }
    .table-header-menu-right-menu {
      float: right;
    }
  }
</style>
