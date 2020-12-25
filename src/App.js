import "./App.css";
import Page from "./components/Page";
import React from "react";
function App() {
  const ref = React.createRef();
  return (
    <div
      style={{
        height: `100vh`,
        window: `100vw`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Page
        total={202}
        currentPage={1}
        onPageChange={(e) => {
          ref.current.innerHTML = `这是回调函数的返回值:${e}`;
        }}
      />
      <div ref={ref}></div>
    </div>
  );
}

export default App;
