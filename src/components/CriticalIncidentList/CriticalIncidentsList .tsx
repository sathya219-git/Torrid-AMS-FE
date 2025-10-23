import React, { useState, useMemo } from 'react';
import { Accordion, Input } from '@mantine/core';
import './CriticalIncidentsList.css'; // Assuming this file exists for styling
import { BsSortDown, BsSortUp } from "react-icons/bs";
import backward from '../../assets/backward.png';
import forward from '../../assets/forward.png';
// --- TYPE DEFINITIONS --- 
const incidentsData = [
  { id: 'INC2233999', description: 'Network Outage at Data Center 3.', category: 'Ecom Systems', priority: 'P1', resolution: 'Network connectivity restored; root cause analysis ongoing.', state: 'Closed', resolvedDate: '9/2/2025', resolvedTime: '11:22:33 AM' },
  { id: 'INC2233988', description: 'Database Server Overload.', category: 'Ecom Systems', priority: 'P1', resolution: 'Server rebooted; investigating memory leak.', state: 'Open', resolvedDate: '9/2/2025', resolvedTime: '10:11:22 AM' },
  { id: 'INC2233987', description: 'Payment Gateway Failure.', category: 'Finance', priority: 'P2', resolution: 'Service Restored; applied hotfix.', state: 'In progress', resolvedDate: '9/2/2025', resolvedTime: '09:00:11 AM' },
  { id: 'INC2233986', description: 'DDoS Attack on Web Servers.', category: 'Security', priority: 'P2', resolution: 'Implemented rate limiting; traffic normalized.', state: 'On hold', resolvedDate: '9/2/2025', resolvedTime: '07:55:00 AM' },
  { id: 'INC2233985', description: 'Critical System Upgrade Failure.', category: 'Infrastructure', priority: 'P3', resolution: 'Rolled back to previous version; investigating root cause.', state: 'Reopen', resolvedDate: '9/2/2025', resolvedTime: '06:44:36 AM' },
  { id: 'INC2233984', description: 'Data Corruption in Production DB.', category: 'Ecom Systems', priority: 'P1', resolution: 'Restored from backup; running consistency checks.', state: 'In progress', resolvedDate: '9/2/2025', resolvedTime: '05:33:44 AM' },
  { id: 'INC2233993', description: 'Unexpected Server Shutdown.', category: 'Finance', priority: 'P3', resolution: 'Server restarted; checking hardware logs.', state: 'On hold', resolvedDate: '9/2/2025', resolvedTime: '04:22:33 AM' },
  { id: 'INC2233992', description: 'SSL Certificate Expired.', category: 'Security', priority: 'P2', resolution: 'Renewed certificate; services restored.', state: 'Closed', resolvedDate: '9/2/2025', resolvedTime: '03:11:22 AM' },
  { id: 'INC2233991', description: 'Hardware Failure.', category: 'Infrastructure', priority: 'P4', resolution: 'Replaced faulty hardware.', state: 'Closed', resolvedDate: '9/2/2025', resolvedTime: '02:00:00 AM' },
  // Additional data points added to confirm dynamic P4
  { id: 'INC2233990', description: 'Minor UI Bug.', category: 'Ecom Systems', priority: 'P4', resolution: 'Fixed in hotfix release.', state: 'Closed', resolvedDate: '9/2/2025', resolvedTime: '01:00:00 AM' },
];

type Incident = typeof incidentsData[number];
type SortKey = keyof Incident | 'resolvedDateTime';
type SortDirection = 'asc' | 'desc';
type PriorityCode = string;
type PriorityValue = string;
const ALL_PRIORITIES_KEY = 'All Incidents';

// --- CONFIGURATION ---
const INCIDENTS_PER_PAGE = 5;

/**
 * Helper to map a priority code (P1) to a display value (P1- Critical)
 */
const getPriorityDisplayValue = (code: PriorityCode): PriorityValue => {
  const mapping: Record<PriorityCode, string> = {
    'P1': 'Critical',
    'P2': 'High',
    'P3': 'Moderate',
    'P4': 'Low',
  };
  return `${code}- ${mapping[code] || 'Priority'}`;
};

