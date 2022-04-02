const mixin = {
  computed: {
    configId: {
      get() {
        return this.$store.state.configId;
      },
      set(configId) {
        this.$store.commit('updateConfigId', { configId });
      }
    },
    isCollapse: {
      get() {
        return this.$store.state.isCollapse;
      },
      set(isCollapse) {
        this.$store.commit('updateIsCollapse', { isCollapse });
      }
    },
    dataset: {
      get() {
        return this.$store.state.dataset;
      },
      set(dataset) {
        this.$store.commit('updateDataset', { dataset });
      }
    },
    isLoading: {
      get() {
        return this.$store.state.isLoading;
      },
      set(isLoading) {
        this.$store.commit('updateIsLoading', { isLoading });
      }
    },
    treeMenuVisible: {
      get() {
        return this.$store.state.treeMenuVisible;
      },
      set(treeMenuVisible) {
        this.$store.commit('updateTreeMenuVisible', { treeMenuVisible });
      }
    },
    treeMenuConfig: {
      get() {
        return this.$store.state.treeMenuConfig;
      },
      set(treeMenuConfig) {
        this.$store.commit('updateTreeMenuConfig', { treeMenuConfig });
      }
    },
    treeMenuNode: {
      get() {
        return this.$store.state.treeMenuNode;
      },
      set(treeMenuNode) {
        this.$store.commit('updateTreeMenuNode', { treeMenuNode });
      }
    },
    treeMenuCommand: {
      get() {
        return this.$store.state.treeMenuCommand;
      },
      set(treeMenuCommand) {
        this.$store.commit('updateTreeMenuCommand', { treeMenuCommand });
      }
    }
  },
  methods: {
  }
};

export default mixin;
