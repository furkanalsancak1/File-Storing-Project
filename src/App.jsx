import './App.css';
import MainPage from '../components/main-page';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogInRegister from '../components/login-register-page';
import ProfilePage from '../components/profile-page';
function App() {

  return (
    <BrowserRouter>
    
     <Routes>
      <Route path='' element ={<LogInRegister />}></Route>
      <Route path='main-page' element={<MainPage />}></Route>
      <Route path='profile-page' element={<ProfilePage />}></Route>
     </Routes>
      
      
      
        
    </BrowserRouter>
  );
};

export default App
