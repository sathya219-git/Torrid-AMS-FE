import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import ReactDOM from 'react-dom/client';
import Cards from "./components/cards/cards";
import MemberPortfolio from "./components/member-portfolio/member-portfolio";
import CriticalIncidentsList from "./components/criticalincidentlist/CriticalIncidentsList ";
import IncidentChart from "./components/cards/IncidentChart";
import DonutCharts from "./components/cards/donutChart";
import PieChartWithExplosion from "./components/cards/PieChartWithExplosion";
import { AreaChart } from "recharts";
import AreaChartSection from "./components/cards/areaChart";
import RadarChart from "./components/cards/radarChart";
import { DonutChart } from "@mantine/charts";
import LineChart from "./components/cards/lineChart";
import Login from "./pages/Login/login";
// import Dashboard from "./components/Dashboard/dashboard";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard/dashboard";







export default function App() {

  return <MantineProvider theme={theme}>
    {

      <><MantineProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider><>
          {/* <PieChartWithExplosion /> */}
          {/* <Cards /> */}
          {/* <AreaChartSection/> */}

          {/* <DonutCharts /> */}

          {/* <MemberPortfolio />
          <CriticalIncidentsList />  */}

          {/* <IncidentChart  />  */}
          {/* <RadarChart /> */}
          {/* <LineChart/> */}

        </></>
    }

  </MantineProvider>;
}
