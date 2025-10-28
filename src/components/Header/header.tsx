import { Button, Modal, Text } from "@mantine/core";
import DownloadIcon from "@mui/icons-material/Download";
import "./header.css";
import { useState } from "react";

export default function Header() {
  const [opened, setOpened] = useState(false);

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
            Are you sure!, Do you really want to dowmnload it as excel ?
          </Text>
        </div>
        <div className="button-group-modal">
          <Button variant="outline">Cancel</Button>
          <Button variant="filled">Yes, Download</Button>
        </div>
      </Modal>
    </>
  );
}
