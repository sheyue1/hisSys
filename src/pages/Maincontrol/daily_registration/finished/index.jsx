import React, { Component } from "react";
import { Table } from "antd";
import "./index.scss";
import { connect } from "react-redux";
import request from "../../../../unit/request";
import moment from "moment";

const { Column } = Table;
class Finished extends Component {
  state = {
    data: [],
    loading: false,
  };
  componentDidMount = async () => {
    const { account } = this.props.logindata;
    this.setState({
      loading: true,
    });
    const res = await request(
      "GET",
      "/reg/findTodayByDocId",
      { doc_id: account },
      {}
    );
    const transfer = [];
    for (let index = 0; index < res.data.data.length; index++) {
      if (
        res.data.data[index].is_reg_ok === 1 &&
        res.data.data[index].is_reg_cancel === 0
      )
        transfer.push({
          ...res.data.data[index],
          date: moment(res.data.data[index].reg_time).format("YYYY-MM-DD"),
          time: moment(res.data.data[index].reg_time).format("HH:MM"),
        });
    }
    console.log(transfer);
    this.setState({
      data: [...transfer],
      loading: false,
    });
  };
  render() {
    return (
      <div className="waitingContainer">
        <Table
          bordered={true}
          dataSource={this.state.data}
          loading={this.state.loading}
        >
          <Column title="身份证号码" dataIndex="id" key="id"></Column>
          <Column title="姓名" dataIndex="name" key="name"></Column>
          <Column title="年龄" dataIndex="age" key="age"></Column>
          <Column
            title="所挂科室"
            dataIndex="reg_section"
            key="reg_section"
          ></Column>
          <Column title="挂号日期" dataIndex="date" key="date"></Column>
          <Column title="挂号开始时间" dataIndex="time" key="time"></Column>
        </Table>
      </div>
    );
  }
}
export default connect((state, props) => ({
  logindata: state.logindata,
}))(Finished);
