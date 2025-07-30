import {
  DashboardOutlined,
  AntDesignOutlined,
  SafetyOutlined,
  StopOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  FileTextOutlined,
  GiftOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileDoneOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";

// Lấy user từ localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Cấu hình menu cho USER role
const dashBoardNavTreeForUser = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: "category-management",
        path: `${APP_PREFIX_PATH}/apps/category`,
        title: "sidenav.dashboard.category",
        icon: AppstoreOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "brand-management",
        path: `${APP_PREFIX_PATH}/apps/brand`,
        title: "sidenav.dashboard.brand",
        icon: TagOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "product-management",
        path: `${APP_PREFIX_PATH}/apps/product`,
        title: "sidenav.dashboard.product",
        icon: ShoppingOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "order-management",
        path: `${APP_PREFIX_PATH}/apps/order`,
        title: "sidenav.dashboard.order",
        icon: FileDoneOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "news-management",
        path: `${APP_PREFIX_PATH}/apps/new`,
        title: "sidenav.dashboard.new",
        icon: FileTextOutlined,
        breadcrumb: true,
        submenu: [],
      },
      // {
      //   key: "apps-chat",
      //   path: `${APP_PREFIX_PATH}/apps/chat`,
      //   title: "sidenav.apps.chat",
      //   icon: MessageOutlined,
      //   breadcrumb: false,
      //   submenu: [],
      // },
    ],
  },
];

// Cấu hình menu đầy đủ cho admin hoặc các role khác
const dashBoardNavTreeFull = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: "dashboards-default",
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        title: "sidenav.dashboard.default",
        icon: DashboardOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "category-management",
        path: `${APP_PREFIX_PATH}/apps/category`,
        title: "sidenav.dashboard.category",
        icon: AppstoreOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "brand-management",
        path: `${APP_PREFIX_PATH}/apps/brand`,
        title: "sidenav.dashboard.brand",
        icon: TagOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "product-management",
        path: `${APP_PREFIX_PATH}/apps/product`,
        title: "sidenav.dashboard.product",
        icon: ShoppingOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "order-management",
        path: `${APP_PREFIX_PATH}/apps/order`,
        title: "sidenav.dashboard.order",
        icon: FileDoneOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "news-management",
        path: `${APP_PREFIX_PATH}/apps/new`,
        title: "sidenav.dashboard.new",
        icon: FileTextOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "voucher-management",
        path: `${APP_PREFIX_PATH}/apps/voucher`,
        title: "sidenav.dashboard.voucher",
        icon: GiftOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "review-management",
        path: `${APP_PREFIX_PATH}/apps/review`,
        title: "sidenav.dashboard.review",
        icon: StarOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "user-management",
        path: `${APP_PREFIX_PATH}/apps/user`,
        title: "sidenav.dashboard.user",
        icon: UserOutlined,
        breadcrumb: true,
        submenu: [],
      },
      // {
      //   key: "apps-chat",
      //   path: `${APP_PREFIX_PATH}/apps/chat`,
      //   title: "sidenav.apps.chat",
      //   icon: MessageOutlined,
      //   breadcrumb: false,
      //   submenu: [],
      // },
    ],
  },
];

// Lựa chọn menu hiển thị dựa trên role
const dashBoardNavTree =
  user && user.role === "STAFF"
    ? dashBoardNavTreeForUser
    : dashBoardNavTreeFull;

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
