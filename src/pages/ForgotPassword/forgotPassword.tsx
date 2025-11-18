import { Card, TextInput, Text, PasswordInput, Button } from "@mantine/core";
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { InitiateAPI, ResetSuccess } from "../../store/filterStore";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [emailID, setEmailID] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const initiateAPI = useSetAtom(InitiateAPI);
  const resetSuccess = useAtomValue(ResetSuccess);

  useEffect(() => {
    if (resetSuccess) {
      navigate("/login");
    }
  }, [resetSuccess]);

  const changePassword = () => {
    const body = {
      emailID,
      defaultPassword,
      newPassword,
      confirmNewPassword,
    };
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set("http://localhost:5092/api/auth/resetPassword", {
        method: "POST",
        body: JSON.stringify(body),
      });
      return curr;
    });
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
