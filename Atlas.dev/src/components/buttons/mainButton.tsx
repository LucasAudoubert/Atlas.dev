import React from "react";
import "./mainButton.css";

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

const MainButton = ({ label = "Go!", ...rest }: MainButtonProps) => {
  return (
    <button className="Btn-Container" {...rest}>
      <span className="text">{label}</span>
      <span className="icon-Container">
        <svg
          width="16"
          height="19"
          viewBox="0 0 16 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
          <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
          <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
          <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
          <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
          <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
          <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
          <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
          <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
          <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
        </svg>
      </span>
    </button>
  );
};

export default MainButton;
