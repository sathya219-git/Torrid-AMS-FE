import "./mainHeader.css";
import logo from "../../assets/Frame 303.svg";
import Notification from "../Notification/notification";
import User from "../User/user";

export default function MainHeader() {
  return (
    <div className="main-header">
      <img src={logo} className="logo" />
      <div className="header-right">
        {/* <Notification /> */}
        <User />
      </div>
    </div>
  );
}
