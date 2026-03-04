import React from "react";
import "./loginButton.css";

interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button className="login-button" onClick={onClick}>
      Login
    </button>
  );
};

export default LoginButton;
