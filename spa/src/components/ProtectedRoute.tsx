import { useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthProvider";
import axios from "axios";
import { API_URI } from "../utils/constants";

function ProtectedRoute({ children }: { children: React.ReactNode }): React.ReactElement {
    const { token, login } = useContext(AuthContext);
    const isAuthenticated = !!token;
    const navigate = useNavigate();
    let { pathname } = useLocation();    

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated) {
                try {
                    const response = await axios.get(API_URI + '/auth/verify-token', { withCredentials: true });
                    if (response.status === 200) {
                        login(response.data.token);
                        navigate(pathname);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        checkAuth();
    }, [token]);

    return (
        <>
            {isAuthenticated ? children : <Navigate to="/login" />}
        </>
    );
}

export default ProtectedRoute;