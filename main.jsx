import React, { Component } from "react";
import "./page.css";

export default class Pagecomponent extends Component {
  static defaultProps = {
    preBtnText: "<", //上一页的文本
    nextBtnText: ">", //下一页的文本
    showPageNumber: 6,
    startShowNumber: 1,
    onPageChange: (currentPage) => {}, //页码跳转回调
    showQuickJumper: true, //是否展示快速跳转输入框
    showTotal: true, //是否展示总条数
  };

  constructor(props) {
    super(props);
    this.state = {
      totalPage: props.totalPage || 1, //总条数
      pageSize: Math.ceil(props.totalPage / 10) || 1, //总分页数
      currentPage: props.currentPage || 1, //当前分页数
      inputValue: "", //快速跳转输入框值
    };
  }

  // 页码改变时
  pageChange = (currentPage) => {
    const { showPageNumber } = this.props;
    const { currentPage: stateCurrentPage } = this.state;
    if (currentPage === stateCurrentPage) return;
    let startShowNumber = currentPage >= showPageNumber ? currentPage - 2 : 1;
    this.setState({ currentPage });
    this.props.onPageChange.call(undefined, currentPage);
  };

  //下一页事件
  nextPageChange = () => {
    let { currentPage, pageSize } = this.state;
    if (currentPage === pageSize) return;
    this.pageChange(currentPage + 1);
  };

  //上一页事件
  prePageChange = () => {
    let { currentPage } = this.state;
    if (currentPage === 1) return;
    this.pageChange(currentPage - 1);
  };

  //初始化分页元素
  getPage = () => {
    const { showPageNumber, nextBtnText, preBtnText } = this.props;
    const { pageSize, currentPage } = this.state;
    let contentList = [];
    if (pageSize <= 9) {
      contentList = new Array(pageSize).fill("").map((_, i) => {
        return (
          <li
            onClick={() => this.pageChange(i + 1)}
            className={currentPage === i + 1 ? "page-item-active" : ""}
            key={i + Math.random()}
          >
            {i + 1}
          </li>
        );
      });
    } else if (currentPage - 4 <= 1) {
      console.log("irun");
      contentList = new Array(pageSize - 2)
        .fill("")
        .map((_, i) => {
          return (
            <li
              onClick={() => this.pageChange(i + 1)}
              className={currentPage === i + 1 ? "page-item-active" : ""}
              key={i + Math.random()}
            >
              {i + 1}
            </li>
          );
        })
        .concat([<li>...</li>, <li>{pageSize}</li>]);
      console.log(contentList);
    } else {
      let preList = [];
      let nextList = [];
      let mainList = [];
      if (currentPage - 5 >= 0) {
        preList.push(
          <li
            onClick={() => this.pageChange(1)}
            className={currentPage === 1 ? "page-item-active" : ""}
            key={`first` + Math.random()}
          >
            {1}
          </li>,
          <li
            onClick={() => this.pageChange(currentPage - 5)}
            key={`...` + Math.random()}
          >
            ...
          </li>
        );
      }
      console.log("preList: ", preList);
      if (currentPage + 5 <= pageSize) {
        nextList.push(
          <li
            onClick={() => this.pageChange(currentPage - 5)}
            key={`...` + Math.random()}
          >
            ...
          </li>,
          <li
            onClick={() => this.pageChange(1)}
            className={currentPage === pageSize ? "page-item-active" : ""}
            key={`last` + Math.random()}
          >
            {pageSize}
          </li>
        );
      }
      contentList = [...preList, ...nextList];
    }

    contentList.unshift(
      <li
        className={currentPage === 1 ? "disabled" : ""}
        onClick={this.prePageChange}
        key={"pre"}
      >
        {preBtnText}
      </li>
    );
    contentList.push(
      <li
        className={currentPage === pageSize ? "disabled" : ""}
        onClick={this.nextPageChange}
        key={"next"}
      >
        {nextBtnText}
      </li>
    );

    return contentList;
  };

  //快速跳转输入框绑定
  inputChangeHandler = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  //快速跳转输入框按下回车事件
  onInputKeyUp = (event) => {
    if (event.keyCode === 13) {
      //keyCode为13就是回车
      const value = parseInt(event.target.value);
      const { currentPage, pageSize } = this.state;
      if (isNaN(value)) {
        this.setState({
          inputValue: "",
        });
      } else if (value > pageSize) {
        //如果输入的合法数字大于总页数，则跳转至最后一页
        if (pageSize === currentPage) {
          //如果当前已经是最后一页，则只清空输入框
          this.setState({ inputValue: "" });
        } else {
          this.setState({ currentPage: pageSize, inputValue: "" });
        }
      } else if (value < 1) {
        //如果输入的合法数字大于总页数，则跳转至最后一页
        if (1 === currentPage) {
          //如果当前已经是最后一页，则只清空输入框
          this.setState({ inputValue: "" });
        } else {
          this.setState({ currentPage: 1, inputValue: "" });
        }
      } else if (this.state.currentPage === parseInt(value)) {
        this.setState({ inputValue: "" });
      } else {
        this.setState({
          inputValue: "",
          currentPage: parseInt(value),
        });
      }
    }
  };

  render() {
    const { pageSize, inputValue } = this.state;
    const { showQuickJumper, showTotal, totalPage } = this.props;
    return (
      <div
        style={{
          display: `flex`,
          fontSize: 14,
          alignItems: "center",
          padding: `4px 0`,
        }}
      >
        {showTotal && (
          <span
            style={{ color: `#333`, marginRight: `.5em`, marginLeft: `1em` }}
          >
            共{totalPage}条
          </span>
        )}
        <ul className="page-wrapper">{this.getPage()}</ul>
        {showQuickJumper && (
          <div className="qucik-jump-wrapper">
            <div>
              跳至
              <input
                onKeyUp={this.onInputKeyUp}
                value={inputValue}
                onChange={this.inputChangeHandler}
              />
              页
            </div>
          </div>
        )}
      </div>
    );
  }
}
