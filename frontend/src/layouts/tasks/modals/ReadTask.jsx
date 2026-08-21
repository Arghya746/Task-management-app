import React, {
    useCallback,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Tag,
    CircularProgress,
    CircularProgressLabel,
    Spinner,
    useToast,
} from '@chakra-ui/react';

import {
    MdDelete,
    MdAutoAwesome,
    MdPerson,
    MdWork,
} from 'react-icons/md';

import {
    FiClock,
    FiTrendingUp,
    FiCalendar,
} from 'react-icons/fi';


function ReadTaskModal({
    isOpen,
    onClose,
    taskId,
    onTaskDeleted,
}) {

    const toast = useToast();

    // =====================================================
    // STATES
    // =====================================================

    const [task, setTask] = useState(null);

    const [loading, setLoading] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    // =====================================================
    // API CONFIGURATION - CREATE REACT APP
    // =====================================================

    const API_URL =
        process.env.REACT_APP_API_URL ||
        'http://localhost:8000';


    // =====================================================
    // GET SINGLE TASK
    // =====================================================

    const getTask = useCallback(
        async () => {

            if (!taskId) {

                console.log(
                    'No task ID received'
                );

                setTask(null);

                return;

            }

            try {

                setLoading(true);

                console.log(
                    'Fetching task:',
                    taskId
                );

                const token =
                    localStorage.getItem(
                        'tm_token'
                    );

                const response =
                    await axios.get(
                        `${API_URL}/api/task/${taskId}`,
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
                    'Selected task:',
                    response.data
                );

                setTask(
                    response.data
                );

            } catch (error) {

                console.error(
                    'Get task error:',
                    error
                );

                setTask(null);

                const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Failed to load task';

                toast({
                    title: errorMessage,
                    status: 'error',
                    position: 'top',
                    duration: 4000,
                    isClosable: true,
                });

            } finally {

                setLoading(false);

            }

        },
        [
            API_URL,
            taskId,
            toast,
        ]
    );


    // =====================================================
    // LOAD TASK WHEN MODAL OPENS
    // =====================================================

    useEffect(() => {

        if (
            isOpen &&
            taskId
        ) {

            getTask();

        }

        if (!isOpen) {

            setTask(null);

        }

    }, [
        isOpen,
        taskId,
        getTask,
    ]);


    // =====================================================
    // DELETE TASK
    // =====================================================

    const handleDeleteTask = async () => {

        if (
            !taskId ||
            deleteLoading
        ) {

            return;

        }

        const confirmDelete =
            window.confirm(
                'Are you sure you want to delete this task?'
            );

        if (!confirmDelete) {

            return;

        }

        try {

            setDeleteLoading(true);

            const token =
                localStorage.getItem(
                    'tm_token'
                );

            const response =
                await axios.delete(
                    `${API_URL}/api/task/${taskId}`,
                    {
                        headers: token
                            ? {
                                Authorization:
                                    `Bearer ${token}`,
                            }
                            : {},
                    }
                );

            toast({
                title:
                    response?.data?.message ||
                    'Task deleted successfully',

                status: 'success',

                position: 'top',

                duration: 4000,

                isClosable: true,
            });

            setTask(null);

            if (onTaskDeleted) {

                onTaskDeleted(
                    taskId
                );

            }

            onClose();

        } catch (error) {

            console.error(
                'Delete task error:',
                error
            );

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete task';

            toast({
                title: errorMessage,

                status: 'error',

                position: 'top',

                duration: 4000,

                isClosable: true,
            });

        } finally {

            setDeleteLoading(false);

        }

    };


    // =====================================================
    // DATE FORMATTER
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return 'Not available';

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
    // STATUS COLOR
    // =====================================================

    const getStatusColor = (status) => {

        switch (status) {

            case 'Completed':
                return 'green';

            case 'In Progress':
                return 'blue';

            case 'Testing':
                return 'yellow';

            case 'Pending':
                return 'orange';

            default:
                return 'gray';

        }

    };


    // =====================================================
    // PRIORITY COLOR
    // =====================================================

    const getPriorityColor = (priority) => {

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
    // EMPLOYEE NAME
    // =====================================================

    const getEmployeeName = () => {

        if (!task?.assignTo) {

            return 'Not assigned';

        }

        if (task.assignTo.name) {

            return task.assignTo.name;

        }

        const firstName =
            task.assignTo.firstName || '';

        const lastName =
            task.assignTo.lastName || '';

        const fullName =
            `${firstName} ${lastName}`.trim();

        if (fullName) {

            return fullName;

        }

        return 'Not assigned';

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            closeOnOverlayClick={false}
            isCentered
        >

            <ModalOverlay />

            <ModalContent>

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <ModalHeader>
                    Task Details
                </ModalHeader>

                <ModalCloseButton />


                {/* ================================================= */}
                {/* BODY */}
                {/* ================================================= */}

                <ModalBody>

                    {/* LOADING */}

                    {loading ? (

                        <div
                            style={{
                                minHeight: '350px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >

                            <Spinner
                                size="xl"
                                color="blue.500"
                            />

                        </div>

                    ) : !task ? (

                        <div
                            style={{
                                minHeight: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                color: '#666',
                            }}
                        >

                            <p
                                style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    marginBottom: '8px',
                                }}
                            >
                                Task not found
                            </p>

                            <p
                                style={{
                                    fontSize: '14px',
                                }}
                            >
                                This task may have been deleted
                                or the task ID is invalid.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* ================================================= */}
                            {/* MAIN TASK CARD */}
                            {/* ================================================= */}

                            <div
                                style={{
                                    padding: '24px',
                                    borderRadius: '18px',
                                    background:
                                        'linear-gradient(135deg, #f8fbff, #ffffff)',
                                    border:
                                        '1px solid #e5e7eb',
                                    boxShadow:
                                        '0 8px 25px rgba(0,0,0,0.06)',
                                }}
                            >

                                {/* TITLE */}

                                <p
                                    style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#111827',
                                        marginBottom: '14px',
                                    }}
                                >
                                    {task.title}
                                </p>


                                {/* DESCRIPTION */}

                                <div
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: '#f9fafb',
                                        marginBottom: '18px',
                                    }}
                                >

                                    <p
                                        style={{
                                            color: '#4b5563',
                                            lineHeight: '1.7',
                                        }}
                                    >
                                        {task.description}
                                    </p>

                                </div>


                                {/* PRIORITY + STATUS */}

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        flexWrap: 'wrap',
                                    }}
                                >

                                    <Tag
                                        size="lg"
                                        colorScheme={
                                            getPriorityColor(
                                                task.priority
                                            )
                                        }
                                        borderRadius="full"
                                    >
                                        {task.priority}
                                    </Tag>


                                    <Tag
                                        size="lg"
                                        colorScheme={
                                            getStatusColor(
                                                task.status
                                            )
                                        }
                                        borderRadius="full"
                                    >
                                        {task.status}
                                    </Tag>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* PROGRESS */}
                            {/* ================================================= */}

                            <div
                                style={{
                                    marginTop: '20px',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    background: '#f8fafc',
                                    border:
                                        '1px solid #e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                }}
                            >

                                <CircularProgress
                                    value={
                                        task.progress || 0
                                    }
                                    color="blue.500"
                                    size="90px"
                                    thickness="8px"
                                >

                                    <CircularProgressLabel>
                                        {task.progress || 0}%
                                    </CircularProgressLabel>

                                </CircularProgress>


                                <div>

                                    <p
                                        style={{
                                            fontWeight: '700',
                                            fontSize: '17px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        Task Progress
                                    </p>

                                    <p
                                        style={{
                                            color: '#6b7280',
                                            fontSize: '14px',
                                        }}
                                    >
                                        This task is currently{' '}
                                        {task.progress || 0}%
                                        {' '}completed.
                                    </p>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* EMPLOYEE + PROJECT */}
                            {/* ================================================= */}

                            <div
                                style={{
                                    marginTop: '20px',
                                    display: 'grid',
                                    gridTemplateColumns:
                                        '1fr 1fr',
                                    gap: '15px',
                                }}
                            >

                                {/* EMPLOYEE */}

                                <div
                                    style={{
                                        padding: '18px',
                                        borderRadius: '16px',
                                        background: '#eff6ff',
                                        border:
                                            '1px solid #dbeafe',
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '8px',
                                        }}
                                    >

                                        <MdPerson
                                            style={{
                                                color: '#2563eb',
                                                fontSize: '22px',
                                            }}
                                        />

                                        <strong>
                                            Assigned Employee
                                        </strong>

                                    </div>


                                    <p
                                        style={{
                                            color: '#374151',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {getEmployeeName()}
                                    </p>


                                    {task.assignTo?.role && (

                                        <p
                                            style={{
                                                fontSize: '13px',
                                                color: '#6b7280',
                                                marginTop: '4px',
                                            }}
                                        >
                                            {task.assignTo.role}
                                        </p>

                                    )}

                                </div>


                                {/* PROJECT */}

                                <div
                                    style={{
                                        padding: '18px',
                                        borderRadius: '16px',
                                        background: '#f5f3ff',
                                        border:
                                            '1px solid #ddd6fe',
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '8px',
                                        }}
                                    >

                                        <MdWork
                                            style={{
                                                color: '#7c3aed',
                                                fontSize: '22px',
                                            }}
                                        />

                                        <strong>
                                            Project
                                        </strong>

                                    </div>


                                    <p
                                        style={{
                                            color: '#374151',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {task.project?.title ||
                                            'No project'}
                                    </p>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* TASK INFORMATION */}
                            {/* ================================================= */}

                            <div
                                style={{
                                    marginTop: '20px',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    background: '#ffffff',
                                    border:
                                        '1px solid #e5e7eb',
                                }}
                            >

                                <p
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        marginBottom: '15px',
                                    }}
                                >
                                    Task Information
                                </p>


                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '14px',
                                    }}
                                >

                                    {/* CREATED */}

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >

                                        <FiClock
                                            style={{
                                                color: '#2563eb',
                                                fontSize: '20px',
                                            }}
                                        />

                                        <p>
                                            <strong>
                                                Created:
                                            </strong>{' '}
                                            {formatDate(
                                                task.createdAt
                                            )}
                                        </p>

                                    </div>


                                    {/* START DATE */}

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >

                                        <FiCalendar
                                            style={{
                                                color: '#7c3aed',
                                                fontSize: '20px',
                                            }}
                                        />

                                        <p>
                                            <strong>
                                                Start Date:
                                            </strong>{' '}
                                            {formatDate(
                                                task.startDate
                                            )}
                                        </p>

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >

                                        <FiTrendingUp
                                            style={{
                                                color: '#16a34a',
                                                fontSize: '20px',
                                            }}
                                        />

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{' '}
                                            {task.status}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* AI SUMMARY */}
                            {/* ================================================= */}

                            <div
                                style={{
                                    marginTop: '20px',
                                    padding: '18px',
                                    borderRadius: '16px',
                                    background:
                                        'linear-gradient(135deg, #f5f3ff, #faf5ff)',
                                    border:
                                        '1px solid #ddd6fe',
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '10px',
                                    }}
                                >

                                    <MdAutoAwesome
                                        style={{
                                            color: '#7c3aed',
                                            fontSize: '22px',
                                        }}
                                    />

                                    <p
                                        style={{
                                            fontWeight: '700',
                                            color: '#6d28d9',
                                        }}
                                    >
                                        Task Summary
                                    </p>

                                </div>


                                <p
                                    style={{
                                        color: '#555',
                                        lineHeight: '1.6',
                                        fontSize: '14px',
                                    }}
                                >
                                    {task.description}
                                </p>

                            </div>

                        </>

                    )}

                </ModalBody>


                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <ModalFooter>

                    <Button
                        variant="solid"
                        color="white"
                        bg="darkcyan"
                        mr={3}
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </Button>


                    <Button
                        colorScheme="red"
                        variant="outline"
                        type="button"
                        onClick={
                            handleDeleteTask
                        }
                        isDisabled={
                            loading ||
                            !task ||
                            deleteLoading
                        }
                    >

                        {deleteLoading ? (

                            <Spinner
                                size="sm"
                            />

                        ) : (

                            <>

                                <MdDelete
                                    style={{
                                        marginRight: '6px',
                                        fontSize: '18px',
                                    }}
                                />

                                Delete Task

                            </>

                        )}

                    </Button>

                </ModalFooter>

            </ModalContent>

        </Modal>

    );

}


export default ReadTaskModal;