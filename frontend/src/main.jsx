import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { Provider } from "@/components/ui/provider";
import ChatProvider from "./context/ChatProvider"; // Import your provider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
