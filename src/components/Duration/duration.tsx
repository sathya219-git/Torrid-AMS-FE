import { Text } from "@mantine/core";
import "./duration.css";
import { DatePickerInput } from "@mantine/dates";
import TodayIcon from "@mui/icons-material/Today";

export default function Duration() {
  return (
    <div className="duration-container">
      <Text fw={500}>Duration</Text>
      <div className="duration-content">
        <DatePickerInput
          rightSection={<TodayIcon fontSize="medium" />}
          label="Period from date"
          placeholder="dd/mm/yyyy"
          classNames={{ input: "date-input", root: "date-icon" }}
        ></DatePickerInput>
        <Text c="dimmed" className="date-text">
          to
        </Text>
        <DatePickerInput
          rightSection={<TodayIcon fontSize="medium" />}
          label="to date"
          placeholder="dd/mm/yyyy"
          classNames={{ input: "date-input", root: "date-icon" }}
        ></DatePickerInput>
      </div>
    </div>
  );
}
