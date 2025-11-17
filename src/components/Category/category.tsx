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
  const categoryList = useAtomValue(categories);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedCategories);

  const initiateAPI = useSetAtom(InitiateAPI);

  useEffect(() => {
    if (categoryList.length > 0) {
      return;
    }
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set("http://localhost:5092/api/Incident/categorycountbygroup", {
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
      key={categoryList[index].categoryName}
      style={style}
    >
      <Checkbox
        label={categoryList[index].categoryName}
        onChange={() => onCheckboxChange(categoryList[index].categoryName)}
        checked={selectedFilters.includes(categoryList[index].categoryName)}
      />
      <Text c="dimmed">{categoryList[index].incidentCount}</Text>
    </div>
  );
}
