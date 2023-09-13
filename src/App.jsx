import "./App.css";
import Header from "./components/Header";
import Worksheet from "./components/Worksheet";

function App() {
  return (
    <>
      <Header optimizeData={() => console.log(123)} />
      <div className="container">
        <Worksheet />
      </div>
    </>
  );
}

export default App;
