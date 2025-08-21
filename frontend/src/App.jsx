import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Home from "./pages/Home/Home";

const routes=(
            <Routes>
              <Route path="/" element={<Home />} />
             
            </Routes>    
);      
const App=()=>{
    return <div>{routes}
      </div>
}   
export default App
