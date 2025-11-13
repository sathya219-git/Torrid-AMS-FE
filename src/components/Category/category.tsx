import { Accordion, Checkbox, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { List, RowComponentProps } from "react-window";
import { FilterState, selectedFilter } from "../../store/filterStore";
import "./category.css";
import { CategoryItem } from "./category.interface";

export default function Category() {
  const [filters, setFilters] = useAtom(selectedFilter);
  const [selectAll, setSelectAll] = useState(false);
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

  const onCheckboxChange = useCallback(
    (value: string) => {
      setFilters((prev) => {
        const updatedCategories = prev.Category.includes(value)
          ? prev.Category.filter((v) => v !== value)
          : [...prev.Category, value];

        setSelectAll(updatedCategories.length === categories.length);
        return { ...prev, Category: updatedCategories };
      });
    },
    [categories]
  );

  const selectAllCategories = useCallback(() => {
    const allCategoryNames = categories.map((c) => c.categoryName);
    setFilters((prev) => ({ ...prev, Category: allCategoryNames }));
    setSelectAll(true);
  }, [categories]);

  const deSelectAllCategories = useCallback(() => {
    setFilters((prev) => ({ ...prev, Category: [] }));
    setSelectAll(false);
  }, []);

  const onSelectAll = useCallback(() => {
    if (selectAll) {
      deSelectAllCategories();
    } else {
      selectAllCategories();
    }
  }, [selectAll]);

  useEffect(() => {
    if (filters.Category.length === 0) {
      setSelectAll(false);
    }
  }, [filters]);

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
              rowProps={{ categories, onCheckboxChange, filters }}
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
  filters,
  style,
}: RowComponentProps<{
  categories: CategoryItem[];
  onCheckboxChange: (value: string) => void;
  filters: FilterState;
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
        checked={filters.Category.includes(categories[index].categoryName)}
      />
      <Text c="dimmed">{categories[index].incidentCount}</Text>
    </div>
  );
}
