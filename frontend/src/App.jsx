import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Toaster />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
