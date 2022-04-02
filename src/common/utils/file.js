import systemUtil from '@/core/utils/system';

export default {
  /**
   * query apaas file upload url
   */
  queryFileUploadUrl() {
    return `${systemUtil.getBaseUrl()}file/uploadFile`;
  },
  /**
   * query apaas file url
   * 
   * @param fileName
   */
  queryFileUrl(fileName) {
    return `${systemUtil.getBaseUrl()}file/query?fileName=${fileName}`;
  }
};
