import React from "react";
import "./pinName.css";

interface PinNameProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PinName = ({ label = "Pin Name", ...rest }: PinNameProps) => {
  return (
    <div className="pin-name-container">
      <label className="pin-name-label">{label}</label>
      <input placeholder="Enter your text..." className="input" name="text" type="text" {...rest} />
    </div>
  );
};

export default PinName;