import React, { Component } from "react";
import "./page.css";

const PageOmit = (props) => {
  return (
    <li title={props.title} onClick={props.onClick && props.onClick}>
      ...
    </li>
  );
};

export default class Pagecomponent extends Component {
  static defaultProps = {
    preBtnText: "<", //上一页的文本
    nextBtnText: ">", //下一页的文本
    onPageChange: (currentPage) => {}, //页码跳转回调
    showQuickJumper: true, //是否展示快速跳转输入框
    showTotal: true, //是否展示总条数
  };

  constructor(props) {
    super(props);
    this.state = {
      total: props.total || 1, //总条数
      totalPageSize: Math.ceil(props.total / 10) || 1, //总分页数
      currentPage: props.currentPage || 1, //当前分页数
      inputValue: "", //快速跳转输入框值
    };
  }

  // 页码改变时
  pageChange = (currentPage) => {
    const { currentPage: stateCurrentPage } = this.state;
    if (currentPage === stateCurrentPage) return;
    this.setState({ currentPage });
    this.props.onPageChange.call(undefined, currentPage);
  };

  //下一页事件
  nextPageChange = () => {
    let { currentPage, totalPageSize } = this.state;
    if (currentPage === totalPageSize) return;
    this.pageChange(currentPage + 1);
  };

  //上一页事件
  prePageChange = () => {
    let { currentPage } = this.state;
    if (currentPage === 1) return;
    this.pageChange(currentPage - 1);
  };

  //向前5页的省略号事件
  preOmitPageChange = () => {
    const { currentPage } = this.state;
    this.pageChange(currentPage - 5);
  };

  //向后5页的省略号事件
  nextOmitPageChange = () => {
    const { currentPage } = this.state;
    this.pageChange(currentPage + 5);
  };

  //初始化分页元素
  initPage = () => {
    const { nextBtnText, preBtnText } = this.props;
    const { totalPageSize, currentPage } = this.state;
    let contentList = [];
    if (totalPageSize <= 9) {
      contentList = Array.from({ length: 9 - 2 }).map((_, i) => {
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
    } else if (currentPage + 4 >= totalPageSize) {
      contentList = [
        <li
          key={"first" + Math.random()}
          onClick={() => {
            this.pageChange(1);
          }}
        >
          1
        </li>,
        <PageOmit
          key={"omit" + Math.random()}
          title="向前5页"
          onClick={this.preOmitPageChange}
        />,
      ].concat(
        Array.from({ length: 9 - 2 }).map((_, i) => {
          return (
            <li
              onClick={() => this.pageChange(i + totalPageSize - 9 + 3)}
              className={
                currentPage === i + totalPageSize - 9 + 3
                  ? "page-item-active"
                  : ""
              }
              key={i + Math.random()}
            >
              {i + totalPageSize - 9 + 3}
            </li>
          );
        })
      );
    } else if (currentPage - 4 <= 1) {
      contentList = Array.from({ length: 9 - 2 })
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
        .concat([
          <PageOmit
            key={"omit" + Math.random()}
            title="向后5页"
            onClick={this.nextOmitPageChange}
          />,
          <li
            key={"last" + Math.random()}
            onClick={() => {
              this.pageChange(totalPageSize);
            }}
          >
            {totalPageSize}
          </li>,
        ]);
    } else {
      // eslint-disable-next-line no-sparse-arrays
      contentList = [
        <li key={"first" + Math.random()} onClick={() => this.pageChange(1)}>
          1
        </li>,
        <PageOmit
          key={"omit" + Math.random()}
          title="向前5页"
          onClick={this.preOmitPageChange}
        />,
        ,
        ...Array.from({ length: 9 - 4 }).map((_, i) => {
          return (
            <li
              onClick={() => this.pageChange(i + currentPage - 2)}
              className={
                currentPage === i + currentPage - 2 ? "page-item-active" : ""
              }
              key={i + Math.random()}
            >
              {i + currentPage - 2}
            </li>
          );
        }),
        <PageOmit
          key={"omit" + Math.random()}
          title="向后5页"
          onClick={this.nextOmitPageChange}
        />,
        <li
          key={"last" + Math.random()}
          onClick={() => this.pageChange(totalPageSize)}
        >
          {totalPageSize}
        </li>,
      ];
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
        className={currentPage === totalPageSize ? "disabled" : ""}
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
      const { currentPage, totalPageSize } = this.state;
      if (isNaN(value)) {
        this.setState({
          inputValue: "",
        });
      } else if (value > totalPageSize) {
        //如果输入的合法数字大于总页数，则跳转至最后一页
        if (totalPageSize === currentPage) {
          //如果当前已经是最后一页，则只清空输入框
          this.setState({ inputValue: "" });
        } else {
          this.setState({ currentPage: totalPageSize, inputValue: "" });
          this.props.onPageChange.call(undefined, totalPageSize);
        }
      } else if (value < 1) {
        //如果输入的合法数字大于总页数，则跳转至最后一页
        if (1 === currentPage) {
          //如果当前已经是最后一页，则只清空输入框
          this.setState({ inputValue: "" });
        } else {
          this.setState({ currentPage: 1, inputValue: "" });
          this.props.onPageChange.call(undefined, 1);
        }
      } else if (this.state.currentPage === parseInt(value)) {
        this.setState({ inputValue: "" });
      } else {
        this.setState({
          inputValue: "",
          currentPage: parseInt(value),
        });
        this.props.onPageChange.call(undefined, value);
      }
    }
  };

  render() {
    const { inputValue } = this.state;
    const { showQuickJumper, showTotal, total } = this.props;
    return (
      <div className="page-container">
        {showTotal && (
          <span
            style={{ color: `#333`, marginRight: `.5em`, marginLeft: `1em` }}
          >
            共{total}条
          </span>
        )}
        <ul className="page-wrapper">{this.initPage()}</ul>
        {showQuickJumper && (
          <div className="qucik-jump-wrapper">
            跳至
            <input
              onKeyUp={this.onInputKeyUp}
              value={inputValue}
              onChange={this.inputChangeHandler}
            />
            页
          </div>
        )}
      </div>
    );
  }
}
