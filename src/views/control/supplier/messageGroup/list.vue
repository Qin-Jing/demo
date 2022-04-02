<template>
  <div v-loading="loading">
    <el-alert
      type="warning"
      show-icon
      :closable="false"
      title="
        消息分组是终端渠道的一个分组。以下这些终端渠道包括：个税所得税APP站内信、个人所得税APP移动推送、自然人电子税务局WEB站内信、短信平台 是纳税人接收消息的渠道。自然人电子税务局税务端WEB站内信、个税人所得税APP站内信 是税务人员接收消息的渠道。
      " />
    <div>
      <el-button
        type="primary"
        size="small"
        @click="edit()">
        新增
      </el-button>
      <g-table
        style="margin-top: 10px;"
        :columns="tableColumns"
        :multiple="false"
        :data="tableData"
        :show-page="false"
        border>
        <template
          slot="action"
          slot-scope="{row}">
          <el-button
            type="text"
            @click="view(row)">
            查看
          </el-button>
          <el-button
            type="text"
            @click="edit(row)">
            修改
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(row)">
            删除
          </el-button>
          <!-- <el-button
            type="text"
            @click="$router.push(`/control/supplier/businessType/${row.messageGroupCode}`)">
            维护业务类型
          </el-button> -->
          <el-dropdown
            trigger="click"
            @command="command => handleCommand(command, row)">
            <el-button
              type="text"
              style="margin-left: 10px;">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="type">
                维护业务类型
              </el-dropdown-item>
              <el-dropdown-item command="channel">
                终端渠道关联
              </el-dropdown-item>
              <el-dropdown-item command="app">
                应用关联
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </g-table>
    </div>
  </div>
</template>

<script>
  import GTable from '@/common/component/GTable';
  import http from '@/core/service/http';
  import showDialog from '@/common/utils/showDialog';
  import edit from './edit';
  import viewDialog from './view';
  export default {
    components: {
      GTable
    },
    props: {
    },
    data() {
      return {
        tableColumns: [
          {
            prop: 'messageGroupName',
            label: '消息分组'
          },
          {
            prop: 'messageGroupCode',
            label: '标识码',
            align: 'center'
          },
          {
            prop: 'action',
            label: '操作',
            soltNmae: 'action',
            align: 'center',
            width: '280'
          }
        ],
        tableData: [],
        loading: false
      }
    },
    created() {
      // 获取渠道类型列表
      this.getTableData();
    },
    methods: {
      getTableData(){
        http({
          url: 'configmessagegroup/list',
          data: {},
          method: 'POST'
        }).then((res = []) => {
          this.tableData = res;
        });
      },
      // 查看
      view(row = {}) {
        const btns = {
          negative: '取消'
        };
        showDialog('查看消息分组', { row, btns }, viewDialog);
      },
      edit(row = {}) {
        const isEdit = !!row.messageGroupCode;
        showDialog(`${isEdit ? '修改' : '新增'}消息分组`, {
          row,
          beforeConfirm: (dialog, form, done) => {
            dialog.showLoading();
            http({
              url: `configmessagegroup/${isEdit ? 'update' : 'save'}`,
              data: form.form,
              method: 'POST'
            }).then(() => {
              this.$message.success(`${isEdit ? '修改' : '新增'}成功！`);
              done();
              this.getTableData();
            }).finally(() => {
              dialog.hideLoading();
            });
          }
        }, edit)
      },
      handleDelete(row) {
        http({
          url: 'configmessagegroup/check/member',
          data: {
            msgGroupId: row.msgGroupId
          },
          method: 'POST'
        }).then((res = []) => {
          let content = `确定要要删除消息分组【${row.messageGroupName}】吗？`;
          let confirmButtonText = '确定';
          let cancelButtonText = '取消';
          let showConfirmButton = true;
          if(res.includes('MESSAGE_TYPE')) {
            content = `消息分组【${row.messageGroupName}】下存在业务类型，无法删除。请先删除该消息分组下的业务类型。`;
            showConfirmButton = false;
            cancelButtonText = '关闭';
          } else if(res.includes('APP')) {
            content = `有应用正在使用该消息分组【${row.messageGroupName}】，请先将应用从消息分组移除`;
            confirmButtonText = '查看应用';
            cancelButtonText = '关闭';
          } else if(res.includes('CHANNEL')) {
            content = `消息分组【${row.messageGroupName}】下已关联终端渠道，请先将终端渠道从消息分组移除`;
            confirmButtonText = '查看渠道终端';
            cancelButtonText = '关闭';
          }
          this.$confirm(content, '提示', {
            confirmButtonText,
            cancelButtonText,
            showConfirmButton,
            type: 'warning'
          }).then(() => {
            if(res.includes('APP')) {
              this.$router.push({
                path: './app',
                query: row
              });
            } else if(res.includes('CHANNEL')) {
              this.$router.push({
                path: './channel',
                query: row
              });
            } else {
              http({
                url: 'configmessagegroup/delete',
                data: {
                  msgGroupId: row.msgGroupId
                },
                method: 'POST'
              }).then(() => {
                this.$message.success('删除成功！');
                this.getTableData();
              });
            }
          }).catch(() => {
          });
        });
       
      },
      handleCommand(command, row){
        if (command === 'type') {
          this.$router.push(`/control/supplier/businessType/${row.messageGroupCode}`);
          return;
        }
        this.$router.push({
          path: `./${command}`,
          query: row
        });
      }
    }
  }
</script>
