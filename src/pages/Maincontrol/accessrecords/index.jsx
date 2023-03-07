import React, { Component } from "react";
import { Table, Tabs } from "antd";
import request from "../../../unit/request";
import "./index.scss";

const { TabPane } = Tabs;
const columnsout = [
  {
    title: "出库操作流水号",
    dataIndex: "mrw_id",
    key: "mrw_id",
  },
  {
    title: "操作员ID",
    dataIndex: "mrw_operator",
    key: "mrw_operator",
  },
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
    title: "出库数量",
    dataIndex: "mrw_amount",
    key: "mrw_amount",
  },
  {
    title: "出库时间",
    dataIndex: "mrw_time",
    key: "mrw_time",
  },
];
const columnsin = [
  {
    title: "入库操作流水号",
    dataIndex: "mrw_id",
    key: "mrw_id",
  },
  {
    title: "操作员ID",
    dataIndex: "mrw_operator",
    key: "mrw_operator",
  },
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
    title: "入库数量",
    dataIndex: "mrw_amount",
    key: "mrw_amount",
  },
  {
    title: "入库时间",
    dataIndex: "mrw_time",
    key: "mrw_time",
  },
];
export default class index extends Component {
  state = {
    indata: [],
    outdata: [],
    inLoading: false,
    outLoading: false,
    paginationOut: {
      current: 1,
      pageSize: 8,
    },
    paginationIn: {
      current: 1,
      pageSize: 8,
    },
  };

  componentDidMount = async () => {
    const { paginationOut, paginationIn } = this.state;
    this.fetch(paginationOut, paginationIn);
  };

  // 两个一起发送，初始化时使用
  fetch = async (paramsOut, paramsIn) => {
    let res1, res2;
    this.setState({
      inLoading: true,
      outLoading: true,
    });
    res1 = await request(
      "GET",
      "/warehouse/findOutByPage",
      { pageNum: paramsOut.current, pageSize: paramsOut.pageSize },
      {}
    );
    res2 = await request(
      "GET",
      "/warehouse/findInByPage",
      { pageNum: paramsIn.current, pageSize: paramsIn.pageSize },
      {}
    );
    this.setState({
      inLoading: false,
      outLoading: false,
      outdata: res1.data.data.data,
      indata: res2.data.data.data,
      paginationOut: {
        ...paramsOut,
        total: res1.data.data.total,
      },
      paginationIn: {
        ...paramsIn,
        total: res2.data.data.total,
      },
    });
  };

  handleTableChangeOUT = async (pagination) => {
    this.setState({
      outLoading: true,
    });
    let res = await await request(
      "GET",
      "/warehouse/findOutByPage",
      { pageNum: pagination.current, pageSize: pagination.pageSize },
      {}
    );
    this.setState({
      paginationOut: pagination,
      outLoading: false,
      outdata: res.data.data.data,
    });
  };

  handleTableChangeIN = async (pagination) => {
    this.setState({
      inLoading: true,
    });
    let res = await request(
      "GET",
      "/warehouse/findInByPage",
      { pageNum: pagination.current, pageSize: pagination.pageSize },
      {}
    );
    this.setState({
      paginationIn: pagination,
      inLoading: false,
      indata: res.data.data.data,
    });
  };

  render() {
    return (
      <div className="accessrecordsContainer">
        <div className="tittle">药品出入库记录:</div>
        <Tabs defaultActiveKey="1" onChange={this.tabskeychange}>
          <TabPane tab="出库记录" key={true}>
            <Table
              columns={columnsout}
              dataSource={this.state.outdata}
              loading={this.state.outLoading}
              pagination={this.state.paginationOut}
              onChange={this.handleTableChangeOUT}
            ></Table>
          </TabPane>
          <TabPane tab="入库记录" key={false}>
            <Table
              columns={columnsin}
              dataSource={this.state.indata}
              loading={this.state.inLoading}
              pagination={this.state.paginationIn}
              onChange={this.handleTableChangeIN}
            ></Table>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
