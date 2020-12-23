import React, { Component } from "react";

export default class Pagecomponent extends Component {
  static defaultProps = {
    preBtnText: "上一页",
    nextBtnText: "下一页",
    showPageNumber: 6,
    startShowNumber: 1,
    onPageChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      totalPage: props.totalPage || 1,
      currentPage: props.currentPage || 1
    };
  }
  // 点击页码
  initPage = () => {
    const { currentPage, showPageNumber, nextBtnText, preBtnText } = this.props;
    const { totalPage } = this.state;
    let contentList = [];
    console.log(`totalPage`);
    console.log(totalPage);
    for (let i = 0; totalPage <= 7; i++) {
      contentList.push(<li onClick={() => console.log(i)}>{i}</li>);
    }
    contentList.push(<li key={"pre"}>{preBtnText}</li>);
    contentList.unshift(<li key={"next"}>{nextBtnText}</li>);
    return contentList;
  };

  pageChange = (currentPage) => {
    const { showPageNumber } = this.props;
    let startShowNumber = currentPage >= showPageNumber ? currentPage - 2 : 1;
    this.props.onPageChange.call(undefined, currentPage);
    this.setState({ currentPage, startShowNumber });
  };

  render() {
    return <div style={{ display: `flex` }}>{this.initPage()}</div>;
  }
}
