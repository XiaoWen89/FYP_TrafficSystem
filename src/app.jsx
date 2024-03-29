import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api_original';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath='/user/registration'
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  /*
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; // 如果不是登录页面，执行
  */
  const userInfo = () => {
    const loginString = sessionStorage.getItem('userInfo');
    if (loginString){
      return JSON.parse(loginString);
    }else{
      if (history.location.pathname === "/user/registration"){
        history.push(registerPath);
      }else{
        history.push(loginPath);
      }
    }

    return undefined;
  }

  if (history.location.pathname !== loginPath) {
    const currentUser = userInfo();

    //const currentUser = await fetchUserInfo();
    return {
      userInfo,
      currentUser,
      settings: defaultSettings,
    };
  }

  return {
    userInfo,
    settings: defaultSettings,
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    /*
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },*/
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        console.log(history.location.pathname)
        if (history.location.pathname==="/user/registration"){
          history.push(registerPath);
        }
        else{
        history.push(loginPath);}
      }
      
    },
    /*
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    */
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
