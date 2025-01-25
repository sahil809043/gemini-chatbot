import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import SignInPage from "./routes/signInPage/SignInPage";
import SignUpPage from "./routes/signUpPage/SignUpPage";

const Root = () => {
  const [isChatListVisible, setIsChatListVisible] = useState(false);

  const toggleChatList = () => {
    setIsChatListVisible(!isChatListVisible);
  };

  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/sign-in/*",
          element: <SignInPage />,
        },
        {
          path: "/sign-up/*",
          element: <SignUpPage />,
        },
        {
          element: (
            <DashboardLayout
              isChatListVisible={isChatListVisible}
              toggleChatList={toggleChatList}
            />
          ),
          children: [
            {
              path: "/dashboard",
              element: <DashboardPage isChatListVisible={isChatListVisible} />,
            },
            {
              path: "/dashboard/chats/:id",
              element: <ChatPage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
