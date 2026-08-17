import React, { useState, useEffect } from 'react';
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

    // AI prompt
    const [aiPrompt, setAiPrompt] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignTo: '',
        project: '',
        startDate: '',
        priority: 'Most Important',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTagClick = (priority) => {
        setFormData({
            ...formData,
            priority,
        });
    };

    const token = localStorage.getItem('tm_token');

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const getEmployees = async () => {
        try {
            const response = await axios.get('/api/employees');
            setEmployeesData(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const getProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjectsData(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        getEmployees();
        getProjects();
    }, []);

    // =========================
    // AI TASK GENERATION
    // =========================
    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim()) {
            toast({
                title: 'Please describe the task first',
                status: 'warning',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });

            return;
        }

        setAiLoading(true);

        try {
            const response = await axiosInstance.post(
                '/api/ai/generate-task',
                {
                    prompt: aiPrompt,
                }
            );

            const aiTask = response.data.result;

            setFormData((prevData) => ({
                ...prevData,
                title: aiTask.title || prevData.title,
                description:
                    aiTask.description || prevData.description,
                priority:
                    aiTask.priority || prevData.priority,
            }));

            toast({
                title: 'Task generated successfully',
                status: 'success',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('AI generation error:', error);

            toast({
                title:
                    error.response?.data?.message ||
                    'Failed to generate task with AI',
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setAiLoading(false);
        }
    };

    // =========================
    // NORMAL TASK SUBMISSION
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axiosInstance.post(
                '/api/task',
                formData
            );

            setFormData({
                title: '',
                description: '',
                assignTo: '',
                project: '',
                startDate: '',
                priority: 'Most Important',
            });

            setAiPrompt('');

            toast({
                title: response.data.message,
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

            setLoading(false);
            onClose();
        } catch (error) {
            toast({
                title:
                    error.response?.data?.message ||
                    'Failed to add task',
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

            setLoading(false);
        }
    };

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

                    <ModalHeader>Add Task</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>

                        {/* AI TASK GENERATOR */}
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
                                    setAiPrompt(e.target.value)
                                }
                            />

                            <Button
                                mt={3}
                                colorScheme="purple"
                                type="button"
                                onClick={handleGenerateWithAI}
                                isDisabled={aiLoading}
                            >
                                {aiLoading ? (
                                    <Spinner size="sm" />
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
                            value={formData.description}
                            onChange={handleChange}
                        />

                        {/* EMPLOYEE */}
                        <Select
                            mt={3}
                            mb={3}
                            placeholder="Assign To (Employee)"
                            required
                            name="assignTo"
                            value={formData.assignTo}
                            onChange={handleChange}
                        >
                            {employeesData.map((employee) => (
                                <option
                                    key={employee._id}
                                    value={employee._id}
                                >
                                    {employee.firstName}{' '}
                                    {employee.lastName}
                                </option>
                            ))}
                        </Select>

                        {/* PROJECT */}
                        <Select
                            mt={3}
                            mb={3}
                            placeholder="Project"
                            required
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                        >
                            {projectsData.map((project) => (
                                <option
                                    key={project._id}
                                    value={project._id}
                                >
                                    {project.title}
                                </option>
                            ))}
                        </Select>

                        {/* START DATE */}
                        <Input
                            mt={3}
                            mb={3}
                            placeholder="Start Date"
                            type="date"
                            required
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                        />

                        {/* PRIORITY */}
                        <div className="priority-container">

                            <p>Priority:</p>

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
                                    handleTagClick('Most Important')
                                }
                            >
                                <p className="tag-text">
                                    Most Important
                                </p>
                            </Tag>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.priority === 'Important'
                                        ? 'yellow'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleTagClick('Important')
                                }
                            >
                                <p className="tag-text">
                                    Important
                                </p>
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
                                <p className="tag-text">
                                    Least Important
                                </p>
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