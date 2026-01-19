import { useNavigate } from "react-router-dom";
import "./login.css";
import { Button, Card, PasswordInput, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { InitiateAPI, LoginSuccess } from "../../store/filterStore";

export default function Login() {
  const navigate = useNavigate();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const initiateAPI = useSetAtom(InitiateAPI);
  const loginSuccess = useAtomValue(LoginSuccess);

  const login = () => {
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      return curr;
    });
  };

  useEffect(() => {
    if (loginSuccess) {
      navigate("/dashboard");
    }
  }, [loginSuccess]);

  const forgotPassword = () => {
    navigate("/forgotPassword");
  };

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
                      Forgot / Change Password?
                    </Text>
                  </div>
                }
                placeholder="• • • • • • • •"
                classNames={{ label: "password-label" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <Checkbox label={<Text c="dimmed">Remember Password</Text>} /> */}
              <Button variant="filled" onClick={login} fullWidth>
                Sign In
              </Button>
            </div>
          </Card.Section>
        </div>
      </Card>
    </div>
  );
}
