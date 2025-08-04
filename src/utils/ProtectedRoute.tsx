import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers"; // Import RootState để lấy kiểu của Redux store

// Tạo ProtectedRoute component
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  // Lấy trạng thái xác thực từ Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Nếu không xác thực, chuyển hướng đến /login
        )
      }
    />
  );
};

export default ProtectedRoute;
