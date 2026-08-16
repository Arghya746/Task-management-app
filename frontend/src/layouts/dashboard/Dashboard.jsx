import React from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./dashboard.css"
import welcome from '../../assets/dashboard/welcome.png';
import complete from '../../assets/tasks/complete.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { FcStatistics } from "react-icons/fc";
import Navbar from '../../components/navbar/Navbar';

function Dashboard() {

  return (
    <>
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='welcome-main-container'>
            <div className='welcome-left-container'>
              <p className='mng-text'>Welcome To</p>
              <p className='mng-text'>Task Management Area</p>
              <p className='mng-para'>
                In this task management hub, the system seamlessly orchestrates task creation, assignment, and tracking, ensuring projects move forward smoothly and collaboratively.
              </p>
            </div>
            <div className='welcome-right-container'>
              <img className='welcome-img' src={welcome} alt="welcome" />
            </div>
          </div>

          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>

              {/* Employees */}
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Employees Statistics</p>
                </div>

                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Total Employees</p>
                    </div>
                  </div>

                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Active Employees</p>
                    </div>
                  </div>
                </div>

                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalpending} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Inactive Employees</p>
                    </div>
                  </div>

                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalprogress} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Terminated Employees</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>

                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Total Projects</p>
                    </div>
                  </div>

                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>

                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>

                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Tasks Statistics</p>
                </div>

                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Total Tasks</p>
                    </div>
                  </div>

                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>

                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>

                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className='dashboard-main-right-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="" />
                  <p className='todo-text'>Employees Status</p>
                </div>

                <div className='task-status-progress-main-container'>
                  <CircularProgress value={80}><CircularProgressLabel>80%</CircularProgressLabel></CircularProgress>
                  <CircularProgress value={60}><CircularProgressLabel>60%</CircularProgressLabel></CircularProgress>
                  <CircularProgress value={20}><CircularProgressLabel>20%</CircularProgressLabel></CircularProgress>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard