import "./filterCategory.css";
import { Card, Text } from "@mantine/core";

export default function FilterCategory() {
    return (
        <Card
    
            className="category-result"
            withBorder>
            <Card.Section  inheritPadding >
                <div className="selected-filter">
                    <Text fw={500} size="xl">
                        <div className="filtered-results">
                            <h2>Filtered Results</h2>
                            <div className="filter-tags">
                                <div className="tag"><span>Ecom Systems</span> <button className="close-btn">&times;</button></div>
                                <div className="tag"><span>P1-Critical</span> <button className="close-btn">&times;</button></div>
                                <div className="tag"><span>P2-High</span> <button className="close-btn">&times;</button></div>
                                <div className="tag"><span>P3-Moderate</span> <button className="close-btn">&times;</button></div>
                                <div className="tag"><span>Open</span> <button className="close-btn">&times;</button></div>
                                <div className="tag"><span>On Hold</span> <button className="close-btn">&times;</button></div>
                                
                                
                                <span className="clear-all">ClearAll</span>
                            </div>
                        </div>
                    </Text>
                </div>
            </Card.Section>
        </Card>
    );


}