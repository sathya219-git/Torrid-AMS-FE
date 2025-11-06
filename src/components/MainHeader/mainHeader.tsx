import "./mainHeader.css";
import logo from "../../assets/Frame 303.svg";
import Notification from "../Notification/notification";
import User from "../User/user";
import { Tabs } from "@mantine/core";

interface MainHeaderProps {
  activeTab: string;
  onTabChange: (value: string | null) => void;
}

export default function MainHeader({ activeTab, onTabChange }: MainHeaderProps) {
  return (
    <div className="main-header">
      <img src={logo} className="logo" />

      <Tabs color="blue" radius="xs" value={activeTab} onChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab value="Upload-Report">Upload File</Tabs.Tab>
          <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <div className="header-right">
        <Notification />
        <User />
      </div>
    </div>
  );
}