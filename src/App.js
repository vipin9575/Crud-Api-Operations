import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEffect from './component/ApiEffect';

function App() {
  return (
    <div className="App">
      <ApiEffect/>
      <ToastContainer />
    </div>
  );
}

export default App;
