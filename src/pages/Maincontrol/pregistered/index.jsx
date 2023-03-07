import React, { Component } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Radio,
  Divider,
  message,
  DatePicker,
  TimePicker,
} from "antd";
import "./index.scss";
import ReactToPrint from "react-to-print";
import request, { calfare } from "../../../unit/request";
import moment from "moment";
const secriondata = [
  {
    key: "A",
    value: "内科",
    content: [
      {
        key: "A01",
        value: "心血管科",
      },
      {
        key: "A02",
        value: "消化内科",
      },
      {
        key: "A03",
        value: "肾内科",
      },
      {
        key: "A04",
        value: "神经内科",
      },
      {
        key: "A05",
        value: "呼吸内科",
      },
      {
        key: "A06",
        value: "内分泌科",
      },
      {
        key: "A07",
        value: "血液科",
      },
      {
        key: "A08",
        value: "风湿免疫科",
      },
      {
        key: "A09",
        value: "重症监护科",
      },
      {
        key: "A10",
        value: "综合急诊科",
      },
    ],
  },
  {
    key: "B",
    value: "外科",
    content: [
      {
        key: "B01",
        value: "泌尿外科",
      },
      {
        key: "B02",
        value: "胃肠甲状腺外科",
      },
      {
        key: "B03",
        value: "乳腺科",
      },
      {
        key: "B04",
        value: "心胸血管外科",
      },
      {
        key: "B05",
        value: "肝胆外科",
      },
      {
        key: "B06",
        value: "肛肠科",
      },
    ],
  },
  {
    key: "C",
    value: "妇产科",
    content: [
      {
        key: "C01",
        value: "一妇科",
      },
      {
        key: "C02",
        value: "二妇科",
      },
      {
        key: "C03",
        value: "产科",
      },
      {
        key: "C04",
        value: "新生儿科",
      },
    ],
  },
  {
    key: "D",
    value: "骨科",
    content: [
      {
        key: "D01",
        value: "创伤骨科",
      },
      {
        key: "D02",
        value: "脊柱骨科",
      },
      {
        key: "D03",
        value: "关节一科",
      },
      {
        key: "D04",
        value: "关节二科",
      },
      {
        key: "D05",
        value: "颅脑科",
      },
    ],
  },
  {
    key: "E",
    value: "肿瘤科",
    content: [
      {
        key: "E01",
        value: "一肿瘤科",
      },
      {
        key: "E02",
        value: "二肿瘤科",
      },
      {
        key: "E03",
        value: "三肿瘤科",
      },
      {
        key: "E04",
        value: "四肿瘤科",
      },
    ],
  },
  {
    key: "F",
    value: "其他科",
    content: [
      {
        key: "F01",
        value: "针灸科",
      },
      {
        key: "F02",
        value: "推拿科",
      },
      {
        key: "F03",
        value: "儿科",
      },
      {
        key: "F04",
        value: "护理部",
      },
      {
        key: "F05",
        value: "麻醉科",
      },
      {
        key: "F06",
        value: "口腔科",
      },
      {
        key: "F07",
        value: "耳鼻喉科",
      },
      {
        key: "F08",
        value: "眼科",
      },
      {
        key: "F09",
        value: "病理科",
      },
    ],
  },
];

