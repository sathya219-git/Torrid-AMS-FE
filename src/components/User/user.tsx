import { Avatar, Menu, Text } from "@mantine/core";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import avatar from "../../assets/avatar.png";
import "./user.css";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
    // localStorage.removeItem("uploadedFiles");
  };
  return (
    <div className="user-dropdown">
      <Menu>
        <Menu.Target>
          <div className="dropdown-div">
            <Avatar src={avatar} alt="it's me" />
            <div className="dropdown-text">
              <Text fw={600}>UserName</Text>
              <Text>Manager</Text>
            </div>
            <KeyboardArrowDownIcon />
          </div>
        </Menu.Target>
        <Menu.Dropdown
          style={{ backgroundColor: "#1f1f1f", borderRadius: "8px" }}
        >
          <Menu.Item style={{ backgroundColor: "#1f1f1f" }}>
            <Text
              onClick={logout}
              style={{ backgroundColor: "#1f1f1f", color: "#fff" }}
            >
              Sign out
            </Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
