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
import { Link } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const login = () => {
    navigate("/dashboard");
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
              />

              <PasswordInput
                label={
                  <div className="password">
                    <Text>Password</Text>
                    <Text c="dimmed">Forget Password?</Text>
                  </div>
                }
                placeholder="Enter password"
                classNames={{ label: "password-label" }}
              />
              <Checkbox label={<Text c="dimmed">Remember Password</Text>} />
              <Button variant="filled" onClick={login}>
                Sign In
              </Button>
              <Text c="dimmed">
                Don't have an account? <Link>Contact help desk</Link>
              </Text>
            </div>
          </Card.Section>
        </div>
      </Card>
    </div>
  );
}
