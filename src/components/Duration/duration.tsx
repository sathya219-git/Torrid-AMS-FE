import { Text } from "@mantine/core";
import "./duration.css";
import { DatePickerInput } from "@mantine/dates";
import TodayIcon from "@mui/icons-material/Today";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";

export default function Duration() {
  const [filters, setFilters] = useAtom(selectedFilter);

  //from date
  const fromDateChanges = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      FromDate: value ? new Date(value) : null,
    }));
  };

  //to date
  const toDateChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      ToDate: value ? new Date(value) : null,
    }));
  };

  // Convert Date → string for displaying
  const formatDate = (date: Date | null): string | null =>
    date ? date.toISOString().split("T")[0] : null;

  return (
    <div className="duration-container">
      <Text fw={700}>Duration</Text>
      <div className="duration-content">
        <DatePickerInput
          valueFormat="DD/MM/YYYY"
          rightSection={<TodayIcon fontSize="medium" />}
          label="Period from date"
          placeholder="dd/mm/yyyy"
          value={formatDate(filters.FromDate)}
          onChange={fromDateChanges}
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
          value={formatDate(filters.ToDate)}
          onChange={toDateChange}
          classNames={{ input: "date-input", root: "date-icon" }}
        ></DatePickerInput>
      </div>
    </div>
  );
}
