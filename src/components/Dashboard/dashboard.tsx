import "./dashboard.css";

export default function Dashboard() {


    return (
        <div className="main">
            <div className="main-header">

            </div>
            <div className="main-content">
                <div className="page-header">
                    page-header
                </div>
                <div className="page-content">
                    <div className="filter-content">
                        filter-content
                    </div>
                    <div className="filter-result">
                        <div className="filter-result-header">
                            filtered result
                        </div>
                        <div className="selected-filters">
                            No filter selected
                        </div>
                        <div className="main-visulisation">
                            <div className="cards">
                                <div className="each-card">

                                </div>
                                <div className="each-card">

                                </div>
                                <div className="each-card">

                                </div>
                                <div className="each-card">

                                </div>
                               
                            </div>

                            <div className="chart-bar">
                                <div className="each-chart">

                                </div>
                                <div className="each-chart">
                                    
                                </div>
                                <div className="each-chart">

                                </div>
                                <div className="each-chart">
                                    
                                </div>
                            </div>
                        </div>

                        <div className="team-member-portfolio">
                                <div className="heading-soring"></div>
                                <div className="content-list">
                                    <div className="member-list">

                                    </div>
                                </div>
                                <div className="pagination"></div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}