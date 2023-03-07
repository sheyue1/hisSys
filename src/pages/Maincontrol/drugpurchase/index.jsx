import React, { Component } from "react";
import { Input, Table, Button, Form, Select, Row, Col, message } from "antd";
import request from "../../../unit/request";
import "./index.scss";

const form = React.createRef();
const rules = [{ required: true, message: "当前项不能为空" }];
// 患者购药
const columns = [
  {
    title: "药品编号",
    dataIndex: "medicinal_id",
    key: "medicinal_id",
  },
  {
    title: "药品名称",
    dataIndex: "medicinal_name",
    key: "medicinal_name",
  },
  {
    title: "单价",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "购买数量",
    dataIndex: "mrp_amount",
    key: "mrp_amount",
  },
  {
    title: "处方开具时间",
    dataIndex: "mrp_time",
    key: "mrp_time",
  },
  {
    title: "购买者",
    dataIndex: "name",
    key: "name",
  },
];
export default class index extends Component {
  state = { loading: false, datalist: [], reg_id: "" };

  searchdata = async () => {
    console.log(this.searchvalue.input.value);
    this.setState({ loading: true });
    const res = await request(
      "GET",
      "/buying/findByRegId",
      { reg_id: this.searchvalue.input.value },
      {}
    );
    console.log(res.data.data);
    this.setState({
      loading: false,
      datalist: res.data.data,
      reg_id: this.searchvalue.input.value,
    });
    const total_price = res.data.data.reduce((acumulate, cur) => {
      return cur.mrp_amount * cur.price + acumulate;
    }, 0);
    form.current.setFieldsValue({ total_price });
  };

  formFinished = async () => {
    const res = await request("GET", "/buying/buyingFinishByRegId", {
      reg_id: this.state.reg_id,
    });
    message.success({ content: "出库完成" });
  };
  render() {
    return (
      <div className="drugpurchasecontainer">
        <div className="search">
          <Input
            className="input"
            placeholder="输入挂号流水号"
            ref={(c) => (this.searchvalue = c)}
          ></Input>
          <Button onClick={this.searchdata} type="primary" className="but">
            点击查找
          </Button>
        </div>
        <Table
          dataSource={this.state.datalist}
          columns={columns}
          loading={this.state.loading}
        />
        <Form ref={form} className="form" onFinish={this.formFinished}>
          <Row>
            <Col span={8}>
              <Form.Item
                label="总价"
                name="total_price"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="缴费方式"
                name="medicinal_payment"
                labelCol={{ span: 8 }}
                rules={rules}
              >
                <Select style={{ width: 120 }} placeholder="缴费方式">
                  <Select.Option value="自费">自费</Select.Option>
                  <Select.Option value="公费">公费</Select.Option>
                  <Select.Option value="医保">医保</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="结算方式"
                name="medicinal_settlement"
                rules={rules}
                labelCol={{ span: 8 }}
              >
                <Select style={{ width: 120 }} placeholder="结算方式">
                  <Select.Option value="门诊">现金</Select.Option>
                  <Select.Option value="急诊">银行卡</Select.Option>
                  <Select.Option value="特训">医保卡</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-around">
            <Col>
              <Button htmlType="submit" type="primary" className="submit">
                完成购买(出库）
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
