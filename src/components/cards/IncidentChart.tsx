import React from 'react';
import './IncidentChart.css';
// Ensure the path is correct based on your project structure:
// If 'IncidentChart.tsx' is in 'src/components/cards/' and data is in 'src/data/', 
// then '../data/incidents' is correct (goes up one level to 'src/components/', then into 'data/')
import { Incident, incidentsData } from '../data/incidents';


// --- Data Structure Definitions ---

// NOTE: The 'Incident' interface is now imported, but 'IncidentStateData' is local
interface IncidentStateData {
  state: string;
  count: number;
  color: string;
}

// --- Utility Function to Aggregate Data (Fixed with Colors) ---

const aggregateIncidentData = (
  incidents: Incident[],
  priority: string // Target priority is passed internally as 'P1'
): { data: IncidentStateData[]; totalCount: number; maxCount: number } => {
  
  const filteredIncidents = incidents.filter(inc => inc.priority === priority);

  // Initialize all states with 0
  const stateCounts: Record<string, number> = { 
    Open: 0, 
    'In progress': 0, 
    Closed: 0, 
    'On-Hold': 0, 
    Reopen: 0, 
    Resolved: 0, 
  };
  
  // *** FIX: Correct color mapping for each state ***
  const stateColors: Record<string, string> = {
    'Open': '#FC7E80',
    'In progress': '#ECCF5C',
    'On-Hold': '#A291FD',
    'Closed': '#4FDBF5',
    'Resolved': '#53D7B6',
    'Reopen': '#FC88F0',
  };

  filteredIncidents.forEach(inc => {
    if (stateCounts.hasOwnProperty(inc.state)) {
      stateCounts[inc.state] += 1;
    }
  });

  const totalCount = filteredIncidents.length;
  const maxCount = Math.max(...Object.values(stateCounts), 1);

  const chartData: IncidentStateData[] = Object.keys(stateCounts).map(state => ({
    state: state,
    count: stateCounts[state],
    // *** FIX: Correctly assigns the color from the map ***
    color: stateColors[state], 
  }));

  return { data: chartData, totalCount, maxCount };
};

// --- React Component (TSX) ---

// No props are required for the component
const IncidentChart: React.FC = () => {
  
  // *** KEY FIX: Hardcode the target priority internally to 'P1' ***
  const targetPriority = 'P1'; 
  
  // Use the imported incidentsData and the internal priority target
  const { data, totalCount, maxCount } = aggregateIncidentData(incidentsData, targetPriority);

  return (
    <div className="incident-chart-container">
      {/* Title is based on the internal targetPriority */}
      <h2 className="chart-title">{targetPriority}- Critical ({totalCount})</h2>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div className="bar-column" key={index}>
            <div className="bar-count">{item.count}</div>
            <div
              className="bar"
              style={{
                // Bars use the correct, calculated color
                height: `${(item.count / maxCount) * 100}%`,
                backgroundColor: item.color, 
              }}
            ></div>
            <div className="bar-label">{item.state}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentChart;