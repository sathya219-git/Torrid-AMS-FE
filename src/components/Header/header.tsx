import { Button, Modal, Text } from "@mantine/core";
import DownloadIcon from "@mui/icons-material/Download";
import "./header.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { appliedFilter } from "../../store/filterStore";

export default function Header() {
  const [opened, setOpened] = useState(false);
  const [filters] = useAtom(appliedFilter);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!downloadClicked) return;

    const downloadExcel = async () => {
      setIsDownloading(true);
      try {
        const response = await axios.get(
          "http://localhost:5092/api/Incident/export",
          {
            params: filters,
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `IncidentsExport_${new Date().toLocaleString()}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error(" Error exporting filtered result:", error);
        alert("Failed to export filtered result. Please try again.");
      } finally {
        setIsDownloading(false);
        setDownloadClicked(false);
        setOpened(false);
      }
    };

    downloadExcel();
  }, [downloadClicked, filters]);

  return (
    <>
      <div className="page-container">
        <div className="page-title">
          <Text fw={700} size="40px">
            Dashboard
          </Text>
        </div>
        <div className="page-right">
          
          <div className="page-download">
            <Text fw={500}>Download Report</Text>
            <Button
              rightSection={<DownloadIcon fontSize="medium" />}
              onClick={() => setOpened(true)}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={"Confirmation to download"}
        classNames={{
          header: "modal-header",
        }}
      >
        <div className="modal">
          <Text fw={300}>
            Are you sure!, Do you really want to download it as excel ?
          </Text>
        </div>
        <div className="button-group-modal">
          <Button variant="outline">Cancel</Button>
          <Button
            variant="filled"
            onClick={() => setDownloadClicked(true)}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Yes, Download"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
