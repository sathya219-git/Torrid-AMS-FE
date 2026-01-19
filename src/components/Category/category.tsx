import { Accordion, Checkbox, Text } from "@mantine/core";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { List, RowComponentProps } from "react-window";
import {
  categories,
  InitiateAPI,
  selectedCategories,
} from "../../store/filterStore";
import "./category.css";
import { CategoryItem } from "./category.interface";

export default function Category() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const categoryList = useAtomValue(categories);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedCategories);

  const initiateAPI = useSetAtom(InitiateAPI);

  useEffect(() => {
    if (categoryList.length > 0) {
      return;
    }
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(`${API_BASE_URL}/api/Incident/categorycountbygroup`, {
        method: "GET",
        body: null,
      });
      return curr;
    });
  }, []);

  const selectAll = useMemo(() => {
    return selectedFilters.length === categoryList.length;
  }, [selectedFilters, categoryList]);

  const onCheckboxChange = useCallback(
    (value: string) => {
      setSelectedFilters((prev) => {
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      });
    },
    [categoryList]
  );

  const selectAllCategories = useCallback(() => {
    setSelectedFilters(categoryList.map((c) => c.categoryName));
  }, [categoryList]);

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
              rowCount={categoryList.length}
              rowHeight={37}
              rowProps={{ categoryList, onCheckboxChange, selectedFilters }}
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
  categoryList,
  onCheckboxChange,
  selectedFilters,
  style,
}: RowComponentProps<{
  categoryList: CategoryItem[];
  onCheckboxChange: (value: string) => void;
  selectedFilters: string[];
}>) {
  return (
    <div
      className="category-checkbox"
      key={categoryList[index].categoryName || "NA"}
      style={style}
    >
      <Checkbox
        label={
          categoryList[index].categoryName?.trim()
            ? categoryList[index].categoryName
            : "N/A"
        }
        onChange={() =>
          onCheckboxChange(
            categoryList[index].categoryName?.trim()
              ? categoryList[index].categoryName
              : "N/A"
          )
        }
        checked={selectedFilters.includes(
          categoryList[index].categoryName?.trim()
            ? categoryList[index].categoryName
            : "N/A"
        )}
      />
      <Text c="dimmed">{categoryList[index].incidentCount}</Text>
    </div>
  );
}
