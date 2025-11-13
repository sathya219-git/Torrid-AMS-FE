import { Accordion, Checkbox, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { List, RowComponentProps } from "react-window";
import { selectedCategories } from "../../store/filterStore";
import "./category.css";
import { CategoryItem } from "./category.interface";

export default function Category() {
  const [selectedFilters, setSelectedFilters] = useAtom(selectedCategories);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/categorycountbygroup")
      .then((res) => {
        const data: CategoryItem[] = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching category counts:", err);
        setCategories([]);
      });
  }, []);

  const selectAll = useMemo(() => {
    return selectedFilters.length === categories.length;
  }, [selectedFilters, categories]);

  const onCheckboxChange = useCallback(
    (value: string) => {
      setSelectedFilters((prev) => {
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      });
    },
    [categories]
  );

  const selectAllCategories = useCallback(() => {
    setSelectedFilters(categories.map((c) => c.categoryName));
  }, [categories]);

  const deSelectAllCategories = useCallback(() => {
    setSelectedFilters([]);
  }, []);

  const onSelectAll = useCallback(() => {
    if (selectAll) {
      deSelectAllCategories();
    } else {
      selectAllCategories();
    }
  }, [selectAll]);

  return (
    <Accordion
      defaultValue="category"
      classNames={{ item: "accordion-border" }}
    >
      <Accordion.Item key="category" value="category">
        <Accordion.Control>
          <Text fw={700}>Category</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="category-container">
            <div className="select-all">
              <Checkbox
                label="Select All"
                checked={selectAll}
                onChange={onSelectAll}
              />
            </div>

            <List
              rowComponent={CategoryComponent}
              rowCount={categories.length}
              rowHeight={37}
              rowProps={{ categories, onCheckboxChange, selectedFilters }}
              className="category-scroll"
            />
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

function CategoryComponent({
  index,
  categories,
  onCheckboxChange,
  selectedFilters,
  style,
}: RowComponentProps<{
  categories: CategoryItem[];
  onCheckboxChange: (value: string) => void;
  selectedFilters: string[];
}>) {
  return (
    <div
      className="category-checkbox"
      key={categories[index].categoryName}
      style={style}
    >
      <Checkbox
        label={categories[index].categoryName}
        onChange={() => onCheckboxChange(categories[index].categoryName)}
        checked={selectedFilters.includes(categories[index].categoryName)}
      />
      <Text c="dimmed">{categories[index].incidentCount}</Text>
    </div>
  );
}
