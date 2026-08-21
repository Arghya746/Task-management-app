
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import axios from 'axios';

import Sidenav from '../../components/sidenav/Sidenav';

import {
    CircularProgress,
    CircularProgressLabel,
    Tag,
    Spinner,
} from '@chakra-ui/react';

import './tasks.css';

import pending from '../../assets/tasks/Pending.png';
import complete from '../../assets/tasks/complete.png';
import book from '../../assets/tasks/Book.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';

import { IoReaderOutline } from 'react-icons/io5';
import { FcStatistics } from 'react-icons/fc';
import { IoMdAdd } from 'react-icons/io';

import {
    FiZap,
    FiClock,
    FiTrendingUp,
} from 'react-icons/fi';

import Navbar from '../../components/navbar/Navbar';

import AddTaskModal from './modals/AddTask';
import ReadTaskModal from './modals/ReadTask';


// =====================================================
// API URL
// =====================================================

const API_URL =
    process.env.REACT_APP_API_URL ||
    'http://localhost:8000';


function Tasks() {

    // =====================================================
    // STATES
    // =====================================================

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
    ] = useState(false);

    const [
        isReadTaskModalOpen,
        setIsReadTaskModalOpen,
    ] = useState(false);

    const [
        selectedTaskId,
        setSelectedTaskId,
    ] = useState(null);


    // =====================================================
    // FETCH TASKS
    // =====================================================

    const fetchTasks = useCallback(async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem(
                    'tm_token'
                );


            const response =
                await axios.get(
                    `${API_URL}/api/tasks`,
                    {
                        headers: token
                            ? {
                                Authorization:
                                    `Bearer ${token}`,
                            }
                            : {},
                    }
                );


            console.log(
                'Tasks response:',
                response.data
            );


            if (
                Array.isArray(
                    response.data
                )
            ) {

                setTasks(
                    response.data
                );

            } else {

                setTasks([]);

            }

        } catch (error) {

            console.error(
                'Fetch tasks error:',
                error
            );

            setTasks([]);

        } finally {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // LOAD TASKS WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        fetchTasks();

    }, [
        fetchTasks,
    ]);


    // =====================================================
    // ADD TASK MODAL
    // =====================================================

    const openAddTaskModal = () => {

        setIsAddTaskModalOpen(true);

    };


    const closeAddTaskModal = () => {

        setIsAddTaskModalOpen(false);

        fetchTasks();

    };


    // =====================================================
    // OPEN READ TASK MODAL
    // =====================================================

    const openReadTaskModal = (
        taskId
    ) => {

        console.log(
            'Selected Task ID:',
            taskId
        );

        setSelectedTaskId(
            taskId
        );

        setIsReadTaskModalOpen(
            true
        );

    };


    // =====================================================
    // CLOSE READ TASK MODAL
    // =====================================================

    const closeReadTaskModal = () => {

        setIsReadTaskModalOpen(
            false
        );

        setSelectedTaskId(null);

    };


    // =====================================================
    // AFTER TASK DELETE
    // =====================================================

    const handleTaskDeleted = (
        deletedTaskId
    ) => {

        console.log(
            'Deleted Task ID:',
            deletedTaskId
        );


        setTasks(
            (previousTasks) =>
                previousTasks.filter(
                    (task) =>
                        task._id !==
                        deletedTaskId
                )
        );


        setSelectedTaskId(null);

    };


    // =====================================================
    // TASK STATISTICS
    // =====================================================

    const statistics = useMemo(() => {

        const total =
            tasks.length;


        const completed =
            tasks.filter(
                (task) =>
                    task.status ===
                    'Completed'
            ).length;


        const inProgress =
            tasks.filter(
                (task) =>
                    task.status ===
                    'In Progress'
            ).length;


        const pendingTasks =
            tasks.filter(
                (task) =>
                    task.status ===
                    'Pending'
            ).length;


        return {

            total,

            completed,

            inProgress,

            pending:
                pendingTasks,

        };

    }, [
        tasks,
    ]);


    // =====================================================
    // PERCENTAGES
    // =====================================================

    const completedPercentage =
        statistics.total > 0
            ? Math.round(
                (
                    statistics.completed /
                    statistics.total
                ) * 100
            )
            : 0;


    const progressPercentage =
        statistics.total > 0
            ? Math.round(
                (
                    statistics.inProgress /
                    statistics.total
                ) * 100
            )
            : 0;


    const pendingPercentage =
        statistics.total > 0
            ? Math.round(
                (
                    statistics.pending /
                    statistics.total
                ) * 100
            )
            : 0;


    // =====================================================
    // PRIORITY COLOR
    // =====================================================

    const getPriorityColor = (
        priority
    ) => {

        switch (priority) {

            case 'Most Important':
                return 'red';

            case 'Important':
                return 'yellow';

            case 'Least Important':
                return 'green';

            default:
                return 'gray';

        }

    };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (
        date
    ) => {

        if (!date) {

            return 'Date unavailable';

        }


        return new Date(
            date
        ).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }
        );

    };


    // =====================================================
    // TASK FILTERS
    // =====================================================

    const pendingTasks =
        tasks.filter(
            (task) =>
                task.status ===
                'Pending'
        );


    const inProgressTasks =
        tasks.filter(
            (task) =>
                task.status ===
                'In Progress'
        );


    const completedTasks =
        tasks.filter(
            (task) =>
                task.status ===
                'Completed'
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>

            {/* ================================================= */}
            {/* ADD TASK MODAL */}
            {/* ================================================= */}

            <AddTaskModal
                isOpen={
                    isAddTaskModalOpen
                }
                onClose={
                    closeAddTaskModal
                }
            />


            {/* ================================================= */}
            {/* READ TASK MODAL */}
            {/* ================================================= */}

            <ReadTaskModal
                isOpen={
                    isReadTaskModalOpen
                }
                onClose={
                    closeReadTaskModal
                }
                taskId={
                    selectedTaskId
                }
                onTaskDeleted={
                    handleTaskDeleted
                }
            />


            {/* ================================================= */}
            {/* MAIN CONTAINER */}
            {/* ================================================= */}

            <div className="app-main-container">


                {/* ================================================= */}
                {/* SIDE NAV */}
                {/* ================================================= */}

                <div className="app-main-left-container">

                    <Sidenav />

                </div>


                {/* ================================================= */}
                {/* RIGHT CONTAINER */}
                {/* ================================================= */}

                <div className="app-main-right-container">

                    <Navbar />


                    <div className="dashboard-main-container">


                        {/* ================================================= */}
                        {/* LEFT SIDE */}
                        {/* ================================================= */}

                        <div className="dashboard-main-left-container">


                            {/* ================================================= */}
                            {/* TASK STATISTICS */}
                            {/* ================================================= */}

                            <div className="task-status-card-container">

                                <div className="add-task-inner-div">

                                    <FcStatistics
                                        className="task-stats"
                                    />

                                    <p className="todo-text">
                                        Tasks Statistics
                                    </p>

                                </div>


                                {/* FIRST ROW */}

                                <div className="stat-first-row">


                                    {/* TOTAL */}

                                    <div className="stats-container container-bg1">

                                        <img
                                            className="stats-icon"
                                            src={totaltasks}
                                            alt="Total tasks"
                                        />

                                        <div>

                                            <p className="stats-num">
                                                {
                                                    statistics.total
                                                }
                                            </p>

                                            <p className="stats-text">
                                                Total Tasks
                                            </p>

                                        </div>

                                    </div>


                                    {/* COMPLETED */}

                                    <div className="stats-container container-bg4">

                                        <img
                                            className="stats-icon"
                                            src={totalcomplete}
                                            alt="Completed tasks"
                                        />

                                        <div>

                                            <p className="stats-num">
                                                {
                                                    statistics.completed
                                                }
                                            </p>

                                            <p className="stats-text">
                                                Completed
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* SECOND ROW */}

                                <div className="stat-second-row">


                                    {/* IN PROGRESS */}

                                    <div className="stats-container container-bg2">

                                        <img
                                            className="stats-icon"
                                            src={totalprogress}
                                            alt="In progress tasks"
                                        />

                                        <div>

                                            <p className="stats-num">
                                                {
                                                    statistics.inProgress
                                                }
                                            </p>

                                            <p className="stats-text">
                                                In Progress
                                            </p>

                                        </div>

                                    </div>


                                    {/* PENDING */}

                                    <div className="stats-container container-bg3">

                                        <img
                                            className="stats-icon"
                                            src={totalpending}
                                            alt="Pending tasks"
                                        />

                                        <div>

                                            <p className="stats-num">
                                                {
                                                    statistics.pending
                                                }
                                            </p>

                                            <p className="stats-text">
                                                Pending
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* AI TASK INSIGHTS */}
                            {/* ================================================= */}

                            <div className="add-task-main-container">

                                <div className="add-task-main-div">

                                    <div className="add-task-inner-div">

                                        <FiZap
                                            className="task-stats"
                                            style={{
                                                color:
                                                    '#7c3aed',
                                                fontSize:
                                                    '24px',
                                            }}
                                        />

                                        <p className="todo-text">
                                            AI Task Insights
                                        </p>

                                    </div>

                                </div>


                                <div className="task-card-container">

                                    <p className="task-title">
                                        ✨ Productivity Recommendation
                                    </p>


                                    <div className="task-desc-container">

                                        <p className="task-desc">

                                            {
                                                statistics.pending >
                                                0

                                                    ? `You currently have ${statistics.pending} pending task${statistics.pending > 1 ? 's' : ''}. AI recommends completing high-priority tasks first.`

                                                    : 'Great! You currently have no pending tasks.'
                                            }

                                        </p>

                                    </div>


                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            gap:
                                                '10px',
                                            flexWrap:
                                                'wrap',
                                            marginTop:
                                                '12px',
                                        }}
                                    >

                                        <Tag
                                            size="lg"
                                            colorScheme="purple"
                                            borderRadius="full"
                                        >
                                            AI Recommendation
                                        </Tag>


                                        <Tag
                                            size="lg"
                                            colorScheme="orange"
                                            borderRadius="full"
                                        >
                                            {
                                                statistics.pending
                                            } Pending
                                        </Tag>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* TODO TASKS */}
                            {/* ================================================= */}

                            <div className="add-task-main-container">


                                {/* HEADER */}

                                <div className="add-task-main-div">

                                    <div className="add-task-inner-div">

                                        <img
                                            src={pending}
                                            alt="Pending tasks"
                                        />

                                        <p className="todo-text">
                                            To-Do Tasks
                                        </p>

                                    </div>


                                    <button
                                        className="table-btn-task"
                                        onClick={
                                            openAddTaskModal
                                        }
                                    >

                                        <IoMdAdd />

                                        Add Task

                                    </button>

                                </div>


                                {/* LOADING */}

                                {loading ? (

                                    <div
                                        style={{
                                            padding:
                                                '40px',
                                            textAlign:
                                                'center',
                                        }}
                                    >

                                        <Spinner
                                            size="xl"
                                            color="blue.500"
                                        />

                                    </div>

                                ) : pendingTasks.length === 0 ? (

                                    <div
                                        style={{
                                            padding:
                                                '30px',
                                            textAlign:
                                                'center',
                                            color:
                                                '#777',
                                        }}
                                    >

                                        No pending tasks.

                                    </div>

                                ) : (

                                    pendingTasks.map(
                                        (task) => (

                                            <div
                                                className="task-card-container"
                                                key={
                                                    task._id
                                                }
                                            >

                                                <p className="task-title">
                                                    {
                                                        task.title
                                                    }
                                                </p>


                                                <div className="task-desc-container">

                                                    <p className="task-desc">
                                                        {
                                                            task.description
                                                        }
                                                    </p>

                                                </div>


                                                <div className="task-card-footer-container">


                                                    <Tag
                                                        size="lg"
                                                        colorScheme={
                                                            getPriorityColor(
                                                                task.priority
                                                            )
                                                        }
                                                        borderRadius="full"
                                                    >

                                                        {
                                                            task.priority
                                                        }

                                                    </Tag>


                                                    <div
                                                        className="task-read"
                                                        onClick={() =>
                                                            openReadTaskModal(
                                                                task._id
                                                            )
                                                        }
                                                        style={{
                                                            cursor:
                                                                'pointer',
                                                        }}
                                                    >

                                                        <IoReaderOutline
                                                            className="read-icon"
                                                        />

                                                    </div>

                                                </div>


                                                <p className="created">

                                                    Created on:{' '}

                                                    {
                                                        formatDate(
                                                            task.createdAt
                                                        )
                                                    }

                                                </p>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* RIGHT SIDE */}
                        {/* ================================================= */}

                        <div className="dashboard-main-right-container">


                            {/* ================================================= */}
                            {/* TASK STATUS */}
                            {/* ================================================= */}

                            <div className="task-status-card-container">


                                <div className="add-task-inner-div">

                                    <img
                                        src={complete}
                                        alt="Task status"
                                    />

                                    <p className="todo-text">
                                        Tasks Status
                                    </p>

                                </div>


                                <div className="task-status-progress-main-container">


                                    {/* COMPLETED */}

                                    <div>

                                        <CircularProgress
                                            value={
                                                completedPercentage
                                            }
                                            color="#05A301"
                                            size="100px"
                                        >

                                            <CircularProgressLabel>

                                                {
                                                    completedPercentage
                                                }%

                                            </CircularProgressLabel>

                                        </CircularProgress>


                                        <p className="completed">
                                            Completed
                                        </p>

                                    </div>


                                    {/* IN PROGRESS */}

                                    <div>

                                        <CircularProgress
                                            value={
                                                progressPercentage
                                            }
                                            color="#0225FF"
                                            size="100px"
                                        >

                                            <CircularProgressLabel>

                                                {
                                                    progressPercentage
                                                }%

                                            </CircularProgressLabel>

                                        </CircularProgress>


                                        <p className="progress">
                                            In Progress
                                        </p>

                                    </div>


                                    {/* PENDING */}

                                    <div>

                                        <CircularProgress
                                            value={
                                                pendingPercentage
                                            }
                                            color="#F21E1E"
                                            size="100px"
                                        >

                                            <CircularProgressLabel>

                                                {
                                                    pendingPercentage
                                                }%

                                            </CircularProgressLabel>

                                        </CircularProgress>


                                        <p className="pending">
                                            Pending
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* IN PROGRESS TASKS */}
                            {/* ================================================= */}

                            <div className="add-task-main-container">


                                <div className="add-task-main-div">

                                    <div className="add-task-inner-div">

                                        <img
                                            src={book}
                                            alt="In progress tasks"
                                        />

                                        <p className="todo-text">
                                            In Progress Tasks
                                        </p>

                                    </div>

                                </div>


                                {
                                    inProgressTasks.length === 0 ? (

                                        <div
                                            style={{
                                                padding:
                                                    '30px',
                                                textAlign:
                                                    'center',
                                                color:
                                                    '#777',
                                            }}
                                        >

                                            No tasks in progress.

                                        </div>

                                    ) : (

                                        inProgressTasks.map(
                                            (task) => (

                                                <div
                                                    className="task-card-container"
                                                    key={
                                                        task._id
                                                    }
                                                >

                                                    <p className="task-title">

                                                        {
                                                            task.title
                                                        }

                                                    </p>


                                                    <div className="task-desc-container">

                                                        <p className="task-desc">

                                                            {
                                                                task.description
                                                            }

                                                        </p>

                                                    </div>


                                                    <div className="task-card-footer-container">


                                                        <Tag
                                                            size="lg"
                                                            colorScheme="blue"
                                                            borderRadius="full"
                                                        >

                                                            In Progress

                                                        </Tag>


                                                        <div
                                                            className="task-read"
                                                            onClick={() =>
                                                                openReadTaskModal(
                                                                    task._id
                                                                )
                                                            }
                                                            style={{
                                                                cursor:
                                                                    'pointer',
                                                            }}
                                                        >

                                                            <IoReaderOutline
                                                                className="read-icon"
                                                            />

                                                        </div>


                                                        <CircularProgress
                                                            value={
                                                                task.progress ||
                                                                0
                                                            }
                                                            color="#0225FF"
                                                        >

                                                            <CircularProgressLabel>

                                                                {
                                                                    task.progress ||
                                                                    0
                                                                }%

                                                            </CircularProgressLabel>

                                                        </CircularProgress>

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )
                                }

                            </div>


                            {/* ================================================= */}
                            {/* COMPLETED TASKS */}
                            {/* ================================================= */}

                            <div className="add-task-main-container">


                                <div className="add-task-main-div">

                                    <div className="add-task-inner-div">

                                        <img
                                            src={complete}
                                            alt="Completed tasks"
                                        />

                                        <p className="todo-text">
                                            Completed Tasks
                                        </p>

                                    </div>

                                </div>


                                {
                                    completedTasks.length === 0 ? (

                                        <div
                                            style={{
                                                padding:
                                                    '30px',
                                                textAlign:
                                                    'center',
                                                color:
                                                    '#777',
                                            }}
                                        >

                                            No completed tasks.

                                        </div>

                                    ) : (

                                        completedTasks.map(
                                            (task) => (

                                                <div
                                                    className="task-card-container"
                                                    key={
                                                        task._id
                                                    }
                                                >

                                                    <p className="task-title">

                                                        {
                                                            task.title
                                                        }

                                                    </p>


                                                    <div className="task-desc-container">

                                                        <p className="task-desc">

                                                            {
                                                                task.description
                                                            }

                                                        </p>

                                                    </div>


                                                    <div className="task-card-footer-container">


                                                        <Tag
                                                            size="lg"
                                                            colorScheme="green"
                                                            borderRadius="full"
                                                        >

                                                            Completed

                                                        </Tag>


                                                        <div
                                                            className="task-read"
                                                            onClick={() =>
                                                                openReadTaskModal(
                                                                    task._id
                                                                )
                                                            }
                                                            style={{
                                                                cursor:
                                                                    'pointer',
                                                            }}
                                                        >

                                                            <IoReaderOutline
                                                                className="read-icon"
                                                            />

                                                        </div>

                                                    </div>


                                                    <p className="created">

                                                        Created on:{' '}

                                                        {
                                                            formatDate(
                                                                task.createdAt
                                                            )
                                                        }

                                                    </p>

                                                </div>

                                            )
                                        )

                                    )
                                }

                            </div>


                            {/* ================================================= */}
                            {/* QUICK INSIGHTS */}
                            {/* ================================================= */}

                            <div className="task-status-card-container">


                                <div className="add-task-inner-div">

                                    <FiTrendingUp
                                        className="task-stats"
                                        style={{
                                            color:
                                                '#05A301',
                                            fontSize:
                                                '24px',
                                        }}
                                    />

                                    <p className="todo-text">
                                        Quick Insights
                                    </p>

                                </div>


                                <div
                                    style={{
                                        display:
                                            'flex',
                                        flexDirection:
                                            'column',
                                        gap:
                                            '15px',
                                        marginTop:
                                            '20px',
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            gap:
                                                '12px',
                                        }}
                                    >

                                        <FiClock
                                            style={{
                                                fontSize:
                                                    '22px',
                                                color:
                                                    '#0225FF',
                                            }}
                                        />

                                        <p>

                                            <strong>
                                                {
                                                    statistics.inProgress
                                                }
                                            </strong>{' '}

                                            task
                                            {
                                                statistics.inProgress !==
                                                1
                                                    ? 's'
                                                    : ''
                                            }{' '}

                                            are currently
                                            in progress.

                                        </p>

                                    </div>


                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            gap:
                                                '12px',
                                        }}
                                    >

                                        <FiZap
                                            style={{
                                                fontSize:
                                                    '22px',
                                                color:
                                                    '#7c3aed',
                                            }}
                                        />

                                        <p>

                                            AI recommends focusing on
                                            high-priority tasks first.

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );

}

export default Tasks;