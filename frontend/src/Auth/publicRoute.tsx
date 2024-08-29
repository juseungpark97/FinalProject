import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

interface PublicRouteProps {
    element: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/profiles" />;
    }

    return element;
};

export default PublicRoute;
