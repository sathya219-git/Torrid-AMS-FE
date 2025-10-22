import { Checkbox, Text } from "@mantine/core";
import "./category.css";

export default function Category() {
  const categories = [
    { name: "All", count: 1370 },
    { name: "Ecom systems", count: 670 },
    { name: "Operartional", count: 320 },
    { name: "Genaral Questions", count: 220 },
    { name: "Retail Systems", count: 120 },
    { name: "Supply Chain", count: 10 },
  ];

  return (
    <div className="category-container">
      <Text fw={500}>Category</Text>
      <div className="category-content">
        {categories.map((category) => (
          <div className="category-checkbox" key={category.name}>
            <Checkbox label={category.name} />
            <Text c="dimmed">{category.count}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
