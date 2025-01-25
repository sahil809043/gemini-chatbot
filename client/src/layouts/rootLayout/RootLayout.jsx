import { Link, Outlet, useNavigate } from "react-router-dom";
import "./rootLayout.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth } from "../../config/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import UserProfile from "../../components/userProfile/UserProfile";

const queryClient = new QueryClient();

const RootLayout = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            if (user) {
                setCurrentUser(user);
                window.localStorage.setItem("token", user.accessToken);
            } else {
                setCurrentUser(null);
                navigate("/");
            }
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, [navigate]);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="rootLayout font-gilroy">
                <header>
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="Logo" />
                        <span className="font-bold tracking-wider text-xl">Close AI</span>
                    </Link>
                    <div className="user font-bold tracking-wider text-xl">
                        {currentUser ? (
                            <UserProfile />
                        ) : null}
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </QueryClientProvider>
    );
};

export default RootLayout;
