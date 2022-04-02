import { Dialog } from 'element-ui'
import Vue from 'vue'

export const dialogItem = Vue.extend({
  name: 'DialogItem',
  components: {
    [Dialog.name]: Dialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    beforeConfirm: {
      type: Function,
      default: () => {}
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    btns: {
      type: Object,
      default: () => {
        return {
          negative: '取消',
          positive: '确认',
          other: []
        }
      }
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: true,
      loading: false
    }
  },
  created() {
    this.vm = this
  },
  mounted() {
    window.addEventListener('hashchange', this.hide)
  },
  destroyed() {
    window.removeEventListener('hashchange', this.hide)
  },
  methods: {
    onClose() {
      this.$destroy()
      this.$el.remove()
    },
    visibleChange(val) {
      this.visible = val
    },
    showLoading() {
      this.loading = true
    },
    hideLoading() {
      this.loading = false
    },
    hide() {
      this.visible = false
    },
    beforeCloseByCancel(done) {
      if (this.loading) {
        return this.$message.info('正在通信中...请稍后关闭')
      }
      if (this.$root.formEl && this.$root.formEl.formHasModified) {
        this.$confirm('确认关闭？未保存的修改可能丢失')
          .then(done)
          .catch(() => {})
      } else {
        done();
        this.close && this.close();
      }
    },
    handleNegativeClick() {
      this.beforeCloseByCancel(() => {
        this.visible = false
      })
    },
    handlePositiveClick() {
      this.beforeConfirm(this, this.$root.formEl, () => {
        this.visible = false
        this.$emit('confirm', this, this.$root.formEl)
      })
    },
    btnClick(btn) {
      return () => {
        btn.onClick(this.vm, this.$root.formEl, this.$root)
      }
    }
  },
  render() {
    let footer = null;
    if (!this.hideFooter) { // 如果不需要隐藏底部
      footer = this.$slots.footer // 获取footer插槽里的内容
      if (!footer) {
        this.btns.other = this.btns.other || []
        const otherBth = this.btns.other.map((btn, index) => 
          <el-button
            key={index}
            type={btn.type}
            style={btn.style}
            on-click={this.btnClick(btn)}
          >
            {btn.name}
          </el-button>
        )
        let negativeBtn = null
        let positiveBtn = null
        if (this.btns.negative) {
          negativeBtn = 
            <el-button
              disabled={this.loading}
              on-click={this.handleNegativeClick}
            >{ this.btns.negative }
            </el-button>
          
        }
        if (this.btns.positive) {
          positiveBtn = 
            <el-button
              disabled={this.loading}
              type="primary"
              on-click={this.handlePositiveClick}
            >{ this.btns.positive }
            </el-button>
          
        }
        footer = 
          <div slot="footer">
            {otherBth}
            {negativeBtn}
            {positiveBtn}
          </div>
        
      }
    }

    return (
      <el-dialog
        title={this.title}
        beforeClose={this.beforeCloseByCancel}
        visible={this.visible}
        closeOnClickModal={false}
        appendToBody={true}
        attrs={this.$attrs}
        on= {{
          'update:visible': this.visibleChange
        }}
      >
        {this.$slots.default}
        {footer}
      </el-dialog>
    )
  }
})

const defaultAttrs = {
  width: '700px',
  beforeConfirm(dialog, form, done) {
    done()
  }
}
// title: 弹窗的标题
// customAttrs: 需要传递给弹窗或者子组件的props
// dialogContent: 弹窗中需要渲染的子组件
export default (title = '对话框', customAttrs = {}, dialogContent = {}) => {
  const tempDom = document.createElement('div')
  document.body.appendChild(tempDom)
  // 重载：若无需传 customAttrs 的话, 第二个参数可以直接写 dialogContent
  if (customAttrs.render) {
    dialogContent = customAttrs
    customAttrs = {}
  }

  customAttrs = { ...defaultAttrs, ...customAttrs }
  customAttrs.title = title
  return new Promise((resolve) => {
    const baseDialog = new Vue({
      name: 'BaseDialog',
      components: {
        dialogItem,
      },
      data: function() {
        return {}
      },
      created() {
        this.formEl = {}
      },
      mounted() {
        this.$nextTick(() => {
          this.formEl = this.$refs['dialog-content']
          this.formEl.$_dialog = this.$refs.dialog
        })
      },
      render(h) {
        return h(
          'dialog-item',
          {
            attrs: customAttrs,
            ref: 'dialog',
            on: {
              confirm(dialog, content) {
                resolve({ dialog, content })
              }
            }
          },
          [
            h(dialogContent, {
              props: customAttrs,
              ref: 'dialog-content'
            }),
          ]
        )
      }
    })
    baseDialog.$mount(tempDom)
  })
}
