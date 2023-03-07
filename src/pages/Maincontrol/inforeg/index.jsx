import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  DatePicker,
  Divider,
  message,
} from "antd";
import React, { Component } from "react";
import "./index.scss";
import moment from "moment";
import request from "../../../unit/request";
import { duration } from "moment";

const rules = [{ required: true, message: "当前项不能为空" }];
const formRef = React.createRef();
export default class index extends Component {
  formFinish = async (value) => {
    console.log(value.birthday.format("YYYY/MM/DD"));
    let res;
    try {
      res = await request(
        "POST",
        "/patient/add",
        {},
        { ...value, birthday: value.birthday.format("YYYY/MM/DD") }
      );
      message.success({
        content: "患者信息注册成功,为你跳转至挂号页面",
        onClose: () => {
          this.props.history.push({
            pathname: "/index/pregistered",
            state: { ...value, birthday: value.birthday.format("YYYY/MM/DD") },
          });
        },
        duration: 2,
      });
    } catch (error) {
      console.log(error);
      message.error("提交失败，请检查网络状况");
      return;
    }
  };

  // 通过生日自动计算年龄
  date_change = (e) => {
    const now = new moment();
    const { _data } = moment.duration(now.diff(e));
    console.log(_data);
    formRef.current.setFieldsValue({
      ...formRef.current.getFieldsValue(),
      age: _data.years,
    });
  };

  render() {
    return (
      <div className="inforegcontainer">
        {/* 身份证号码 名字 性别 民族 电话 年龄 地址 过敏药物 生日 联系人 联系人电话  */}
        <Form
          ref={formRef}
          className="formstyle"
          onFinish={this.formFinish}
          onFinishFailed={this.formFailed}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="id"
                label="身份证号"
                labelCol={{ span: 4 }}
                rules={[{ len: 18, message: "身份证过短或过长" }, ...rules]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item
                name="name"
                label="姓名"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                rules={rules}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="sex" label="性别" rules={rules}>
                <Select placeholder="性别" style={{ width: 80 }}>
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="nation"
                label="民族"
                wrapperCol={{ span: 4 }}
                rules={rules}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item
                name="age"
                label="年龄"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 4 }}
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="birthday" label="出生日期" rules={rules}>
                <DatePicker
                  placement="bottomLeft"
                  placeholder="请选择日期"
                  onChange={this.date_change}
                ></DatePicker>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="phone_num"
                label="联系方式"
                wrapperCol={{ span: 16 }}
                rules={rules}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="address" label="家庭地址" rules={rules}>
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="allergy"
                label="过敏药物"
                labelCol={{ span: 4 }}
                rules={rules}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                name="relative"
                label="联系人"
                labelCol={{ span: 6 }}
                rules={rules}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col offset={1}>
              <Form.Item
                name="relative_phone_num"
                label="联系人电话"
                rules={rules}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Divider></Divider>
          <Row justify="space-around">
            <Col>
              <Form.Item>
                <Button htmlType="submit" type="primary" size="large">
                  病人信息录入
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
