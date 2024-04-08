import React, { useState } from "react";
import { Button, PasswordInput, Container, Text } from "@mantine/core";
import { useCreateEditUser } from "./settings-query";
import { useUser } from "../../../Sameer/lib/application/use-login";
import { useNavigate } from "react-router-dom";

function ChangePasswordPage() {
  // const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { mutate: createEditUser, isSuccess } = useCreateEditUser();
  const { data: user } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (user) {
      createEditUser({ _id: user._id, password: newPassword });
    }

    // You can add more logic here to handle the password change.
  };
  if (isSuccess) {
    navigate("violations/");
  }

  return (
    <Container size="sm">
      <form onSubmit={handleSubmit}>
        <div className="pt-2">
          <label>New Password</label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            required
          />
        </div>
        <div className="pt-2">
          <label>Confirm New Password</label>
          <PasswordInput
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
            required
          />
        </div>
        <div className="pt-2">
          <Button type="submit" variant="outline">
            Change Password
          </Button>
        </div>
        {message && <Text color="red">{message}</Text>}
      </form>
    </Container>
  );
}

export default ChangePasswordPage;
