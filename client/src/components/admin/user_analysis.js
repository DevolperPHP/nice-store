import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Bar, Line } from "react-chartjs-2";
import AdminDashboard from "./admin_dashboard";
import "../../style/admin/analysis.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { showDashboard, hideDashboard } from "./dashboard/main";
import Loading from "../main/loading";
export default function UsersAnalysis() {
  const [usersGovernorate, setUsersGovernorate] = useState([]);
  const [usersGain, setUsersGain] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const dashBoardRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    const res = await axios(
      `${process.env.REACT_APP_SERVER_URL}/graph/users/governorate?date=1`,
      { withCredentials: true }
    );
    if (res.data.done) {
      setUsersGovernorate(res.data.data);
    }
    const res2 = await axios(
      `${process.env.REACT_APP_SERVER_URL}/graph/users/gain?date=current-month`,
      { withCredentials: true }
    );
    if (res2.data.done) {
      setUsersGain(res2.data.data);
    }
    setLoading(false);
  }, []);

  const usersGainChangeDate = async (e) => {
    const value = e.target.value;
    const url = `${process.env.REACT_APP_SERVER_URL}/graph/users/gain?date=${value}`;
    const res = await axios(url, { withCredentials: true });
    if (res.data.done) {
      setUsersGain(res.data.data);
    } else setErrMsg(res.data.errMsg);
  };
  if (loading) return <Loading />;
  const usersGovernorateData = {
    labels: usersGovernorate?.labels,
    datasets: [
      {
        label: "Users Governorate",
        data: usersGovernorate?.data,
        borderWidth: 1,
        fill: true,
      },
    ],
  };
  const usersGainData = {
    labels: usersGain?.labels,
    datasets: [
      {
        label: "Users Gain",
        data: usersGain?.data,
        borderWidth: 2,
        borderColor: "#3498DB",
        pointBackgroundColor: "#f4f4f4",
      },
    ],
  };

  return (
    <section className="main-analysis-section">
      <AdminDashboard dashBoardRef={dashBoardRef} />
      <div className="hide-item-without-purpose"></div>
      <div className="max-analysis">
        <div className="analysis-section">
          <header>
            <h3>
              Users Governorates <span>({usersGovernorate.totalUsers})</span>
            </h3>
            <FontAwesomeIcon
              icon={faBars}
              className="show-dashboard-menu"
              id="open-menu"
              onClick={() => showDashboard(dashBoardRef)}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="hide-dashboard-menu"
              id="close-menu"
              style={{ color: "tomato" }}
              onClick={() => hideDashboard(dashBoardRef)}
            />
          </header>
          <div className="graph-container">
            <Bar
              data={usersGovernorateData}
              options={{
                responsive: true,
                backgroundColor: "#3498DB",
                color: "#f1f1f1",
                plugins: {
                  filler: {
                    propagate: true,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="analysis-section">
          <h3>
            Users Gain <span>({usersGain.totalUsersGain})</span>
          </h3>
          <select onChange={usersGainChangeDate}>
            <option value="current-month">Current Month</option>
            <option value="2">Last Two Months</option>
            <option value="5">Last Five Months</option>
            <option value="12">Last Twelve Months</option>
            <option value="24">Last Two Years</option>
          </select>
          <div className="graph-container">
            <Line
              data={usersGainData}
              options={{
                radius: 4,
                hitRadius: 20,
                tension: 0.4,
                responsive: true,
                plugins: {
                  filler: {
                    propagate: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
