import React, { Component } from "react";
import { Table, Button, Input, message, Modal } from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./index.scss";
import request from "../../../unit/request";

const searchValue = React.createRef();
export default class index extends Component {
  state = {
    searchdata: [],
    loading: false,
  };
  searchhandel = async () => {
    const { value } = searchValue.current.input;
    if (value.length < 18) {
      message.info("请输入完整的身份证号");
      searchValue.current.input.value = "";
      return;
    }
    let res;
    try {
      this.setState({ loading: true });
      res = await request("GET", "/reg/findById", { id: value }, {});
      this.setState({ loading: false, searchdata: res.data.data, id: value });
    } catch (error) {
      message.error("网络错误，获取数据失败");
    }
  };

  handelCancel = (reg_id) => {
    const that = this;
    return async function (e) {
      try {
        that.setState({ loading: true });
        await request("POST", "/reg/cancelRegByRegId", { reg_id }, {});
        const res = await request(
          "GET",
          "/reg/findById",
          { id: that.state.id },
          {}
        );
        message.success("取消挂号成功!");
        that.setState({ loading: false, searchdata: res.data.data });
      } catch (error) {
        console.log(error);
        that.setState({ loading: false });
        message.error("网络错误,取消失败");
      }
    };
  };

  render() {
    return (
      <div className="regcancelContainer">
        <div className="cancel_search">
          <Input
            className="input"
            placeholder="输入患者完整身份证号"
            ref={searchValue}
            prefix={<SearchOutlined />}
          ></Input>
          <Button onClick={this.searchhandel} type="primary" className="but">
            点击查找
          </Button>
        </div>
        <Table dataSource={this.state.searchdata} loading={this.state.loading}>
          <Table.Column title="身份证号" dataIndex="id" key="id"></Table.Column>
          <Table.Column
            title="挂号流水号"
            dataIndex="reg_id"
            key="reg_id"
          ></Table.Column>
          <Table.Column
            title="所挂号时间"
            dataIndex="reg_time"
            key="reg_time"
          ></Table.Column>
          <Table.Column
            title="挂号状态"
            render={(text, record, index) => {
              if (text.is_reg_cancel === 1) {
                return (
                  <>
                    <CloseCircleOutlined
                      style={{ color: "#e74c3c", marginRight: "5px" }}
                    />
                    已取消
                  </>
                );
              }
              if (text.is_reg_ok === 1) {
                return (
                  <>
                    <CheckCircleOutlined
                      style={{ color: "#2ecc71", marginRight: "5px" }}
                    />
                    已完成就诊
                  </>
                );
              }
              return (
                <>
                  <ExclamationCircleOutlined
                    style={{ color: "#e67e22", marginRight: "5px" }}
                  />
                  未完成就诊
                </>
              );
            }}
          ></Table.Column>
          <Table.Column
            title="操作"
            render={(text, record, index) => {
              if (text.is_reg_ok === 0 && text.is_reg_cancel === 0)
                return (
                  <Button onClick={this.handelCancel(text.reg_id)}>
                    取消挂号
                  </Button>
                );
            }}
          ></Table.Column>
        </Table>
      </div>
    );
  }
}
