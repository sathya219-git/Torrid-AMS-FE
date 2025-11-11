import { Card, TextInput, Text, PasswordInput, Button } from "@mantine/core";
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [emailID, setEmailID] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  useEffect(() => {
    if (responseMsg === "success") {
      navigate("/login");
    }
  }, [responseMsg, navigate]);

  const changePassword = async () => {
    const body = {
      emailID,
      defaultPassword,
      newPassword,
      confirmNewPassword,
    };

    try {
      const response = await axios.post(
        "http://localhost:5092/api/Auth/resetPassword",
        body
      );

      if (response.data.success) {
        alert(response.data.message);
        setResponseMsg("success");
      } else {
        alert(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      alert("Something went wrong. Try again!");
    }
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
        <Card.Section>
          <div className="forgot-content">
            <Text fw={700} ta="center">
              Forgot/Change Password
            </Text>
            <p>This helps reset your password. Stay secure!</p>

            <TextInput
              label="Email ID"
              placeholder="user@example.com"
              value={emailID}
              onChange={(e) => setEmailID(e.target.value)}
            />

            <TextInput
              label="Default Password"
              placeholder="#ghdsghd86$"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
            />

            <PasswordInput
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <Button variant="filled" onClick={changePassword} fullWidth>
              Change Password
            </Button>
          </div>
        </Card.Section>
      </Card>
    </div>
  );
}
