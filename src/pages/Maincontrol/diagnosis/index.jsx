import React, { Component } from "react";
import {
  Descriptions,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Table,
  InputNumber,
  message,
} from "antd";
import "./index.scss";
import request from "../../../unit/request";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const defaultdata = {
  reg_id: "123456789123456789123",
  id: "default",
  name: "default",
  sex: "default",
  phone_num: "default",
  age: "default",
  address: "default",
  allergy: "default",
  birthday: "default",
  relative: "default",
  relative_phone_num: "default",
  nation: "default",
};

const { TextArea } = Input;
const { Column } = Table;
const formtop = React.createRef();
const formbut = React.createRef();
const rules = [{ required: true, message: "当前项不能为空" }];
let timeout, currentValue;

/**
 *
 *搜索的节流函数,300毫秒内的搜索只记最后的
 * @param {*} value  搜索的药品
 * @param {*} callback 调用回调
 */
function search(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  async function getData() {
    const res = await request("GET", "/medicine/findByFirstFewChar", {
      firstFewChar: value,
    });

    if (value === currentValue) {
      const data = [];
      res.data.data.forEach((item) => {
        data.push({
          // 只拿药品id、药品名字、药品单价、基本单位
          medicinal_id: item.medicinal_id,
          medicinal_name: item.medicinal_name,
          medicinal_price: item.medicinal_price,
          medicinal_unit: item.medicinal_unit,
        });
      });
      callback(data);
    }
  }
  timeout = setTimeout(getData, 300);
}

export default class index extends Component {
  state = {
    patientInfo: defaultdata,
    drugSearchdata: [],
    drugValue: undefined,
    allselectDrugs: [],
    loading: false,
  };

  componentDidMount = async () => {
    // 需要改为通过路由获取数据
    console.log(this.props);
    if (!this.props.location.state) {
      message.info("请先叫号，再进行诊断!");
      return;
    }
    const { id, reg_id, mrp_operator } = this.props.location.state;
    const res = await request("GET", "/patient/findById", { id });
    console.log(res);
    this.setState({
      patientInfo: { ...res.data.data, reg_id },
      reg_id,
      mrp_operator,
    });
  };

  handleSearch = (value) => {
    if (value) {
      search(value, (drugSearchdata) => this.setState({ drugSearchdata }));
    } else {
      this.setState({ drugSearchdata: [] });
    }
  };

  handleChange = (drugValue) => {
    this.setState({ drugValue });
  };

  adddrug = () => {
    const { allselectDrugs, drugValue } = this.state;
    if (!drugValue) {
      return;
    }
    const flag = allselectDrugs.findIndex((item) => {
      return item.medicinal_id === drugValue;
    });
    console.log(flag);
    if (flag >= 0) {
      message.info({ content: "不能重复添加药品", duration: 2 });
      return;
    }
    const selectitem = this.state.drugSearchdata.find((item) => {
      return item.medicinal_id === drugValue;
    });
    allselectDrugs.push({ ...selectitem, key: selectitem.medicinal_id });
    this.setState({ allselectDrugs: [...allselectDrugs] });
  };

  // 删除药品
  removedrug = (text, record, index) => {
    const that = this;
    return function (e) {
      const { allselectDrugs } = that.state;
      const index = allselectDrugs.findIndex((item) => {
        return item.medicinal_id === text.medicinal_id;
      });
      allselectDrugs.splice(index, 1);
      that.setState({
        allselectDrugs: [...allselectDrugs],
      });
    };
  };

  // 提交两个表
  allsubmit = () => {
    formtop.current.submit();
    formbut.current.submit();
  };

  // 上面表提交表单且数据验证成功后回调事件
  formtopfinished = async (value) => {
    await request(
      "POST",
      "/diagnosis/add",
      {},
      {
        ...value,
        time: moment().format("YYYY-MM-DD HH:MM:00"),
        reg_id: this.state.reg_id,
      }
    );
  };

