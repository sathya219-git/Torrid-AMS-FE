import { Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TodayIcon from "@mui/icons-material/Today";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import "./duration.css";

export default function Duration() {
  const [filters, setFilters] = useAtom(selectedFilter);

  const onFromDateChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      FromDate: value ? new Date(value) : null,
    }));
  };

  const onToDateChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      ToDate: value ? new Date(value) : null,
    }));
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
          value={filters.FromDate}
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
          value={filters.ToDate}
          onChange={onToDateChange}
          classNames={{ input: "date-input", root: "date-icon" }}
        ></DatePickerInput>
      </div>
    </div>
  );
}