const printref = React.createRef();
const formRef = React.createRef();
const rules = [{ required: true, message: "当前项不能为空" }];
export default class index extends Component {
  state = {
    transferData: null,
    sectionList: [],
    isReg_docDataLoading: false,
    docList: [],
  };
  componentDidMount() {
    const transferData = this.props.location.state;
    if (transferData) {
      this.setState({
        transferData,
      });
      formRef.current.setFieldsValue({
        reg_id: Date.now() + transferData.id.slice(transferData.id.length - 7),
        ...transferData,
      });
    }
  }
  formFinish = async (values) => {
    const {
      reg_id,
      id,
      reg_level,
      reg_section,
      doc_id,
      reg_payment,
      reg_type,
      is_buy_rec,
      reg_coast,
      reg_settlement,
      reg_date,
      reg_mine,
    } = values;
    let res;

    const data = {
      reg_id,
      id,
      reg_level,
      reg_section,
      doc_id,
      reg_payment,
      reg_type,
      is_buy_rec: is_buy_rec ? 1 : 0,
      reg_coast,
      reg_settlement,
      is_reg_cancel: 0,
      is_reg_ok: 0,
      reg_time: reg_date.format("YYYY/MM/DD") + "-" + reg_mine.format("HH:MM"),
    };
    try {
      res = await request("POST", "/reg/add", {}, data);
    } catch (error) {
      console.log(error);
      message.error("提交错误，请检查网络状态");
      return;
    }
    console.log(res);
    message.success({
      content: "挂号成功",
      duration: 1,
      // onClose: () => {
      //   this.props.history.push({
      //     pathname: "/index/psearch",
      //   });
      // },
    });
    // 不能重置，需要打印
    // formRef.current.resetFields();
  };

  formFailed = ({ values, errorFields, outOfDate }) => {
    if (!values.id) {
      message.error("用户信息不能为空,请先搜索获取用户信息");
    }
  };

  //清空只清空非个人信息部分
  files_reset = () => {
    console.log(formRef.current.getFieldsValue());
    formRef.current.resetFields();
    if (this.state.transferData) {
      formRef.current.setFieldsValue(this.state.transferData);
    }
  };

  // 根据科大类获取科室分类
  onreg_classfiySelect = (value) => {
    const index = secriondata.findIndex((item) => {
      return item.value === value;
    });
    this.setState({
      sectionList: secriondata[index].content, //对象拷贝，还是指向同一内存地址
    });
  };

