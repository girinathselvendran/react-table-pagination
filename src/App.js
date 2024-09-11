import React from "react";
import ReusableTableComponent from "./component/table/tableComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <ReusableTableComponent />
      <ToastContainer />
    </div>
  );
};

export default App;
