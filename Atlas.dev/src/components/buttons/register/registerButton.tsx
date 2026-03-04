import React from "react";
import "./registerButton.css";

interface RegisterButtonProps {
  onClick: () => void;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick }) => {
  return (
    <button className="register-button" onClick={onClick}>
      Register
    </button>
  );
};

export default RegisterButton;
