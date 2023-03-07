import React, { Component } from "react";
import { Layout, Menu } from "antd";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import waiting from "./waiting";
import finished from "./finished";
import "./index.scss";
const { Header, Content } = Layout;

// 当日所挂患者
export default class index extends Component {
  render() {
    return (
      <div className="daily_regisrationContainer">
        <Layout>
          <Header className="dailydata_header">
            <Menu
              mode="horizontal"
              selectedKeys={[this.props.location.pathname]}
            >
              <Menu.Item key="/index/dailyregist/waiting">
                <Link to={"/index/dailyregist/waiting"}>当日候诊队列</Link>
              </Menu.Item>
              <Menu.Item key={"/index/dailyregist/finished"}>
                <Link to={"/index/dailyregist/finished"}>已完成就诊</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="dailydata_content">
            <Switch>
              <Route
                path={"/index/dailyregist/waiting"}
                component={waiting}
              ></Route>
              <Route
                path={"/index/dailyregist/finished"}
                component={finished}
              ></Route>
              <Redirect to={"/index/dailyregist/waiting"}></Redirect>
            </Switch>
          </Content>
        </Layout>
      </div>
    );
  }
}
