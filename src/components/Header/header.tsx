import { Button, Text } from "@mantine/core";
import DownloadIcon from "@mui/icons-material/Download";
import "./header.css";

export default function Header() {
  return (
    <div className="page-container">
      <div className="page-title">
        <Text fw={500} size="xl">
          Dashboard
        </Text>
      </div>
      <div className="page-right">
        <div className="page-download">
          <Text fw={500}>Download Report</Text>
          <Button rightSection={<DownloadIcon fontSize="medium" />}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
