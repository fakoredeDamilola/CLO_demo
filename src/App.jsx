// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Header from "./components/Header";
import Worksheet from "./components/Worksheet";

function App() {
  return (
    <>
      <Header />
      <Worksheet />
      <div className="my-4 text-danger">
        <p>
          For the sake of the demo the follow assumptions were made for stock
        </p>
        <p>
          requiredLength = 1 <br /> requiredAmount = 1 <br /> requiredWidth = 1;
        </p>
      </div>
    </>
  );
}

export default App;
