import { Checkbox, Text } from "@mantine/core";
import "./category.css";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Category() {
  type Category = {
    categoryName: string;
    incidentCount: number;
  };

  const [filters, setFilters] = useAtom(selectedFilter);
  const [selectAll, setSelectAll] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  //data from API
  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/categorycountbygroup")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching category counts:", err);
        setCategories([]);
      });
  }, []);

  const categoryChanges = (value: string) => {
    setFilters((prev) => {
      const updatedCategories = prev.Category.includes(value)
        ? prev.Category.filter((v) => v !== value)
        : [...prev.Category, value];

      // Update selectAll
      setSelectAll(updatedCategories.length === categories.length);

      return { ...prev, Category: updatedCategories };
    });
  };

  // Select
  const selectAllCategories = () => {
    const allCategoryNames = categories.map((c) => c.categoryName);
    setFilters((prev) => ({ ...prev, Category: allCategoryNames }));
    setSelectAll(true);
  };

  // Deselect
  const deselectAllCategories = () => {
    setFilters((prev) => ({ ...prev, Category: [] }));
    setSelectAll(false);
  };

  // Handle Select All toggle
  const handleSelectAll = () => {
    if (selectAll) {
      deselectAllCategories();
    } else {
      selectAllCategories();
    }
  };

  useEffect(() => {
    if (filters.Category.length === 0) {
      setSelectAll(false);
    }
  }, [filters]);

  return (
    <div className="category-container">
      <Text fw={500}>Category</Text>
      <div>
        <Checkbox label="All" checked={selectAll} onChange={handleSelectAll} />
      </div>
      <div className="category-content">
        {categories.map((category) => (
          <div className="category-checkbox" key={category.categoryName}>
            <Checkbox
              label={category.categoryName}
              onChange={() => categoryChanges(category.categoryName)}
              checked={filters.Category.includes(category.categoryName)}
            />
            <Text c="dimmed">{category.incidentCount}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
