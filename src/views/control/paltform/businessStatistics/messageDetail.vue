<template>
  <div class="user-message-detail">
    <main-title-nav
      title="用户消息明细" />
    <main-content>
      <el-form
        :inline="true"
        :model="filterForm"
        class="user-message-detail-form">
        <el-form-item
          class="user-message-detail-form-itme"
          label="应用：">
          <el-select
            v-model="filterForm.region">
            <el-option
              label="区域一"
              value="shanghai" />
          </el-select>
        </el-form-item>
        <el-form-item
          class="user-message-detail-form-itme"
          label="模板：">
          <el-select
            v-model="filterForm.region">
            <el-option
              label="区域一"
              value="shanghai" />
          </el-select>
        </el-form-item>
        <el-form-item
          class="user-message-detail-form-itme"
          label="业务类型：">
          <el-select
            v-model="filterForm.region">
            <el-option
              label="区域一"
              value="shanghai" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="创建时间：">
          <el-date-picker
            v-model="filterForm.region"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item
          label="用户标识号：">
          <el-input
            v-model="filterForm.region"
            placeholder="请输入用户标识号" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
      <g-table
        ref="tableContent"
        class="user-message-table-content"
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
            @click="clickResendBtn(scope.row)">重新发送</a>
          <a
            href="javascript: void(0)"
            @click="clickSeeDetailBtn(scope.row)">详情</a>
        </template>
      </g-table>
    </main-content>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  import GTable from '@/common/component/GTable';
  import MainContent from '../../components/mainContent';

  export default {
    components: {
      MainContent,
      MainTitleNav,
      GTable
    },
    data() {
      return {
        filterForm: {
          region: ''
        },
        tableColumns: [
          {
            prop: 'yhbsh',
            label: '用户标识号',
            align: 'center'
          },
          {
            prop: 'templateId',
            label: '模板名称',
            align: 'center'
          },
          {
            prop: 'businessClass',
            label: '业务大类',
            align: 'center'
          },
          {
            prop: 'smallBussinessClass',
            label: '业务小类',
            align: 'center'
          },
          {
            prop: 'channel',
            label: '终端渠道',
            align: 'center'
          },
          {
            prop: 'sendTime',
            label: '发送时间',
            align: 'center'
          },
          {
            prop: 'state',
            label: '发送状态',
            align: 'center'
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center'
          },
          {
            prop: 'action',
            label: '操作',
            soltNmae: 'action',
            align: 'center',
            width: '150'
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
      // 重新发送
      clickResendBtn() {},
      // 详情
      clickSeeDetailBtn() {}
    }
  }
</script>

<style lang="scss">
  .user-message-detail {
    .user-message-detail-form {
      .user-message-detail-form-itme {
        .el-form-item__content {
          width: 120px;
        }
      }
    }
  }
</style>