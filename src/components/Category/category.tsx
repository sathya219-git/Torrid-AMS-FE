import { Checkbox, Text } from "@mantine/core";
import "./category.css";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";

export default function Category() {
  const [filters, setFilters] = useAtom(selectedFilter);
  const [selectAll, setSelectAll] = useState(false);

  const categories = [
    { name: "Ecom systems", count: 670 },
    { name: "Operartional", count: 320 },
    { name: "Genaral Questions", count: 220 },
    { name: "Retail Systems", count: 120 },
    { name: "Supply Chain", count: 10 },
  ];

  const categoryChanges = (value: string) => {
    setFilters((prev) => {
      const updatedCategories = prev.category.includes(value)
        ? prev.category.filter((v) => v !== value)
        : [...prev.category, value];

      // Update selectAll
      setSelectAll(updatedCategories.length === categories.length);

      return { ...prev, category: updatedCategories };
    });
  };

  // Select
  const selectAllCategories = () => {
    const allCategoryNames = categories.map((c) => c.name);
    setFilters((prev) => ({ ...prev, category: allCategoryNames }));
    setSelectAll(true);
  };

  // Deselect
  const deselectAllCategories = () => {
    setFilters((prev) => ({ ...prev, category: [] }));
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
    if (filters.assignmentGroup.length === 0) {
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
          <div className="category-checkbox" key={category.name}>
            <Checkbox
              label={category.name}
              onChange={() => categoryChanges(category.name)}
              checked={filters.category.includes(category.name)}
            />
            <Text c="dimmed">{category.count}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
