import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const index = new Vuex.Store({
  state: {
    configId: '',
    isCollapse: false,
    isLoading: false,
    dataset: [],
    treeMenuVisible: false,
    treeMenuConfig: {},
    treeMenuNode: {},
    treeMenuCommand: ''
  },
  mutations: {
    updateConfigId(store, payload) {
      store.configId = payload.configId
    },
    updateIsCollapse(store, payload) {
      store.isCollapse = payload.isCollapse
    },
    updateIsLoading(store, payload) {
      store.isLoading = payload.isLoading
    },
    updateDataset(store, payload) {
      store.dataset = payload.dataset
    },
    updateTreeMenuVisible(store, payload) {
      store.treeMenuVisible = payload.treeMenuVisible
    },
    updateTreeMenuConfig(store, payload) {
      store.treeMenuConfig = payload.treeMenuConfig
    },
    updateTreeMenuNode(store, payload) {
      store.treeMenuNode = payload.treeMenuNode
    },
    updateTreeMenuCommand(store, payload) {
      store.treeMenuCommand = payload.treeMenuCommand
    }
  }
});

export default index;
