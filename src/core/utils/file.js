import systemUtil from './system';
import query from 'query-string';

export default {
  /**
   * Only support GET method now.
   *
   * @param options
   */
  download(options) {
    let url = `${systemUtil.getBaseUrl()}/${options.url}`;
    url += url.indexOf('?') !== -1 ? '&' : '?';
    url += query.stringify(options.params);
    window.open(url);
  },
};
