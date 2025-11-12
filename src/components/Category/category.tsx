import { Accordion, Checkbox, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { selectedFilter } from "../../store/filterStore";
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

            {/* Scrollable container for all categories */}
            <div className="category-scroll">
              {categories.map((category) => (
                <div className="category-checkbox" key={category.categoryName}>
                  <Checkbox
                    label={category.categoryName}
                    onChange={() => onCheckboxChange(category.categoryName)}
                    checked={filters.Category.includes(category.categoryName)}
                  />
                  <Text c="dimmed">{category.incidentCount}</Text>
                </div>
              ))}
            </div>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
