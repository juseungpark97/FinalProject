import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

interface ProtectedRouteProps {
    element: JSX.Element;
    requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
    const { user, loading } = useAuth();
    const selectedProfile = sessionStorage.getItem("selectedProfile");

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/" />;
    }

    if (user.role === "admin" && requiredRole !== "admin") {
        return <Navigate to="/dashboard" />;
    }

    if (user.role === "user" && !selectedProfile && window.location.pathname !== "/profiles") {
        return <Navigate to="/profiles" />;
    }

    if (user.role !== requiredRole) {
        return <Navigate to="/profiles" />;
    }

    return element;
};

export default ProtectedRoute;
