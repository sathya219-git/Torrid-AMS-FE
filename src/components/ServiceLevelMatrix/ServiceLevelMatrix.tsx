import React from "react";
import "./ServiceLevelMatrix.css";
import { Text } from "@mantine/core";

// Define the data structure for a single row in the matrix
interface ServiceLevelRow {
  severity: string;
  priority: string;
  targetResponseRegular: string;
  targetResponseOnCall: string;
  targetResolutionRegular: string;
  targetResolutionOnCall: string;
}

// Define the entire dataset based on the image
const serviceLevelData: ServiceLevelRow[] = [
  {
    severity: "P1 - Critical",
    priority: "High",
    targetResponseRegular: "15 minutes",
    targetResponseOnCall: "15 minutes",
    targetResolutionRegular: "2 hours",
    targetResolutionOnCall: "2 hours",
  },
  {
    severity: "P2 - High",
    priority: "Medium",
    targetResponseRegular: "15 minutes",
    targetResponseOnCall: "15 minutes",
    targetResolutionRegular: "4 hours",
    targetResolutionOnCall: "4 hours",
  },
  {
    severity: "P3 - Medium",
    priority: "Low",
    targetResponseRegular: "1 hour",
    targetResponseOnCall: "N/A",
    targetResolutionRegular: "1 business day",
    targetResolutionOnCall: "N/A",
  },
  {
    severity: "P4 - Low",
    priority: "Minimal",
    targetResponseRegular: "1 hour",
    targetResponseOnCall: "N/A",
    targetResolutionRegular: "5 business days",
    targetResolutionOnCall: "N/A",
  },
];

// Define the component
const ServiceLevelMatrix: React.FC = () => {
  return (
    <div className="service-level-matrix-container">
      <div className="service-level-metrix">
        <h2>Service Level Matrix</h2>
      </div>

      {/* The table is wrapped in a responsive container. 
        Note: The .service-level-table is where the majority of the CSS classes apply.
      */}
      <div className="table-responsive-wrapper">
        <table className="service-level-table">
          <thead>
            {/* The header is split into two rows for better readability, 
                especially for the Response Time and Resolution Time groups. */}
            <tr>
              {/* Row 1: Group Headers and single headers */}
              <th rowSpan={2} className="header-sticky">
                Severity
              </th>
              <th rowSpan={2} className="header-sticky">
                Priority
              </th>
              <th colSpan={2} className="header-group">
                Target Response Time
              </th>
              <th colSpan={2} className="header-group">
                Target Resolution Time
              </th>
            </tr>
            <tr>
              {/* Row 2: Sub-Headers (Regular vs. On-Call) */}
              <th className="header-sub">Regular Hours</th>
              <th className="header-sub">On-Call Hours</th>
              <th className="header-sub">Regular Hours</th>
              <th className="header-sub">On-Call Hours</th>
            </tr>
          </thead>
          <tbody>
            {serviceLevelData.map((row, index) => (
              <tr key={index} className={`row-level-${index + 1}`}>
                <td className="cell-severity">
                  <span>{row.severity.split(" - ")[0]}</span>
                  <br />
                  <span className="cell-severity-desc">
                    {row.severity.split(" - ")[1]}
                  </span>
                </td>
                <td className="cell-priority">{row.priority}</td>
                <td className="cell-response-regular">
                  {row.targetResponseRegular}
                </td>
                <td className="cell-response-oncall">
                  {row.targetResponseOnCall}
                </td>
                <td className="cell-resolution-regular">
                  {row.targetResolutionRegular}
                </td>
                <td className="cell-resolution-oncall">
                  {row.targetResolutionOnCall}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceLevelMatrix;
