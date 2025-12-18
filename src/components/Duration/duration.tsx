import { Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TodayIcon from "@mui/icons-material/Today";
import { useAtom } from "jotai";
import { selectedFromDate, selectedToDate } from "../../store/filterStore";
import "./duration.css";

export default function Duration() {
  const [fromDate, setSelectedFromDate] = useAtom(selectedFromDate);
  const [toDate, setSelectedToDate] = useAtom(selectedToDate);

  const onFromDateChange = (value: string | null) => {
    
    setSelectedFromDate(value ? new Date(value) : null);
  };

  const onToDateChange = (value: string | null) => {
    setSelectedToDate(value ? new Date(value) : null);
  };

  return (
    <div className="duration-container">
      <Text fw={700}>Duration</Text>
      <div className="duration-content">
        <DatePickerInput
          valueFormat="DD/MM/YYYY"
          rightSection={<TodayIcon fontSize="medium" />}
          label="Period from date"
          placeholder="dd/mm/yyyy"
          value={fromDate}
          onChange={onFromDateChange}
          classNames={{ input: "date-input", root: "date-icon" }}
        ></DatePickerInput>
        <Text c="dimmed" className="date-text">
          to
        </Text>
        <DatePickerInput
          valueFormat="DD/MM/YYYY"
          rightSection={<TodayIcon fontSize="medium" />}
          label="to date"
          placeholder="dd/mm/yyyy"
          value={toDate}
          onChange={onToDateChange}
          classNames={{ input: "date-input", root: "date-icon" }}
        ></DatePickerInput>
      </div>
    </div>
  );
}
