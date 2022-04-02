<template>
  <div class="g-table">
    <el-table
      ref="gtable"
      v-loading="loading"
      :data="newData"
      v-bind="$attrs"
      v-on="$listeners">
      <!-- 列字段信息  -->
      <el-table-column
        v-if="multiple"
        type="selection"
        width="55" />
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :sort-method="(a, b) => sortColumns(a, b, item.prop)"
        v-bind="item">  
        <template slot-scope="scope">
          <!-- 判断该字段是否有插槽，如果有则获取插槽模板 -->
          <slot
            v-if="item.soltNmae"
            :name="item.soltNmae"
            :row="scope.row"
            :index="scope.$index" />
          <!-- 判断该字段是否有插槽，如果无插槽 则直接展示 -->
          <template v-if="!item.soltNmae && item.prop">
            {{ scope.row[item.prop] }}
          </template>

          <!-- 是否需要显示行索引 -->
          <template v-if="item.type === 'index'">
            {{ scope.$index }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="g-table-bottom-menu">
      <slot name="btnList" />
      <!-- 分页组件 -->
      <el-pagination
        v-if="showPage" 
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="TpageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GTable',
    props: {
      // 是否显示页数
      showPage: {
        type: Boolean,
        default: true
      },
      // 是否支持多选
      multiple: {
        type: Boolean,
        default: true
      },
      // 表格数据
      data: {  
        type: Array,
        default: () => {
          return []
        }
      },
      // 列的属性集合配置
      columns: { 
        type: Array,
        default: () => {
          return []
        }
      },
      // 每页显示个数选择器的选项设置
      pageSizes: { 
        type: Array,
        default: () => {
          return [10, 20, 30, 40]
        }
      },
      // 每页显示条目个数.
      pageSize: {
        type: Number,
        default: 10,
      },
      // 数据总数
      dataTotal: {
        type: Number,
        default: 0
      },
      // 表格loading
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // loading: true,           // laoding 默认显示
        TpageSize: this.pageSize,   // 每页显示的大小
        // newData: [],                // 需要显示的数据
        currentPage: 1,             // 当前页
        // total: 0,                   // 总条数
      }
    },
    computed: {
      newData() {
        return this.data;
      },
      total() {
        return this.dataTotal || this.data.length;
      }
    },
    watch: {
      pageSize(value) {
        this.TpageSize = value;
      }
    },
    methods: {
      /**
			 * @param val 每页要显示的数据
       * 切换每页显示的数据时，从第一页开始显示
       */
      handleSizeChange(val) {
        this.TpageSize = val;
        this.$emit('size-change', this.TpageSize);
      },
      /**
       * 切换页码时，从新计算当前页面显示的数据
       */
      handleCurrentChange() {
        this.$emit('pagetion-num-change', this.currentPage);
      },
      /**
       * 外部切换
       */
      reload() {
        this.currentPage = 1;
        this.$emit('pagetion-num-change', this.currentPage);
      },
      // 排序
      sortColumns(a, b, name = '') {
        return a[name].localeCompare(b[name]); 
      }
    }
  }
</script>

<style lang="scss">
  .g-table {
    .el-table__row:hover {
      background-color: #EAF4FF;
    }
    .g-table-bottom-menu {
      margin-top: 20px;
      padding-bottom: 20px;
      .el-pagination {
        // float: right;
        text-align: right;
        .el-pagination__total {
          float: none;
          padding-top: 2px;
        }
      }
    }
  }
</style>