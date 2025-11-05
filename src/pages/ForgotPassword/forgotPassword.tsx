import { Card, TextInput, Text, PasswordInput, Button } from "@mantine/core";
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const changePassword = () => {
    navigate("/login");
  };
  return (
    <div className="forgot-container">
      <Card
        padding="lg"
        shadow="sm"
        radius="md"
        withBorder
        className="forgot-container-card"
      >
        <div>
          <Card.Section>
            <div className="forgot-content">
              <Text fw={700} ta="center">
                Forgot/Change Password
              </Text>
              <p>This help reset the password, stay password protected!.</p>
              <TextInput
                label={<Text>Default Password</Text>}
                placeholder="#ghdsghd86$"
              />
              <PasswordInput
                label={<Text>New Password</Text>}
                placeholder="• • • • • • • •"
              />
              <PasswordInput
                label={<Text>Confirm Password</Text>}
                placeholder="• • • • • • • •"
              />
              <Button variant="filled" onClick={changePassword} fullWidth>
                Change Password
              </Button>
            </div>
          </Card.Section>
        </div>
      </Card>
    </div>
  );
}
