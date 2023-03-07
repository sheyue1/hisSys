import React, { Component } from "react";
import { Input, Button, List, Spin, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./index.scss";
import { changeCurrentpatientdata } from "../../../redux/actions/datatransfer";
import { connect } from "react-redux";
import request from "../../../unit/request";

const searchValue = React.createRef();
class index extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  state = {
    searchData: [],
    loading: false,
  };
  search_click = async () => {
    if (this.state.loading) {
      // 正在搜索则直接跳过，强制节流
      return;
    }
    const { value } = searchValue.current.input;
    if (value.length <= 5) {
      message.info("搜索长度至少大于5位");
      return;
    }
    this.setState({
      loading: true,
    });
    // 获取输入框内容
    let res;
    try {
      res = await request("GET", "/patient/findByFirstFewChar", {
        firstFewChar: value,
      });
    } catch (error) {
      message.error("网络错误");
      this.setState({
        loading: false,
      });
      return;
    }
    console.log(res);
    this.setState({
      searchData: res.data.data,
      loading: false,
    });
  };
  render() {
    return (
      <div className="psearchContainer">
        <div className="search">
          <Input
            ref={searchValue}
            className="search_input"
            placeholder="输入病人身份证号"
            prefix={<SearchOutlined />}
            defaultValue={
              this.props.location.state ? this.props.location.state.id : ""
            }
          />
          <Button
            className="search_buttom"
            onClick={this.search_click}
            type="primary"
          >
            点击搜索
          </Button>
        </div>
        <div className="tittle">查询结果:</div>
        <div className="search_result">
          {this.state.loading ? (
            <div className="loading">
              <Spin size="default" className="loading"></Spin>
            </div>
          ) : (
            <List
              className="list"
              dataSource={this.state.searchData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.id}
                    description={
                      "姓名：" +
                      item.name +
                      "   性别：" +
                      item.sex +
                      "  年龄" +
                      item.age +
                      "  地址：" +
                      item.address
                    }
                  />
                  <Button className="info_change">
                    <Link to={{ pathname: "/index/infomodify", state: item }}>
                      病人信息修改
                    </Link>
                  </Button>
                  <Button className="reg_click" type="primary">
                    <Link to={{ pathname: "/index/pregistered", state: item }}>
                      点击挂号
                    </Link>
                  </Button>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    );
  }
}

export default connect((state, props) => ({}), {
  changeCurrentpatientdata,
})(index);
