import Login from '@/views/login/router';
import Document from '@/views/document/router';
import Control from '@/views/control/router';

export default [
  ...Document,
  ...Login,
  ...Control
];
