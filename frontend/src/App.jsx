import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { AddMoney } from "./pages/AddMoney";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user,setUser] = useState("");

  const auth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/auth",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setUser(response.data.userId);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Dashboard userId={user} />} />
              <Route path="/dashboard" element={<Dashboard userId={user} />} />
              <Route path="/send" element={<SendMoney />} />
              <Route path="/add" element={<AddMoney/>} />
            </>
          ) : (
            <>
              <Route path="/" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={<Dashboard userId={user} />} />
              <Route path="/send" element={<SendMoney />} />
              <Route path="/add" element={<AddMoney/>} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
