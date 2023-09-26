
import "./App.css";
import Header from "./components/Header";
import Home from "./page/Home";

function App() {
  return (
    <>
      <Header optimizeData={() => console.log(123)} />
      <Home/>
    </>
  );
}

export default App;
