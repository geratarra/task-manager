import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthProvider";

function ProtectedRoute({ children }: { children: React.ReactNode }): React.ReactElement {
    const { token } = useContext(AuthContext);
    const isAuthenticated = !!token;

    return (
        <>
            {isAuthenticated ? children : <Navigate to="/login" />}
        </>
    );
}

export default ProtectedRoute;