  // 绑定科室选择和医生级别选择事件
  sectionandDoc_select = async (e) => {
    const { reg_section, reg_level, reg_type, is_buy_rec } =
      formRef.current.getFieldsValue();
    // 算诊费
    if (reg_level && reg_type) {
      formRef.current.setFieldsValue({
        reg_level_cost: calfare(reg_level, reg_type, false),
        reg_coast: calfare(reg_level, reg_type, is_buy_rec),
      });
    }
    // 获取医生信息
    if (reg_section && reg_level) {
      console.log(reg_section);
      console.log(reg_level);
      let res;
      await this.setState({
        isReg_docDataLoading: true,
      });
      try {
        res = await request("GET", "/doc/findBySectionNameAndDocLevel", {
          section_name_2: reg_section,
          doc_level: reg_level,
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      // this.setState({
      //   sectionList: res,
      // });
      this.setState({
        docList: res.data.data,
        isReg_docDataLoading: false,
      });
    }
  };

  // 诊费挂号类别选择
  reg_level_costCal = (value) => {
    const { reg_level, reg_type, is_buy_rec } =
      formRef.current.getFieldsValue();
    // 算诊费
    if (reg_level && reg_type) {
      formRef.current.setFieldsValue({
        reg_level_cost: calfare(reg_level, reg_type, false),
        reg_coast: calfare(reg_level, reg_type, is_buy_rec),
      });
    }
  };

  // 总费用计算
  is_buy_recClick = () => {
    const { reg_level, reg_type, is_buy_rec } =
      formRef.current.getFieldsValue();
    // 算诊费
    if (reg_level && reg_type) {
      formRef.current.setFieldsValue({
        reg_coast: calfare(reg_level, reg_type, is_buy_rec),
      });
    }
  };

  render() {
    return (
      <div className="pregistedContainer">
        <Form
          className="form"
          ref={formRef}
          onFinish={this.formFinish}
          onFinishFailed={this.formFailed}
        >
          <div className="printcontent" ref={printref}>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="reg_id"
                  label="流水号"
                  labelCol={{ span: 4 }} //12*3/24=4/3
                  wrapperCol={{ span: 21 }}
                >
                  <Input disabled className="reg_id_input"></Input>
                </Form.Item>
              </Col>
            </Row>
            <div className="line"></div>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="身份证号"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="name"
                  label="姓名"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sex" label="性别">
                  <Select disabled style={{ width: 80 }}>
                    <Select.Option value="男">男</Select.Option>
                    <Select.Option value="女">女</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="nation" label="民族">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item name="allergy" label="过敏史" labelCol={{ span: 4 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="家庭地址">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="phone_num"
                  label="联系电话"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="relative"
                  label="联系人"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="relative_phone_num"
                  label="联系人电话"
                  wrapperCol={{ span: 15 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="reg_date"
                  label="所挂号日期"
                  rules={rules}
                  labelCol={{ span: 8 }}
                >
                  <DatePicker></DatePicker>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="reg_mine"
                  label="所挂号时间"
                  rules={rules}
                  labelCol={{ span: 8 }}
                >
                  <TimePicker></TimePicker>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="reg_classfiy"
                  label="科类"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 12 }}
                  rules={rules}
                >
                  <Select
                    style={{ width: 120 }}
                    placeholder="选择科类"
                    onSelect={this.onreg_classfiySelect}
                  >
                    {secriondata.map((item) => {
                      return (
                        <Select.Option key={item.key} value={item.value}>
                          {item.value}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="reg_section"
                  label="科室"
                  labelCol={{ span: 8 }}
                  rules={rules}
                >
                  <Select
                    style={{ width: 150 }}
                    placeholder="选择科室"
                    onSelect={this.sectionandDoc_select}
                  >
                    {this.state.sectionList.map((item) => {
                      return (
                        <Select.Option key={item.key} value={item.value}>
                          {item.value}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="reg_level" label="医生级别" rules={rules}>
                  <Select
                    style={{ width: 120 }}
                    placeholder="医生级别"
                    onSelect={this.sectionandDoc_select}
                  >
                    <Select.Option value="主治医师">主治医师</Select.Option>
                    <Select.Option value="副主任医师">副主任医师</Select.Option>
                    <Select.Option value="主任医师">主任医师</Select.Option>
                    <Select.Option value="普通医师">普通医师</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="doc_id" label="医生" rules={rules}>
                  <Select
                    style={{ width: 120 }}
                    placeholder="医生姓名"
                    onDropdownVisibleChange={this.reg_doc_selectOpen}
                    loading={this.state.isReg_docDataLoading}
                  >
                    {this.state.docList.map((item) => {
                      return (
                        <Select.Option key={item.key} value={item.doc_id}>
                          {item.doc_name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="reg_type"
                  label="号类"
                  labelCol={{ span: 8 }}
                  rules={rules}
                >
                  <Select
                    style={{ width: 120 }}
                    placeholder="号类"
                    onChange={this.reg_level_costCal}
                  >
                    <Select.Option value="门诊">门诊</Select.Option>
                    <Select.Option value="急诊">急诊</Select.Option>
                    <Select.Option value="特训">特诊</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="reg_level_cost"
                  label="诊费"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="is_buy_rec"
                  label="是否购买病历"
                  wrapperCol={{ span: 12 }}
                  rules={rules}
                >
                  <Radio.Group onChange={this.is_buy_recClick}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  name="reg_settlement"
                  label="结算方式"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 12 }}
                  rules={rules}
                >
                  <Select style={{ width: 120 }} placeholder="结算方式">
                    <Select.Option value="门诊">现金</Select.Option>
                    <Select.Option value="急诊">银行卡</Select.Option>
                    <Select.Option value="特训">医保卡</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="reg_payment"
                  label="缴费方式"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 12 }}
                  rules={rules}
                >
                  <Select style={{ width: 120 }} placeholder="缴费方式">
                    <Select.Option value="自费">自费</Select.Option>
                    <Select.Option value="公费">公费</Select.Option>
                    <Select.Option value="医保">医保</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="reg_coast"
                  label="总费用"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider></Divider>
          <Row justify="space-around" align="top">
            <Col>
              <Form.Item name="reg_coast">
                <Button htmlType="submit" type="primary" size="large">
                  点击挂号
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="reg_coast">
                <Button size="large" onClick={this.files_reset}>
                  重置登记
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <ReactToPrint
                trigger={() => (
                  <Button size="large" disabled={false}>
                    打印挂号单
                  </Button>
                )}
                content={() => printref.current}
                pageStye={`@page {padding:30px}`}
              />
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