// --- REACT COMPONENT --- 
const CriticalIncidentsList = () => {
  // 1. Dynamic Priority Extraction and Definition
  const dynamicPriorityCodes: PriorityCode[] = useMemo(() => {
    const codes = Array.from(new Set(incidentsData.map(d => d.priority)));
    codes.sort((a, b) => {
      const numA = parseInt(a.substring(1));
      const numB = parseInt(b.substring(1));
      return numA - numB;
    });
    return codes;
  }, []);

  const dynamicPriorityLevels = useMemo(() => {
    return dynamicPriorityCodes.map(code => ({
      value: getPriorityDisplayValue(code),
      code: code
    }));
  }, [dynamicPriorityCodes]);

  // FIX: Set the initial state to the 'All Incidents' key
  const initialAccordionValue = ALL_PRIORITIES_KEY;

  const [activePriority, setActivePriority] = useState<PriorityValue | null>(initialAccordionValue);

  // Search terms and sort configs must now be keyed by PriorityCode OR the ALL_PRIORITIES_KEY
  const initialSearchTerms: Record<PriorityCode | typeof ALL_PRIORITIES_KEY, string> = { [ALL_PRIORITIES_KEY]: '' };
  dynamicPriorityCodes.forEach(code => initialSearchTerms[code] = '');

  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);

  const initialSortConfigs: Record<PriorityCode | typeof ALL_PRIORITIES_KEY, { key: SortKey; direction: SortDirection } | null> = {
    [ALL_PRIORITIES_KEY]: { key: 'id', direction: 'asc' }
  };
  dynamicPriorityCodes.forEach(code => initialSortConfigs[code] = { key: 'id', direction: 'asc' });

  const [sortConfigs, setSortConfigs] = useState(initialSortConfigs);

  const [currentPage, setCurrentPage] = useState<number>(1);

  // --- DATA PROCESSING (Memoized for performance) ---
  const getProcessedIncidents = useMemo(() => {
    const allKeys = [...dynamicPriorityCodes, ALL_PRIORITIES_KEY];

    const processedData: Record<string, Incident[]> = {};

    allKeys.forEach(key => {
      let filtered = key === ALL_PRIORITIES_KEY
        ? incidentsData
        : incidentsData.filter(incident => incident.priority === key);

      const searchTerm = searchTerms[key]?.toLowerCase() || '';
      const sortConfig = sortConfigs[key];

      // 2. SEARCH FILTERING
      if (searchTerm) {
        filtered = filtered.filter(incident =>
          Object.values(incident).some(val =>
            String(val).toLowerCase().includes(searchTerm)
          )
        );
      }

      // 3. SORTING 
      if (sortConfig) {
        filtered.sort((a, b) => {
          let aVal: any, bVal: any;
          const { key: sortKey, direction } = sortConfig;

          if (sortKey === 'resolvedDateTime') {
            aVal = new Date(`${a.resolvedDate} ${a.resolvedTime}`).getTime();
            bVal = new Date(`${b.resolvedDate} ${b.resolvedTime}`).getTime();
          } else {
            aVal = String(a[sortKey as keyof Incident]).toLowerCase();
            bVal = String(b[sortKey as keyof Incident]).toLowerCase();
          }

          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      processedData[key] = filtered;
    });

    return processedData as Record<PriorityCode | typeof ALL_PRIORITIES_KEY, Incident[]>;
  }, [searchTerms, sortConfigs, dynamicPriorityCodes]);

  // --- HANDLERS ---
  const handleTabClick = (value: PriorityValue | typeof ALL_PRIORITIES_KEY) => {
    setActivePriority(value);
    setCurrentPage(1);
  };

  const handleAccordionChange = (value: string | null) => {
    setActivePriority(value as PriorityValue | typeof ALL_PRIORITIES_KEY | null);
    setCurrentPage(1);
  };

  const handleSearchChange = (key: PriorityCode | typeof ALL_PRIORITIES_KEY, term: string) => {
    setSearchTerms(prev => ({ ...prev, [key]: term }));
    setCurrentPage(1);
  };

  const handleSort = (sortKey: SortKey, dataKey: PriorityCode | typeof ALL_PRIORITIES_KEY) => {
    const currentConfig = sortConfigs[dataKey];
    let direction: SortDirection = 'asc';

    if (currentConfig && currentConfig.key === sortKey) {
      direction = currentConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    const newSortConfigs = { ...sortConfigs };
    newSortConfigs[dataKey] = { key: sortKey, direction };

    setSortConfigs(newSortConfigs);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const activeCode = activePriority === ALL_PRIORITIES_KEY
      ? ALL_PRIORITIES_KEY
      : dynamicPriorityLevels.find(p => p.value === activePriority)?.code;

    if (!activeCode) return;

    const allIncidents = getProcessedIncidents[activeCode] || [];
    const totalItems = allIncidents.length;
    const totalPages = Math.ceil(totalItems / INCIDENTS_PER_PAGE);

    const validatedPage = Math.max(1, Math.min(newPage, totalPages || 1));

    setCurrentPage(validatedPage);
  };

  // --- RENDER LOGIC ---

  // 1. Create the 'All Incidents' Accordion Item
  const allIncidentsKey = ALL_PRIORITIES_KEY;
  const allIncidentsItem = (
    <IncidentAccordionItem
      key={allIncidentsKey}
      dataKey={allIncidentsKey}
      priorityValue={allIncidentsKey}
      allIncidents={getProcessedIncidents[allIncidentsKey] || []}
      INCIDENTS_PER_PAGE={INCIDENTS_PER_PAGE}
      searchTerms={searchTerms}
      sortConfigs={sortConfigs}
      currentPage={currentPage}
      activePriority={activePriority}
      handleSearchChange={handleSearchChange}
      handleSort={handleSort}
      handlePageChange={handlePageChange}
    />
  );

  // 2. Create the Dynamic Priority Accordion Items
  const priorityAccordionItems = dynamicPriorityLevels.map((priority) => (
    <IncidentAccordionItem
      key={priority.code}
      dataKey={priority.code}
      priorityValue={priority.value}
      allIncidents={getProcessedIncidents[priority.code] || []}
      INCIDENTS_PER_PAGE={INCIDENTS_PER_PAGE}
      searchTerms={searchTerms}
      sortConfigs={sortConfigs}
      currentPage={currentPage}
      activePriority={activePriority}
      handleSearchChange={handleSearchChange}
      handleSort={handleSort}
      handlePageChange={handlePageChange}
    />
  ));

  // The Accordion list starts with the 'All Incidents' item, then the specific priorities.
  const accordionItems = [allIncidentsItem, ...priorityAccordionItems];


  return (
    <div className="incident-dashboard">
      <h1 className="dashboard-title">Critical Incidents List </h1>

      {/* Tab Bar for quick switching */}
      <div className="filter-tabs">
        <button
          className={`tab-button ${activePriority === ALL_PRIORITIES_KEY ? 'active' : ''}`}
          onClick={() => handleTabClick(ALL_PRIORITIES_KEY)}
        >
          All Incidents ({incidentsData.length})
        </button>
        {dynamicPriorityLevels.map((p) => (
          <button
            key={p.code}
            className={`tab-button ${activePriority === p.value ? 'active' : ''}`}
            onClick={() => handleTabClick(p.value)}
          >
            {p.value} ({getProcessedIncidents[p.code]?.length || 0})
          </button>
        ))}
      </div>

      {/* Main Accordion Display */}
      <div className="incident-section">
        <div className="section-header">
          <Accordion
            chevronPosition="right"
            // Use activePriority for the currently open accordion panel
            value={activePriority}
            onChange={handleAccordionChange}
            styles={{ item: { borderBottom: 'none' } }}
          >
            {accordionItems}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CriticalIncidentsList;

// --- DEDICATED ACCORDION ITEM COMPONENT ---

type IncidentAccordionItemProps = {
  dataKey: PriorityCode | typeof ALL_PRIORITIES_KEY;
  priorityValue: PriorityValue | typeof ALL_PRIORITIES_KEY;
  allIncidents: Incident[];
  INCIDENTS_PER_PAGE: number;
  searchTerms: Record<string, string>;
  sortConfigs: Record<string, { key: SortKey; direction: SortDirection } | null>;
  currentPage: number;
  activePriority: string | null;
  handleSearchChange: (key: string, term: string) => void;
  handleSort: (sortKey: SortKey, dataKey: string) => void;
  handlePageChange: (newPage: number) => void;
}

/**
 * Renders a single Accordion Item for a priority level or the 'All' view.
 */
const IncidentAccordionItem: React.FC<IncidentAccordionItemProps> = ({
  dataKey,
  priorityValue,
  allIncidents,
  INCIDENTS_PER_PAGE,
  searchTerms,
  sortConfigs,
  currentPage,
  activePriority,
  handleSearchChange,
  handleSort,
  handlePageChange,
}) => {
  const totalItems = allIncidents.length;
  const totalPages = Math.ceil(totalItems / INCIDENTS_PER_PAGE);

  const effectivePage = activePriority === priorityValue
    ? Math.min(currentPage, Math.max(1, totalPages))
    : 1;

  const start = (effectivePage - 1) * INCIDENTS_PER_PAGE;
  const end = Math.min(start + INCIDENTS_PER_PAGE, totalItems);

  const paginatedIncidents = activePriority === priorityValue
    ? allIncidents.slice(start, end)
    : [];

  const renderSortIcon = (key: SortKey) => {
    const sortConfig = sortConfigs[dataKey];

    if (sortConfig && sortConfig.key === key) {
      const icon = sortConfig.direction === 'asc'
        ? <BsSortUp size={14} />
        : <BsSortDown size={14} />;
      return <span className="sort-indicator active">{icon}</span>;
    }

    return <span className="sort-indicator default"><BsSortUp size={14} /></span>;
  };

  const itemKey = `${dataKey}-${JSON.stringify(sortConfigs[dataKey])}`;

  return (
    <div >

      <div>
        <Accordion.Item key={itemKey} value={priorityValue}>
          <Accordion.Control className="incident-accordion-control">
            {`${priorityValue} `} ({totalItems})
          </Accordion.Control>
          <Accordion.Panel>
            <Input
              classNames={{ wrapper: 'my-input-wrapper', input: 'my-input-element' }}
              placeholder={`Search incidents for ${priorityValue}...`}
              value={searchTerms[dataKey]}
              onChange={(e) => handleSearchChange(dataKey, e.target.value)}
            />
            <div className="incident-table-container">
              {/* Table Header */}
              <div className="incident-row header-row">
                <span className="col-incident-no" onClick={() => handleSort('id', dataKey)}>Incident no {renderSortIcon('id')}</span>
                <span className="col-description" onClick={() => handleSort('description', dataKey)}>Description {renderSortIcon('description')}</span>
                <span className="col-category" onClick={() => handleSort('category', dataKey)}>Category {renderSortIcon('category')}</span>
                <span className="col-resolution" onClick={() => handleSort('resolution', dataKey)}>Resolution notes{renderSortIcon('resolution')}</span>
                <span className="col-state" onClick={() => handleSort('state', dataKey)}>State {renderSortIcon('state')}</span>
                <span className="col-resolved-date" onClick={() => handleSort('resolvedDateTime', dataKey)}>
                  Resolved <br /> Date & Time {renderSortIcon('resolvedDateTime')}
                </span>
              </div>

              {/* Table Body */}
              <div className="incident-body">
                {paginatedIncidents.length > 0 ? (
                  paginatedIncidents.map((incident) => (
                    <div key={incident.id} className="incident-row data-row">
                      <span className="col-incident-no">{incident.id}</span>
                      <span className="col-description">{incident.description}</span>
                      <span className="col-category">{incident.category}</span>
                      <span className="col-resolution">{incident.resolution}</span>
                      <span className={`col-state state-${incident.state.toLowerCase().replace(' ', '-')}`}>{incident.state}</span>
                      <span className="col-resolved-date">
                        {incident.resolvedDate}<br />{incident.resolvedTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="incident-row data-row" style={{ display: 'block', textAlign: 'center', padding: '20px' }}>
                    {activePriority === priorityValue && totalItems === 0
                      ? "No incidents found for this priority and search term."
                      : null
                    }
                  </div>
                )}
              </div>


            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </div>

      <div>
        {/* Pagination/Summary */}
        {activePriority === priorityValue && totalItems > 0 && (
          <div className="pagination-footer">
            <span>{`Showing ${Math.min(start + 1, totalItems)}-${Math.min(end, totalItems)} of ${totalItems} Total ${dataKey} Incidents`}</span>
            <div className="pagination-controls">
              {/* Back to First Page */}
              <button style={{ borderRadius: '6px 0 0 6px', border: ' 1px solid #33303111' }} onClick={() => handlePageChange(1)} disabled={effectivePage === 1} ><img src={forward} alt="" /><img src={forward} alt="" /></button>

              {/* Previous Page */}
              <button
                style={{ border: ' 1px solid #33303111' }}
                onClick={() => handlePageChange(effectivePage - 1)}
                disabled={effectivePage === 1}>
                <img src={forward} alt="" />
              </button>

              {/* Next Page */}
              <button
                style={{ border: ' 1px solid #33303111' }}
                onClick={() => handlePageChange(effectivePage + 1)}
                disabled={effectivePage === totalPages}>
                <img src={backward} alt="" />
              </button>

              {/* Forward to Last Page */}
              <button style={{ borderRadius: '0 6px 6px 0', border: ' 1px solid #33303111' }} onClick={() => handlePageChange(totalPages)} disabled={effectivePage === totalPages}><img src={backward} alt="" /><img src={backward} alt="" /></button>
            </div>
          </div>
        )}
      </div>

    </div>


  );
}