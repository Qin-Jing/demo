import user from './user';
import protal from './protal';
import login from './login';
import base from './base';
import newsTemplate from './newsTemplate';
import newsChannel from './newsChannel';
import control from './control';

export default {
  ...user,
  ...protal,
  ...login,
  ...base,
  ...newsTemplate,
  ...newsChannel,
  ...control
};
