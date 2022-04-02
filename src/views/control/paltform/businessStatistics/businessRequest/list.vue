<template>
  <div class="business-request-list">
    <el-form
      :inline="true"
      :model="filterForm"
      class="business-request-filter-form">
      <el-form-item
        class="business-request-filter-form-itme"
        label="应用：">
        <el-select
          v-model="filterForm.region"
          size="small">
          <el-option
            label="区域一"
            value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item
        class="business-request-filter-form-itme"
        label="模板：">
        <el-select
          v-model="filterForm.region"
          size="small">
          <el-option
            label="区域一"
            value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item
        class="business-request-filter-form-itme"
        label="状态：">
        <el-select
          v-model="filterForm.region"
          size="small">
          <el-option
            label="区域一"
            value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="filterForm.region"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item
        class=""
        label="业务流水号：">
        <el-input
          v-model="filterForm.region"
          placeholder="请输入要搜索的业务流水号" />
      </el-form-item>
      <el-form-item
        class=""
        label="批次号：">
        <el-input
          v-model="filterForm.region"
          placeholder="请输入要搜索的批次号" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <g-table
      ref="tableContent"
      class="business-request-table-content"
      :columns="tableColumns"
      :multiple="false"
      :data="tableDatas"
      :data-total="total"
      :page-size="pageSize"
      border
      @size-change="pageSizeChange"
      @pagetion-num-change="pageCurrentChange">
      <template
        slot="action"
        slot-scope="scope">
        <a
          href="javascript: void(0)"
          @click="clickGoToDetailBtn(scope.row)">明细</a>
      </template>
    </g-table>
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';

  export default {
    components: {
      GTable
    },
    data() {
      return {
        filterForm: {},
        tableColumns: [
          {
            prop: 'yhbsh',
            label: '批次号',
            align: 'center'
          },
          {
            prop: 'templateId',
            label: '业务流水号',
            align: 'center'
          },
          {
            prop: 'businessClass',
            label: '模板',
            align: 'center'
          },
          {
            prop: 'smallBussinessClass',
            label: '消息标题',
            align: 'center'
          },
          {
            prop: 'channel',
            label: '创建日期',
            align: 'center'
          },
          {
            prop: 'sendTime',
            label: '预定发送时间',
            align: 'center'
          },
          {
            prop: 'state',
            label: '推送渠道',
            align: 'center'
          },
          {
            prop: 'state',
            label: '发送结果',
            align: 'center'
          },
          {
            prop: 'state',
            label: '状态',
            align: 'center'
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center'
          }
        ],
        // 表格数据
        tableDatas: [{}],
        // 产品
        total: 0,
        pageSize: 10,
        pageNumber: 1,
      }
    },
    methods: {
      // 修改每页数量
      pageSizeChange() {},
      // 换页
      pageCurrentChange() {},
      // 前往明细页
      clickGoToDetailBtn() {
        this.$router.push({
          path: '/control/paltform/businessRequest/detail'
        })
      }
    }
  }
</script>

<style lang="scss">
  .business-request-list {
    .business-request-filter-form {
      .business-request-filter-form-itme {
        .el-form-item__content {
          width: 120px;
        }
      }
      .el-radio-group {
        vertical-align: inherit;
      }
      .el-button {
        height: 32px;
      }
    }
  }
</style>