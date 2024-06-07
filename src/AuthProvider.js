import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    const loginAction = async (data) => {
        try {
            const response = await fetch("http://127.0.0.1:3004/teacher-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    "username":"bilal.abbas@univ-constantine2.dz",
                    "password":"0",
                    "osname":"444"
                },
            });
            const res = await response.json();
            if (res.data) {
                setUser(res.data.user);
                setToken(res.token);
                localStorage.setItem("site", res.token);
                navigate("/dashboard");
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
