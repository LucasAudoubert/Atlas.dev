import React from "react";
import "./registerForm.css";

interface RegisterFormProps {
  onSubmit: (data: {
    username: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({
    username: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Register</p>
      <p className="message">Signup now and get full access to our app.</p>
      <div className="flex">
        <label>
          <input
            className="input"
            type="text"
            placeholder=""
            required
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <span>Firstname</span>
        </label>

        <label>
          <input
            className="input"
            type="text"
            placeholder=""
            required
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <span>Lastname</span>
        </label>
      </div>

      <label>
        <input
          className="input"
          type="email"
          placeholder=""
          required
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <span>Email</span>
      </label>

      <label>
        <input
          className="input"
          type="password"
          placeholder=""
          required
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <span>Password</span>
      </label>
      <label>
        <input
          className="input"
          type="password"
          placeholder=""
          required
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <span>Confirm password</span>
      </label>
      <button className="submit">Submit</button>
      <p className="signin">
        Already have an account? <a href="/auth">Signin</a>
      </p>
    </form>
  );
};

export default RegisterForm;
