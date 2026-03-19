import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";

function App() {
  const [user, setuser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({data})=>{
      setuser(data.user);
    });
    // listen to auth changes
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setuser(session?.user || null);
    }
  );

  // cleanup
  return () => {
    listener.subscription.unsubscribe();
  };
  }, [])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/dashboard" element={user ?<Dashboard />: <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;