  // 下面表提交表单且数据验证成功后回调事件
  formbutfinished = async (values) => {
    this.setState({
      loading: true,
    });
    await Promise.all(
      this.state.allselectDrugs.map((item) => {
        console.log({
          reg_id: this.state.reg_id,
          medicinal_id: item.medicinal_id,
          mrp_time: moment().format("YYYY-MM-DD HH:MM"),
          mrp_amount: values[item.medicinal_id],
          mrp_operator: this.state.mrp_operator,
          price: item.medicinal_price,
          is_buying_finish: 0,
        });
        return request(
          "POST",
          "/buying/add",
          {},
          {
            reg_id: this.state.reg_id,
            medicinal_id: item.medicinal_id,
            mrp_time: moment().format("YYYY-MM-DD HH:MM"),
            mrp_amount: values[item.medicinal_id],
            mrp_operator: this.state.mrp_operator,
            price: item.medicinal_price,
            is_buying_finish: 0,
          }
        );
      })
    );
    this.setState({
      loading: false,
    });
  };

  render() {
    const { patientInfo } = this.state;
    return (
      <div className="diagonalContainer">
        <Descriptions
          bordered={true}
          title="患者基本信息："
          className="Descriptions"
        >
          <Descriptions.Item label="挂号流水号">
            {patientInfo.reg_id}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号">
            {patientInfo.id}
          </Descriptions.Item>
          <Descriptions.Item label="姓名">{patientInfo.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{patientInfo.sex}</Descriptions.Item>
          <Descriptions.Item label="出生日期">
            {patientInfo.birthday}
          </Descriptions.Item>
          <Descriptions.Item label="电话">
            {patientInfo.phone_num}
          </Descriptions.Item>
          <Descriptions.Item label="联系人">
            {patientInfo.relative}
          </Descriptions.Item>
          <Descriptions.Item label="联系人电话">
            {patientInfo.relative_phone_num}
          </Descriptions.Item>
          <Descriptions.Item label="过敏情况">
            {patientInfo.allergy}
          </Descriptions.Item>
        </Descriptions>
        <Form layout="vertical" ref={formtop} onFinish={this.formtopfinished}>
          <Form.Item label="患者主诉" name="complaint" rules={rules}>
            <TextArea
              showCount
              maxLength={100}
              style={{ height: 70 }}
            ></TextArea>
          </Form.Item>
          <Form.Item label="病史及体征" name="mh_cs" rules={rules}>
            <TextArea
              showCount
              maxLength={100}
              style={{ height: 70 }}
            ></TextArea>
          </Form.Item>
          <Form.Item label="医嘱" name="doc_advice" rules={rules}>
            <TextArea
              showCount
              maxLength={100}
              style={{ height: 100 }}
            ></TextArea>
          </Form.Item>
        </Form>
        <Divider></Divider>
        <div className="tittle">开具药品：</div>
        <div className="search">
          <SearchOutlined
            style={{ fontSize: "18px", lineHeight: "32px", marginRight: "5px" }}
          />
          <Select
            showSearch
            value={this.state.drugValue}
            style={{ width: 200 }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            notFoundContent={null}
            placeholder="输入想要查找的药品名"
          >
            {this.state.drugSearchdata.map((d) => (
              <Select.Option key={d.medicinal_id}>
                {d.medicinal_name}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={this.adddrug} className="but">
            添加药品
          </Button>
        </div>
        <Form layout="horizontal" ref={formbut} onFinish={this.formbutfinished}>
          <Table dataSource={this.state.allselectDrugs} bordered={true}>
            <Column
              title="药品编号"
              dataIndex="medicinal_id"
              key="medicinal_id"
              width={200}
            ></Column>
            <Column
              title="药品名称"
              dataIndex="medicinal_name"
              key="medicinal_name"
              width={200}
            ></Column>
            <Column
              title="药品单位"
              dataIndex="medicinal_unit"
              key="medicinal_unit"
            ></Column>
            <Column
              title="药品单价"
              dataIndex="medicinal_price"
              key="medicinal_price"
            ></Column>
            <Column
              title="药品单价"
              render={(text, record, index) => {
                return (
                  <div className="action">
                    <Form.Item
                      label="数量"
                      name={text.medicinal_id}
                      key={text.medicinal_id}
                      rules={rules}
                    >
                      <InputNumber></InputNumber>
                    </Form.Item>
                    <Button
                      type="primary"
                      onClick={this.removedrug(text, record, index)}
                      style={{ marginLeft: "10px" }}
                    >
                      删除药品
                    </Button>
                  </div>
                );
              }}
            ></Column>
          </Table>
        </Form>
        <Button
          onClick={this.allsubmit}
          size="large"
          type="primary"
          className="diagnosis_submit"
          loading={this.state.loading}
        >
          提交就诊记录
        </Button>
      </div>
    );
  }
}
