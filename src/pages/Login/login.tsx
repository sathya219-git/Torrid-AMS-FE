import { useNavigate } from "react-router-dom";
import "./login.css";
import {
  Button,
  Card,
  Checkbox,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginClicked, setLoginClicked] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    setLoginClicked(true);
  };
  const forgotPassword = () => {
    navigate("/forgotPassword");
  };

  useEffect(() => {
    if (!loginClicked) return;
    setError("");
    setSuccess("");
    axios
      .post("http://localhost:5092/api/auth/login", {
        email,
        password,
      })
      .then(() => {
        setSuccess(" Login successfully ");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      })
      .catch((err) => {
        setSuccess("");
        setError(err.response?.data?.message || "Invalid username or password");
      })
      .finally(() => {
        setLoginClicked(false);
      });
  }, [loginClicked]);

  return (
    <div className="login-container">
      <Card
        padding="lg"
        shadow="sm"
        radius="md"
        withBorder
        className="login-card"
      >
        <div>
          <Card.Section>
            <div className="login-content">
              <Text fw={700} ta="center">
                Login to Account
              </Text>
              <p>Please enter your email and password to continue</p>
              <TextInput
                label={<Text>Email Address</Text>}
                placeholder="Enter email id"
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                label={
                  <div className="password">
                    <Text>Password</Text>
                    <Text
                      c="blue"
                      style={{ cursor: "pointer", fontSize: "14px" }}
                      onClick={forgotPassword}
                    >
                      Forgot Password?
                    </Text>
                  </div>
                }
                placeholder="• • • • • • • •"
                classNames={{ label: "password-label" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Checkbox label={<Text c="dimmed">Remember Password</Text>} />
              <Button variant="filled" onClick={login} fullWidth>
                Sign In
              </Button>
              {success && <p style={{ color: "green" }}>{success}</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </Card.Section>
        </div>
      </Card>
    </div>
  );
}
