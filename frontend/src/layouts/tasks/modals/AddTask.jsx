import React, { useEffect, useState } from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
    Tag,
    Select,
    Spinner,
    useToast,
} from '@chakra-ui/react';

import axios from 'axios';

function AddTaskModal({ isOpen, onClose }) {

    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const [employeesData, setEmployeesData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);

    const [aiPrompt, setAiPrompt] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignTo: '',
        project: '',
        startDate: '',
        priority: 'Most Important',
    });

    // =====================================================
    // API CONFIGURATION - CREATE REACT APP
    // =====================================================

    const token = localStorage.getItem('tm_token');

    const API_URL =
        process.env.REACT_APP_API_URL ||
        'http://localhost:8000';

    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));

    };

    // =====================================================
    // HANDLE PRIORITY
    // =====================================================

    const handleTagClick = (priority) => {

        setFormData((previous) => ({
            ...previous,
            priority,
        }));

    };

    // =====================================================
    // GET EMPLOYEES
    // =====================================================

    const getEmployees = async () => {

        try {

            const response =
                await axiosInstance.get(
                    '/api/employees/dropdown'
                );

            console.log(
                'Employees response:',
                response.data
            );

            if (Array.isArray(response.data)) {

                setEmployeesData(
                    response.data
                );

            } else {

                setEmployeesData([]);

            }

        } catch (error) {

            console.error(
                'Employees error:',
                error
            );

            setEmployeesData([]);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to load employees';

            toast({
                title: errorMessage,
                status: 'error',
                position: 'top',
                duration: 4000,
                isClosable: true,
            });

        }

    };

    // =====================================================
    // GET PROJECTS
    // =====================================================

    const getProjects = async () => {

        try {

            const response =
                await axiosInstance.get(
                    '/api/projects'
                );

            console.log(
                'Projects response:',
                response.data
            );

            if (Array.isArray(response.data)) {

                setProjectsData(
                    response.data
                );

            } else {

                setProjectsData([]);

            }

        } catch (error) {

            console.error(
                'Projects error:',
                error
            );

            setProjectsData([]);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to load projects';

            toast({
                title: errorMessage,
                status: 'error',
                position: 'top',
                duration: 4000,
                isClosable: true,
            });

        }

    };

    // =====================================================
    // LOAD EMPLOYEES + PROJECTS
    // =====================================================

    useEffect(() => {

        if (isOpen) {

            getEmployees();
            getProjects();

        }

    }, [isOpen]);

    // =====================================================
    // AI TASK GENERATION
    // =====================================================

    const handleGenerateWithAI = async () => {

        if (!aiPrompt.trim()) {

            toast({
                title:
                    'Please describe the task first',
                status: 'warning',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });

            return;

        }

        if (aiLoading) {

            return;

        }

        setAiLoading(true);

        try {

            const response =
                await axiosInstance.post(
                    '/api/ai/generate-task',
                    {
                        prompt:
                            aiPrompt.trim(),
                    }
                );

            console.log(
                'AI task response:',
                response.data
            );

            const aiTask =
                response?.data?.result;

            if (!aiTask) {

                throw new Error(
                    'Invalid response from AI'
                );

            }

            setFormData((previous) => ({
                ...previous,

                title:
                    aiTask.title ||
                    previous.title,

                description:
                    aiTask.description ||
                    previous.description,

                priority:
                    aiTask.priority ||
                    previous.priority,
            }));

            toast({
                title:
                    'Task generated successfully',
                status: 'success',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });

        } catch (error) {

            console.error(
                'AI generation error:',
                error
            );

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to generate task with AI';

            toast({
                title: errorMessage,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

        } finally {

            setAiLoading(false);

        }

    };

    // =====================================================
    // ADD TASK
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {

            return;

        }

        if (!formData.assignTo) {

            toast({
                title:
                    'Please select an employee',
                status: 'warning',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });

            return;

        }

        if (!formData.project) {

            toast({
                title:
                    'Please select a project',
                status: 'warning',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });

            return;

        }

        setLoading(true);

        try {

            const response =
                await axiosInstance.post(
                    '/api/task',
                    formData
                );

            console.log(
                'Add task response:',
                response.data
            );

            const message =
                response?.data?.message ||
                'Task added successfully';

            setFormData({
                title: '',
                description: '',
                assignTo: '',
                project: '',
                startDate: '',
                priority:
                    'Most Important',
            });

            setAiPrompt('');

            toast({
                title: message,
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

            onClose();

        } catch (error) {

            console.error(
                'Add task error:',
                error
            );

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to add task';

            toast({
                title: errorMessage,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

        } finally {

            setLoading(false);

        }

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

                <form onSubmit={handleSubmit}>

                    <ModalHeader>
                        Add Task
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>

                        {/* AI GENERATOR */}

                        <div
                            style={{
                                padding: '15px',
                                marginBottom: '15px',
                                borderRadius: '10px',
                                background: '#f7f7f7',
                            }}
                        >

                            <p
                                style={{
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                }}
                            >
                                ✨ Generate Task with AI
                            </p>

                            <Textarea
                                rows={3}
                                placeholder="Example: Prepare for a React interview next week"
                                value={aiPrompt}
                                onChange={(e) =>
                                    setAiPrompt(
                                        e.target.value
                                    )
                                }
                            />

                            <Button
                                mt={3}
                                colorScheme="purple"
                                type="button"
                                onClick={
                                    handleGenerateWithAI
                                }
                                isDisabled={
                                    aiLoading
                                }
                            >

                                {aiLoading ? (

                                    <Spinner
                                        size="sm"
                                    />

                                ) : (

                                    '✨ Generate with AI'

                                )}

                            </Button>

                        </div>

                        {/* TITLE */}

                        <Input
                            mt={3}
                            mb={3}
                            placeholder="Title"
                            type="text"
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />

                        {/* DESCRIPTION */}

                        <Textarea
                            rows={7}
                            mt={3}
                            mb={3}
                            placeholder="Description"
                            required
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                        />

                        {/* EMPLOYEE */}

                        <Select
                            mt={3}
                            mb={3}
                            placeholder={
                                employeesData.length > 0
                                    ? 'Assign To (Employee)'
                                    : 'No employees available'
                            }
                            required
                            name="assignTo"
                            value={
                                formData.assignTo
                            }
                            onChange={handleChange}
                            isDisabled={
                                employeesData.length === 0
                            }
                        >

                            {employeesData.map(
                                (employee) => (

                                    <option
                                        key={
                                            employee.id ||
                                            employee._id
                                        }
                                        value={
                                            employee.id ||
                                            employee._id
                                        }
                                    >

                                        {employee.name}

                                        {employee.role
                                            ? ` (${employee.role})`
                                            : ''}

                                    </option>

                                )
                            )}

                        </Select>

                        {/* PROJECT */}

                        <Select
                            mt={3}
                            mb={3}
                            placeholder={
                                projectsData.length > 0
                                    ? 'Select Project'
                                    : 'No projects available'
                            }
                            required
                            name="project"
                            value={
                                formData.project
                            }
                            onChange={handleChange}
                            isDisabled={
                                projectsData.length === 0
                            }
                        >

                            {projectsData.map(
                                (project) => (

                                    <option
                                        key={
                                            project._id
                                        }
                                        value={
                                            project._id
                                        }
                                    >

                                        {project.title}

                                    </option>

                                )
                            )}

                        </Select>

                        {/* START DATE */}

                        <Input
                            mt={3}
                            mb={3}
                            type="date"
                            required
                            name="startDate"
                            value={
                                formData.startDate
                            }
                            onChange={handleChange}
                        />

                        {/* PRIORITY */}

                        <div
                            className="priority-container"
                        >

                            <p>
                                Priority:
                            </p>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.priority ===
                                    'Most Important'
                                        ? 'red'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleTagClick(
                                        'Most Important'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Most Important
                                </span>
                            </Tag>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.priority ===
                                    'Important'
                                        ? 'yellow'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleTagClick(
                                        'Important'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Important
                                </span>
                            </Tag>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.priority ===
                                    'Least Important'
                                        ? 'green'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleTagClick(
                                        'Least Important'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Least Important
                                </span>
                            </Tag>

                        </div>

                    </ModalBody>

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
                            variant="outline"
                            type="submit"
                            isDisabled={loading}
                        >

                            {loading ? (

                                <Spinner color="green" />

                            ) : (

                                'Add Task'

                            )}

                        </Button>

                    </ModalFooter>

                </form>

            </ModalContent>

        </Modal>

    );

}

export default AddTaskModal;