import React, { Component } from "react";
import { Form, Input, Button, Checkbox, Alert, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  changeLoginState,
  changeAccountMessage,
} from "../../redux/actions/logindata";
import "./index.scss";
import moment from "moment";
import request from "../../unit/request";

class login extends Component {
  state = {
    isVadidateFailure: false, //登录错误提醒
  };
  componentDidMount() {}
  onFinish = async (values) => {
    let res;
    console.log("完成输入");
    // 发送登录请求
    try {
      res = await request(
        "POST",
        "/login/accountVerification",
        {},
        {
          account: values.username,
          key: values.password,
        }
      );
    } catch (error) {
      console.log("请求出错", error);
      message.error("登录失败，请检查网络状况");
      return;
    }
    if (res.data.code === 20003 || res.data.code === 20001) {
      console.log(res);
      this.setState({
        isVadidateFailure: true, //当验证没通过的提示信息
      });
      return;
    }
    const { admin, user_name, details } = res.data.data;
    console.log(res);
    message.success({
      content: "登陆成功",
      duration: 1,
      onClose: () => {
        this.props.changeLoginState(true); //更新登录状态
      },
    });
    this.props.changeAccountMessage({
      account: values.username, //姓名
      user_name,
      admin, //权限
      details,
      date: moment().format("YYYY/MM/DD HH:MM:SS"), //登录时间
    }); //更新redux中的用户数据
  };

  onFinishFailed = (errorValue) => {
    //提交验证失败
    console.log(errorValue);
  };

  onFieldsChange = () => {
    //字段改变时的回调
    this.setState({
      isVadidateFailure: false, //开始输入账号或者密码时，登录错误提醒消失
    });
  };
  render() {
    return (
      <div className="appContainer">
        {/* <div className="tittle">医院信息系统</div> */}
        <div className="login-form-container">
          <Form
            name="user_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            onFieldsChange={this.onFieldsChange}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "账号不能为空" },
                { max: 10, message: "长度超出" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="工号"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "密码不能为空" },
                { max: 15, message: "长度超出" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item noStyle>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>在设备上记住我</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="/">
                忘记密码
              </a>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登 录
              </Button>
              还没有账号？<a href="/">点击注册</a>
            </Form.Item>
          </Form>
          {this.state.isVadidateFailure ? (
            <Alert
              message="登陆失败，账号或密码输入有误"
              type="error"
              showIcon
              className="loginErr"
            />
          ) : (
            ""
          )}
        </div>
        <div className="info">
          <a href="https://beian.miit.gov.cn/" target="_blank">
            备案号:	
          </a>
          <a href="https://beian.miit.gov.cn/" target="_blank">
            湘ICP备2021007381号-1
          </a>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    logindata: state.logindata,
  }),
  { changeLoginState, changeAccountMessage }
)(login);
