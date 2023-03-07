import React, { Component } from "react";
import { Table, Button } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";
import request from "../../../../unit/request";
import { connect } from "react-redux";
import moment from "moment";

const { Column } = Table;

class Daily extends Component {
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
        res.data.data[index].is_reg_ok === 0 &&
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
    // 根据医生id获取当日挂号列表
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
          <Column
            title="操作/状态"
            align="center"
            width={300}
            render={(text, record, index) => {
              if (index === 0)
                return (
                  <Button>
                    <Link
                      to={{
                        pathname: "/index/diagnosis",
                        state: {
                          id: text.id,
                          reg_id: text.reg_id,
                          mrp_operator: this.props.logindata.account,
                        },
                      }}
                    >
                      {/* 这里需要传入用户的身份证号码来在开诊页面查询用户信息渲染以及传入挂号记录流水号来提交挂号记录 */}
                      叫号
                    </Link>
                  </Button>
                );
              if (index > 0 && index < 6) return <div>待诊中...</div>;
            }}
          ></Column>
        </Table>
      </div>
    );
  }
}

export default connect((state, props) => ({
  logindata: state.logindata,
}))(Daily);
