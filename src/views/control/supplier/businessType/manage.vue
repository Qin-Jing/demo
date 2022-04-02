<template>
  <div
    v-loading="loading"
    class="system-menu-manage">
    <main-title-nav
      title="业务类型管理">
      <span class="system-menu-manage-title-hint">最多且必须维护到二级</span>
    </main-title-nav>
    <main-content>
      <div class="menu-tree-content">
        <span>消息分组：</span>
        <el-select
          v-model="messageType"
          placeholder="请选择消息分组"
          style="width:200px;margin-bottom: 20px;"
          clearable
          @change="msgTypeChange">
          <el-option
            v-for="item in messageGroup"
            :key="item.messageGroupCode"
            :label="item.messageGroupName"
            :value="item.messageGroupCode" />
        </el-select>
        <div v-if="(treeData.length || saveSearchValue) && !loading">
          <el-tree
            v-if="treeData.length"
            ref="menuTree"
            :data="treeData"
            node-key="msgTypeId"
            default-expand-all
            draggable
            :allow-drop="allowDropHandle"
            :props="defaultProps"
            :filter-node-method="filterMenuNode"
            :expand-on-click-node="false"
            @node-drop="afterNodeDrop"
            @node-click="handleNodeClick">
            <div
              slot-scope="{node, data}"
              class="menu-tree-node">
              <span
                class="menu-tree-node-label"
                :class="{'edit-node-label': data.isEdit}">
                {{ node.label }}
              </span>
              <span v-show="!isEdit">
                <i class="el-icon-rank" />
                <i 
                  class="iconfont icon-bianji"
                  @click.stop="clickEditNodeBtn(node, data)" />
                <i
                  class="iconfont icon-trash"
                  @click.stop="clickRemoveNodeBtn(data)" />
              </span>
              <span 
                v-show="!isEdit"
                class="menu-tree-add-btn-list">
                <a
                  href="javascript: void(0)"
                  @click.stop="clickAppendNodeBtn(node, data)">
                  添加同级
                </a>
                <a
                  v-if="node.level === 1"
                  href="javascript: void(0)"
                  @click.stop="clickAddChildrenNodeBtn(node, data)">
                  添加子集
                </a>
              </span>
            </div>
          </el-tree>
        </div>
        <!-- <div v-show="!treeData.length && isEdit">
          业务类型编辑中…
        </div> -->
        <no-info-component
          v-if="!treeData.length && !saveSearchValue && !loading"
          hint="您还没有添加过业务类型哦！" 
          btn-txt="添加一级业务类型"
          @btn-click="clickaddFirstMenuBtn" />
      </div>
      <div class="menu-edit-content">
        <div
          v-show="!isEdit && !isNodeClick"
          class="menu-edit-content-empty-text">
          内容操作区
        </div>
        <template v-show="isEdit && !isNodeClick">
          <div 
            v-show="isEdit"
            class="menu-edit-content-form">
            <div class="menu-edit-content-form-title">
              {{ editText }}业务类型
            </div>
            <el-form
              ref="formContent"
              class="content-form"
              label-width="180px"
              :model="treeMenuEditForm"
              :rules="treeMenuEditFormRule">
              <el-form-item
                label="类型层级">
                <span>{{ selectNode }}</span>
              </el-form-item>
              <el-form-item
                v-if="parentNode.label && selectMenuLevel > 1 && isOnlyEdit"
                prop="superMsgTypeId"
                label="上级类型">
                <!-- <el-input
                  v-model="treeMenuEditForm.superMsgTypeId"
                  :maxlength="200" /> -->
                <el-select 
                  v-model="treeMenuEditForm.superMsgTypeId"
                  placeholder="请选择"
                  @change="superMsgTypeChange">
                  <el-option
                    v-for="itm of treeData"
                    :key="itm.msgTypeId"
                    :label="itm.messageTypeName"
                    :value="itm.msgTypeId" />
                </el-select>
              </el-form-item>
              <el-form-item
                label="业务类型名称"
                prop="messageTypeName">
                <el-input
                  v-model="treeMenuEditForm.messageTypeName"
                  :maxlength="20" />
              </el-form-item>
              <el-form-item
                label="业务类型编码"
                prop="messageType">
                <el-input
                  v-model="treeMenuEditForm.messageType"
                  :maxlength="200" />
              </el-form-item>
              <el-form-item
                v-show="parentNode.label"
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
                <el-select
                  v-model="treeMenuEditForm.priority">
                  <el-option
                    v-for="(item, index) in orderList"
                    :key="index"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="medium"
                  @click="clickCancelBtn">
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="medium"
                  :disabled="btnDisabled"
                  @click="clickSubmitBtn">
                  确定
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template v-show="isNodeClick && !isEdit">
          <view-node
            v-show="isNodeClick"
            ref="viewNode"
            :current-node="selectEditNode"
            :view-node-form="selectEditNodeData"
            @modify="viewModify" />
        </template>
      </div>
    </main-content>
  </div>
