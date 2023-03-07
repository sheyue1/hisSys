import React, { Component } from "react";
import "./index.scss";
import { Layout, Menu, Avatar, Popover, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Route, Link, Switch } from "react-router-dom";
import psearch from "./psearch";
import pregistered from "./pregistered";
import inforeg from "./inforeg";
import daily_registration from "./daily_registration";
import diagnosis from "./diagnosis";
import drugpurchase from "./drugpurchase";
import accessrecords from "./accessrecords";
import infomodify from "./infomodify";
import regcancel from "./regcancel";
import { connect } from "react-redux";
import { changeLoginState } from "../../redux/actions/logindata";
import { accessControl } from "../../unit/request";
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class Maincontrol extends Component {
  state = {
    selecKey: "",
  };
  componentDidMount() {
    console.log(this.props);
  }
  layout = () => {
    message.success({
      content: "退出登录成功",
      duration: 1,
      onClose: () => {
        this.props.changeLoginState(false);
      },
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  render() {
    const { account, date, user_name, admin } = this.props.logindata;
    return (
      <Layout className="Main_Layout">
        <Header className="Header">
          医院信息系统
          <div className="userID">{user_name}</div>
          <div className="useratr">
            <Popover
              title={"当前账号: " + account}
              content={
                <>
                  <p>登录时间：{date}</p>
                  <p>账号权限：{admin}</p>
                  <Button onClick={this.layout}>退出登录</Button>
                </>
              }
            >
              <Avatar icon={<UserOutlined />}></Avatar>
            </Popover>
          </div>
        </Header>
        <Layout>
          <Sider theme="light" width={250} className="main_sider">
            <Menu
              className="Menu"
              style={{ borderRight: 0 }}
              mode="inline"
              selectedKeys={[
                "/" +
                  this.props.location.pathname.split("/").slice(1, 3).join("/"),
              ]}
            >
              <SubMenu
                title="病人挂号"
                key="level1"
                disabled={accessControl(admin, "挂号员")}
              >
                <Menu.Item key="/index/psearch">
                  <Link to={"/index/psearch"}>病人信息搜索</Link>
                </Menu.Item>
                <Menu.Item key="/index/inforeg">
                  <Link to={"/index/inforeg"}>病人信息录入</Link>
                </Menu.Item>
                <Menu.Item key="/index/pregistered">
                  <Link to={"/index/pregistered"}>病人挂号</Link>
                </Menu.Item>
                <Menu.Item key="/index/regcancel">
                  <Link to={"/index/regcancel"}>取消挂号</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                title="医生工作站"
                key="level2"
                disabled={accessControl(admin, "门诊医生")}
              >
                <Menu.Item key="/index/dailyregist">
                  <Link to={"/index/dailyregist"}>当日挂号患者</Link>
                </Menu.Item>
                <Menu.Item key="/index/diagnosis">
                  <Link to={"/index/diagnosis"}>诊单填写</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                title="药房管理"
                key="level3"
                disabled={accessControl(admin, "药品管理员")}
              >
                <Menu.Item key="/index/drugpurchase">
                  <Link to={"/index/drugpurchase"}>患者购药</Link>
                </Menu.Item>
                <Menu.Item key="/index/accessrecords">
                  <Link to={"/index/accessrecords"}>出入库记录</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content className="content_layout">
            <Switch>
              <Route path={"/index/psearch"} component={psearch}></Route>
              <Route
                path={"/index/pregistered"}
                component={pregistered}
              ></Route>
              <Route path={"/index/inforeg"} component={inforeg}></Route>
              <Route
                path={"/index/dailyRegist"}
                component={daily_registration}
              ></Route>
              <Route path={"/index/diagnosis"} component={diagnosis}></Route>
              <Route
                path={"/index/drugpurchase"}
                component={drugpurchase}
              ></Route>
              <Route
                path={"/index/accessrecords"}
                component={accessrecords}
              ></Route>
              <Route path={"/index/infomodify"} component={infomodify}></Route>
              <Route path={"/index/regcancel"} component={regcancel}></Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default connect(
  (state, props) => ({
    logindata: state.logindata,
  }),
  { changeLoginState }
)(Maincontrol);
