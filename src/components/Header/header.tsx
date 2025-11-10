import { Button, Modal, Text } from "@mantine/core";
import "./header.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { appliedFilter, filterState } from "../../store/filterStore"; // ✅ import both
import { PiExport } from "react-icons/pi";
import { CiFilter } from "react-icons/ci";
import { RiFileExcel2Fill } from "react-icons/ri";

export default function Header() {
  const [opened, setOpened] = useState(false);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ✅ Applied filters (data)
  const [filters] = useAtom(appliedFilter);

  // ✅ Filter panel state (open/close)
  const [filterOpened, setFilterOpened] = useAtom(filterState);

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
        console.error("Error exporting filtered result:", error);
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
          {/* Export button */}
          <div className="page-download">
            <Text fw={500}>Export</Text>
            <Button
              onClick={() => setOpened(true)}
              bg="#dee4f0"
              radius="md"
              size="md"
              p="8px"
              style={{
                borderColor: "#4880FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <PiExport size={22} color="#4880FF" />
            </Button>
          </div>

          {/* Filter button */}
          <div className="page-download">
            <Text fw={500}>Filter</Text>
            <Button
              onClick={() => setFilterOpened((prev) => !prev)} 
              bg={filterOpened ? "#4880FF" : "#dee4f0"} 
              radius="md"
              size="md"
              p="8px"
              style={{
                borderColor: "#4880FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                transition: "all 0.2s ease",
              }}
            >
              <CiFilter
                size={22}
                color={filterOpened ? "#fff" : "#4880FF"} // ✅ change icon color too
              />
            </Button>
          </div>

          {/* Uploaded button */}
          {/* <div className="page-download">
            <Text fw={500}>Uploaded</Text>
            <Button
              onClick={() => setOpened(true)}
              bg="#dee4f0"
              radius="md"
              size="md"
              p="8px"
              style={{
                borderColor: "#31c684",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <RiFileExcel2Fill size={22} color="#31c684" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Download confirmation modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirmation to download"
        classNames={{
          header: "modal-header",
        }}
      >
        <div className="modal">
          <Text fw={300}>
            Are you sure? Do you really want to download it as an Excel file?
          </Text>
        </div>
        <div className="button-group-modal">
          <Button variant="outline" onClick={() => setOpened(false)}>
            Cancel
          </Button>
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
