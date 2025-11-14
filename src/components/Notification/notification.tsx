import "./notification.css";
import { Badge, Button, Divider, Popover, Text } from "@mantine/core";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";

interface FileDetails {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export default function Notification() {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: "#f4f5f9",
      border: "1px solid #bae6fd",
      borderRadius: "10px",
      padding: "10px 15px",  
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "100%",
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
    message: { color: "#065f46", fontSize: "0.95em", marginTop: "4px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" },
  };

  const [files, setFiles] = useState<FileDetails[]>([]);

  const loadFiles = () => {
    const stored = localStorage.getItem("uploadedFiles");
    if (stored) setFiles(JSON.parse(stored));
    else setFiles([]);
  };

  // ✅ Load once on mount
  useEffect(() => {
    loadFiles();

    // ✅ Listen for localStorage updates
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "uploadedFiles") {
        loadFiles();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Also listen for custom event when same tab updates
  useEffect(() => {
    const handleCustomUpdate = () => loadFiles();
    window.addEventListener("uploadedFilesUpdated", handleCustomUpdate);
    return () => window.removeEventListener("uploadedFilesUpdated", handleCustomUpdate);
  }, []);

  // if (files.length === 0) return <div>No files uploaded yet.</div>;

  return (
    <div className="header-left">
      <Popover width={650} position="bottom" shadow="md">
        <Popover.Target>
          <Button
            // variant="subtle"
            p={10}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", }}
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
                  const time = new Date(file.uploadedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const date = new Date(file.uploadedAt).toLocaleDateString();

                  return (
                    <li key={index} style={styles.item} className="notification-item">
                      <div className="notification-file">
                        <span>{file.name}</span>
                        <span style={{ color: "#6b7280", fontSize: "0.9em" }}>({file.size})</span>
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
