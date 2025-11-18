import "./notification.css";
import { Button, Popover, Text } from "@mantine/core";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { FileDetail } from "../UploadReport/upload-report.interface";

export default function Notification() {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: "#f4f5f9",
      border: "1px solid #bae6fd",
      borderRadius: "10px",
      padding: "15px 20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "100%", // ✅ full width
      boxSizing: "border-box",
    },
    title: {
      marginBottom: "10px",
      color: "#0369a1",
      fontWeight: 600,
    },
    list: {
      listStyleType: "none",
      padding: 0,
    },
    item: {
      background: "#ffffff",
      marginBottom: "10px",
      padding: "10px",
      borderRadius: "8px",
      borderLeft: "5px solid #3b82f6",
    },
    filename: { color: "#1e3a8a" },
    size: { color: "#6b7280", fontSize: "0.9em" },
    message: {
      color: "#065f46",
      fontSize: "0.95em",
      marginTop: "4px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
    },
  };

  const [opened, setOpened] = useState(false);
  const [files, setFiles] = useState<FileDetail[]>([]);

  const loadFiles = () => {
    const stored = localStorage.getItem("uploadedFiles");
    if (stored) setFiles(JSON.parse(stored));
    else setFiles([]);
  };

  // ✅ Load once on mount
  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="header-left">
      <Popover
        width={1000}
        position="bottom"
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Button
            p={10}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              loadFiles();
              setOpened((prev) => !prev);
            }}
          >
            <NotificationsIcon fontSize="small" />
          </Button>
        </Popover.Target>

        <Popover.Dropdown className="popover-dropdown">
          <div className="notification-header">
            <Text fw={700}>Your Notifications</Text>
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

          <div className="upload-notification">
            <div style={styles.container}>
              <h3 style={styles.title}>Upload Notifications</h3>
              <ul style={styles.list}>
                {files.map((file, index) => {
                  const time = new Date(file.uploadedDate).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );
                  const date = new Date(file.uploadedDate).toLocaleDateString();

                  return (
                    <li
                      key={index}
                      style={styles.item}
                      className="notification-item"
                    >
                      <div className="notification-file">
                        <span>{file.fileName}</span>
                        <span style={{ color: "#6b7280", fontSize: "0.9em" }}>
                          ({file.fileSize})
                        </span>
                      </div>

                      <div className="notification-success">
                        <TiTick style={{ fontSize: "22px" }} />
                        Successfully uploaded on <b>{date}</b> at <b>{time}</b>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
