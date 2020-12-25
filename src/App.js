import "./App.css";
import Page from "./components/Page";
import React from "react";
function App() {
  const ref = React.createRef();
  return (
    <>
      <Page
        total={130}
        currentPage={5}
        onPageChange={(e) => {
          ref.current.innerHTML = `这是回调函数的返回值${e}`;
        }}
      />
      <div ref={ref}></div>
    </>
  );
}

export default App;