</template>

<script>
  import MainTitleNav from '@/common/component/mainTitleNav';
  import MainContent from '../../components/mainContent';
  import NoInfoComponent from '@/views/control/components/noInfoComponent';
  import http from '@/core/service/http';
  // import { urlRule } from '@/common/utils/validate';
  import { orderList } from '../../constant.js';
  import viewNode from './viewNode.vue';
  
  export default {
    components: {
      MainTitleNav,
      MainContent,
      NoInfoComponent,
      viewNode
    },
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      var checkYwlxdmRepeat = (rule, value, callback) => {
        this.$http['checkTypeCodeRepeat']({
          messageType: value,
          msgTypeId: this.treeMenuEditForm.msgTypeId,
          userTypeOriented: this.messageType
        })
          .then((data) => {
            if (!data) {
              return callback('该的业务类型编码已存在，请重新输入');
            }
            callback();
          })
      }

      const checkYwlxmcRepeat = (rule, value, callback) => {
        // 涉及 编辑 添加同级 添加子集  第一层级时 superMsgTypeId 值为0 取msgTypeId
        const superMsgTypeId = 
          this.treeMenuEditForm.superMsgTypeId || this.selectEditNodeData.superMsgTypeId || this.selectEditNodeData.msgTypeId
        this.$http['checkTypeCodeRepeat']({
          messageTypeName: this.treeMenuEditForm.messageTypeName,
          msgTypeId: this.treeMenuEditForm.msgTypeId,
          superMsgTypeId,
          userTypeOriented: this.messageType
        })
          .then((data) => {
            if (!data) {
              return callback('该的业务类型名称已存在，请重新输入');
            }
            callback();
          })
      }
      return {
        searchValue: '',
        treeData: [],
        isEdit: false,
        treeMenuEditForm: {
          messageTypeName: '',
          messageType: '',
          priority: '2',
          userTypeOriented: '',
          superMsgTypeId: ''
        },
        treeMenuEditFormRule: {
          messageTypeName: [
            { required: true, message: '请输入业务类型名称', trigger: 'blur' },
            { validator: checkYwlxmcRepeat, trigger: 'blur'}
          ],
          messageType: [
            { required: true, message: '请输入业务类型编码', trigger: 'blur' },
            { validator: checkYwlxdmRepeat, trigger: 'blur'}
          ],
          priority: [
            { required: true, message: '请选择优先级', trigger: 'blur' }
          ],
          superMsgTypeId: [
            { required: true, message: '请输入上级类型', trigger: 'blur' }
          ],
        },
        selectEditNode: {},
        selectEditNodeData: {},
        selectNode: '一级',
        // parentNode: '一级菜单',
        defaultProps: {
          children: 'childrens',
          label: 'formatMenuName'
        },
        saveSearchValue: '',
        isInsert: false,
        orderList,
        editText: '添加',
        loading: false,
        messageGroup: [],
        messageType: '',
        isNodeClick: false, // tree节点点击事件flag
        selectMenuLevel: 0,
        isOnlyEdit: false, // 只针对编辑流程
      }
    },
    computed: {
      parentNode() {
        const parent = this.selectEditNode.parent || {};
        return parent;
      },
      btnDisabled() {
        const form = this.treeMenuEditForm;
        return !form.messageTypeName || !form.messageType || !form.priority
      }
    },
    created() {
      this.messageType = this.id;
      this.getMessageGroup();
    },
    methods: {
      // 获取消息分组列表
      getMessageGroup(){
        http({
          url: 'configmessagegroup/list',
          data: {},
          method: 'POST'
        })
          .then((res = []) => {
            this.messageGroup = res;
            // 初始化选中
            if (!this.messageType) {
              this.messageType = 
                this.messageGroup.length && this.messageGroup[0].messageGroupCode || '';
            }

            this.queryMenuList();
          })
          .catch(() => {
            this.messageGroup = [];
          })
      },
      // 消息类型change
      msgTypeChange() {
        this.initialPrevData();
        this.queryMenuList();
      },
      // 获取菜单列表
      queryMenuList() {
        this.loading = true;
        this.$http['queryBusinessTypeList']({
          userTypeOriented: this.messageType
        })
          .then((resp) => {
            this.treeData = this.getInitialMenuList(resp);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      getInitialMenuList(data, parent = '') {
        return data.reduce((acc, cur) => {
          if (cur.subMsgTypelist && cur.subMsgTypelist.length) {
            const name = `${parent},${cur.messageTypeName}`;
            cur.childrens = this.getInitialMenuList(cur.subMsgTypelist, name);
          }
          acc.push({
            ...cur,
            formatMenuName: cur.messageTypeName,
            parentName: parent,
            isEdit: false,
          })
          return acc;
        }, [])
      },
      clickSearchBtn() {
        this.saveSearchValue = this.searchValue;
        this.$refs['menuTree'].filter(this.searchValue);
        // 获取菜单列表
        // this.queryMenuList(this.searchValue);
      },
      /**
       * 添加同级
       */
      clickAppendNodeBtn(node, data) {
        this.editText = '添加'
        const level = node.level;
        this.selectMenuLevel = level;
        // 添加同级时，选中当前节点只用于获取父节点
        this.selectEditNode = node;
        this.selectEditNodeData = data;
        this.selectNode = node.level === 1 ? '一级' : '二级'
        if (level === 1) {
          this.treeData.push({
            formatMenuName: '业务类型编辑中',
            isEdit: true
          })
        } else {
          const parent = this.parentNode.data;
          parent.childrens.push({
            formatMenuName: '业务类型编辑中',
            isEdit: true
          })
        }
        // 是否编辑，右侧表单的显示隐藏
        this.isEdit = true;
        this.isNodeClick = false;
      },
      clickAddChildrenNodeBtn(node, data) {
        this.editText = '添加'
        const level = node.level;
        this.selectMenuLevel = `${parseInt(level) + 1}`;
        data.childrens = data.childrens || [];
        this.selectNode = node.level === 1 ? '二级' : '一级';
        data.childrens.push({
          formatMenuName: '业务类型编辑中',
          isEdit: true
        });
        this.selectEditNode = {
          parent: node
        };
        this.selectEditNodeData = data;
        // 是否编辑，右侧表单的显示隐藏
        this.isEdit = true;
        this.isNodeClick = false;
      },
      clickRemoveNodeBtn(data) {
        if (data.childrens && data.childrens.length) {
          this.$alert('该业务类型包含下级业务类型，请先删除下级业务类型！', '提示', {
            confirmButtonText: '确认'
          });
          return;
        }
        let confirmText = '删除后无法恢复，您是否确定删除？';
        if (data.parentName) {
          confirmText = '删除后，会影响已关联业务类型模板的发送优先级以及统计。是否确定删除？';
        }

        this.$confirm(confirmText, {
          cancelButtonText: '暂不删除',
          confirmButtonText: '确认'
        })
          .then(() => {
            // 删除消息
            this.removeMenu(data);
          })
          .catch(() => {})
      },
      removeMenu(data) {
        this.$http['deleteBusinessType']({
          ...data,
          // superMsgTypeId: this.selectMenuLevel !== 1 ? this.parentNode.data.msgTypeId : '',
          // isLeaf: this.selectMenuLevel !== 1 ? 'Y' : 'N',
        }).then(() => {
          this.$message.success('删除成功');
          // 获取菜单列表
          this.queryMenuList();
        })
      },
      // 点击添加一级菜单
      clickaddFirstMenuBtn() {
        this.isEdit = true;
        this.isNodeClick = false;
        this.selectMenuLevel = 1;
        this.selectNode = '一级';
      },
      // 点击编辑图标
      clickEditNodeBtn(node, data) {
        this.editText = '修改'
        const level = node.level;
        this.selectMenuLevel = level;
        this.selectNode = level === 1 ? '一级' : '二级';
        // 设置当前选中数据
        this.setSeletNode(node, data);
        this.treeMenuEditForm = data;
      },
      setSeletNode(node, data) {
        // 重新初始化数据
        this.initialPrevData();
        // 设置最新选中的data和node
        this.selectEditNodeData = data;
        // 用于获取父节点的数据
        this.selectEditNode = node;
        // 是否编辑，右侧表单的显示隐藏
        this.isEdit = true;
        this.isNodeClick = false;
        this.isOnlyEdit = true;
        // 当前选中节点为正在编辑状态
        data.formatMenuName = `${data.messageTypeName}编辑中`;
        data.isEdit = true;
      },
      initialPrevData() {
        const data = this.selectEditNodeData;
        data.formatMenuName = data.messageTypeName;
        data.isEdit = false;
        this.isEdit = false;
        this.isNodeClick = false;
        this.isOnlyEdit = false;
        // 初始化表单数据
        this.treeMenuEditForm = {
          messageTypeName: '',
          messageType: '',
          priority: '2',
          superMsgTypeId: ''
        }
        // 清空选中数据
        this.selectEditNodeData = {};
        this.selectEditNode = {};
      },
      // 编辑取消
      clickCancelBtn() {
        this.isEdit = false;
        this.isNodeClick = true;
        this.isOnlyEdit = false;
        this.initialPrevData();
        // 获取菜单列表
        this.queryMenuList();
      },
      // 编辑确认
      clickSubmitBtn() {
        const form = this.treeMenuEditForm;
        // 表单格式校验
        this.$refs['formContent'].validate((valid) => {
          if (!valid) {
            return;
          }
          if (form.msgTypeId) {
            this.editMenu(form);
            return;
          }
          this.addMenu(form);
        });
      },
      // 编辑菜单
      editMenu(data) {
        this.$http['editBusinessType']({
          ...data,
          userTypeOriented: this.messageType,
          // superMsgTypeId: this.selectMenuLevel !== 1 ? this.parentNode.data.msgTypeId : '',
          isLeaf: this.selectMenuLevel !== 1 ? 'Y' : 'N',
        }).then((resp) => {
          if (resp === false) {
            this.$message.error('业务类型名已存在');
            return;
          }
          this.$message.success('修改成功');
          // 初始化数据
          this.initialPrevData();
          // 获取菜单列表
          this.queryMenuList();
        })
      },
      addMenu(data) {
        let superMsgTypeId = '';
        if(this.selectMenuLevel) {
          superMsgTypeId = 
            this.selectMenuLevel !== 1 ? this.parentNode.data.msgTypeId : '';
        }
        this.$http['addBusinessType']({
          ...data,
          userTypeOriented: this.messageType,
          // menuLevel: this.selectMenuLevel,
          superMsgTypeId,
          isLeaf: this.selectMenuLevel !== 1 ? 'Y' : 'N',
          // cpId: '900000'
        }).then((resp) => {
          if (resp === false) {
            this.$message.error('业务类型名已存在');
            return;
          }
          this.$message.success('添加成功');
          // 初始化数据
          this.initialPrevData();
          // 获取菜单列表
          this.queryMenuList();
        })
      },
      // 筛选菜单
      filterMenuNode(value, data) {
        if (!value) {
          return true;
        }
        return data.formatMenuName.indexOf(value) !== -1 || data.parentName.indexOf(value) !== -1;
      },
      // 拖拽后回调
      afterNodeDrop(sourceNode, targetNode) {
        const parentData = targetNode.parent.data;
        const sortArr = [];
        // 非第一级
        if (parentData.childrens) {
          parentData.childrens.map((item, index) => {
            sortArr[index] = item.msgTypeId;
          })
        } else { // 第一级
          parentData.map((item, index) => {
            sortArr[index] = item.msgTypeId;
          })
        }

        this.$http['msgTypeSort'](sortArr)
          .then(() => {
            // 新增时后端排序 这里不需要重新拉取数据 重新拉取会造成页面刷新
            // this.queryMenuList();
          })
          .catch(() => {})
      },
      // 判断是否可拖拽
      allowDropHandle(draggingNode, dropNode, type) {
        if (type !== 'inner') {
          // 源
          const orgLevel = draggingNode.level;
          const orgParentLevel = draggingNode.parent.level;
          const orgParentId = draggingNode.parent.id;
          // 目标
          const targetLevel = dropNode.level;
          const targetParentLevel = dropNode.parent.level;
          const targetParentId = dropNode.parent.id;

          if (orgLevel === targetLevel &&
            orgParentLevel === targetParentLevel && 
            orgParentId === targetParentId) {
            return true;
          }
          return false;
        }
      },
      // tree 节点点击事件
      handleNodeClick(data, node) {
        if (this.isEdit) {
          this.$message.warning('操作中...');
          return;
        }
        this.selectEditNode = node;
        this.selectEditNodeData = data;
        this.isNodeClick = true;
      },
      // 查看中回调修改
      viewModify() {
        this.clickEditNodeBtn(this.selectEditNode, this.selectEditNodeData);
      },
      superMsgTypeChange() {
        this.$refs.formContent.validateField('messageTypeName');
      }
    }
  }
</script>

<style lang="scss">
  @import '~gui/style/theme/variables';
  .system-menu-manage {
    display: flex;
    flex-direction: column;
    .system-menu-manage-title-hint {
      margin-left: $ST-6;
      @include P-1;
      color: $CN-6;
    }
    .menu-edit-content, .menu-tree-content {
      flex: 1;
      box-sizing: border-box;
      // display: inline-block;
      width: 50%;
    }
    .menu-edit-content {
      padding-left: 20px;
      .menu-edit-content-empty-text {
        position: relative;
        margin-top: 50%;
        transform: translate(0, -50%);
        color: $CN-7;
        text-align: center;
      }
    }
    .main-content {
      display: flex;
      flex: 1;
    }
    .el-tree {
      margin-top: $SP-10;
    }
    .menu-tree-content {
      border-right: 1px solid $CM-7;
      padding-right: 20px;
    }
    .menu-search-input .el-button {
      border-left-color: transparent;
    }
    .el-tree .el-tree-node__content > .el-tree-node__expand-icon {
      color: #D8D8D8 !important;
    }
    .menu-tree-node-label {
      color: $CN-2;
      margin-right: 20px;
    }
    .menu-tree-node {
      width: 100%;
      span {
        display: inline-block;
      }
      i {
        margin-right: $ST-6;
        font-size: 12px;
      }
    }
    .menu-tree-add-btn-list {
      float: right;
      a {
        color: #428DF5;
        font-size: 12px;
        line-height: 18px;
        & + a {
          margin-left: 20px;
        }
      }
    }
    .menu-edit-content-form-title {
      margin-bottom: 40px;
      @include H-5;
      text-align: center;
    }
    .content-form {
      width: 400px;
    }
    .edit-node-label {
      color: #999;
    }
    .menu-tree-node-label {
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>