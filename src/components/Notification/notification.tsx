import "./notification.css";
import { Badge, Button, Divider, Popover, Text } from "@mantine/core";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";

export default function Notification() {
  return (
    <div className="header-left">
      <Popover width={550} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Button
            rightSection={<NotificationsIcon fontSize="small" />}
          ></Button>
        </Popover.Target>
        <Popover.Dropdown className="popover-dropdown">
          <div className="notification-header">
            <Text fw={700}>Your Notification</Text>
            <div
              className="notification-close-btn"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                const event = new Event("mousedown", { bubbles: true });
                document.body.dispatchEvent(event);
              }}
            >
              <CloseIcon fontSize="small" />
            </div>
          </div>
          <div className="notification">
            <>
              <div className="popover-msgs">
                <Badge size="xl" circle className="badge-mail-tick">
                  <MailOutlineIcon fontSize="small" />
                </Badge>
                <Text>
                  Great job! This month, the support team closed 210 tickets, a
                  12% increase from last month's total!
                </Text>
              </div>
              <Divider my="md" />
              <div className="popover-msgs">
                <Badge size="xl" circle className="badge-mail-tick">
                  <MailOutlineIcon fontSize="small" />
                </Badge>
                <Text>
                  Awesome work! The support team resolved 315 tickets this
                  month, a 15% increase from last month!
                </Text>
              </div>
              <Divider my="md" />
              <div className="popover-msgs">
                <Badge size="xl" circle className="badge-mail-tick">
                  <DoneAllIcon fontSize="small" />
                </Badge>
                <Text>
                  Great job! This month, the support team closed 210 tickets, a
                  12% increase from last month's total!
                </Text>
              </div>
              <Divider my="md" />
              <div className="popover-msgs">
                <Badge size="xl" circle className="badge-mail-tick">
                  <DoneAllIcon fontSize="small" />
                </Badge>
                <Text>
                  Great job! This month, the support team closed 210 tickets, a
                  12% increase from last month's total!
                </Text>
              </div>
            </>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
