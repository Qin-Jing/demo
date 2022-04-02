import Vue from 'vue';
import {
  Loading,
  Input,
  Button,
  Form,
  Select,
  FormItem,
  TimeSelect,
  Notification,
  Message,
  MessageBox,
  Container,
  Header,
  Aside,
  Main,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  Carousel,
  CarouselItem,
  Footer,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Pagination,
  Option,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Tooltip,
  Upload,
  RadioGroup,
  Radio,
  Popover,
  Alert,
  ButtonGroup,
  Progress,
  DatePicker,
  Timeline,
  TimelineItem,
  Tabs,
  TabPane,
  Tree,
  Cascader,
  RadioButton,
  Transfer,
  Scrollbar
} from 'gweb-ui';

import 'gui/style/element/variables.scss';
import 'font-awesome/css/font-awesome.css';
import 'gui/style/style.scss';
import '@/scss/style.scss';

export default {
  init() {
    Vue.use(Loading);
    Vue.use(MenuItem);
    Vue.use(Submenu);
    Vue.use(Dropdown);
    Vue.use(Menu);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Container);
    Vue.use(Header);
    Vue.use(Aside);
    Vue.use(Main);
    Vue.use(Select);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(TimeSelect);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Footer);
    Vue.use(Breadcrumb);
    Vue.use(BreadcrumbItem);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Option);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.use(Dialog);
    Vue.use(Tooltip);
    Vue.use(Upload);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(Popover);
    Vue.use(Alert);
    Vue.use(ButtonGroup);
    Vue.use(Progress);
    Vue.use(DatePicker);
    Vue.use(Timeline);
    Vue.use(TimelineItem);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Tree);
    Vue.use(Cascader);
    Vue.use(RadioButton);
    Vue.use(Transfer);
    Vue.use(Scrollbar);

    Vue.prototype.$ELEMENT = { size: 'medium' };

    Vue.prototype.$message = Message;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$notify = Notification;
  }
};
