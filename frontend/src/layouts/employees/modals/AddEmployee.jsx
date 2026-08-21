import React, { useState } from 'react';

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
    Tag,
    useToast,
    Spinner,
} from '@chakra-ui/react';

import axios from 'axios';

function AddEmployeeModal({ isOpen, onClose }) {
    const toast = useToast();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        employee_id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        residentialAddress: '',
        cnic: '',
        role: '',
        dateOfBirth: '',
        startDate: '',
        status: 'Active',
        gender: 'Male',
    });

    const token =
        localStorage.getItem('tm_token');

    const axiosInstance = axios.create({
        baseURL:
            process.env.REACT_APP_API_URL ||
            'http://localhost:8000',

        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleStatusClick = (status) => {
        setFormData((previous) => ({
            ...previous,
            status,
        }));
    };

    const handleGenderClick = (gender) => {
        setFormData((previous) => ({
            ...previous,
            gender,
        }));
    };

    const resetForm = () => {
        setFormData({
            employee_id: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            residentialAddress: '',
            cnic: '',
            role: '',
            dateOfBirth: '',
            startDate: '',
            status: 'Active',
            gender: 'Male',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const response =
                await axiosInstance.post(
                    '/api/employee',
                    formData
                );

            console.log(
                'Employee response:',
                response.data
            );

            const message =
                response?.data?.message ||
                'Employee added successfully';

            toast({
                title: message,
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

            resetForm();

            onClose();
        } catch (error) {
            console.error(
                'Employee error:',
                error
            );

            let errorMessage =
                'Failed to add employee';

            if (
                error?.response?.data?.message
            ) {
                errorMessage =
                    error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

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
                        Add Employee
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>

                        <Input
                            mt={3}
                            mb={3}
                            type="text"
                            required
                            placeholder="Employee ID"
                            name="employee_id"
                            value={
                                formData.employee_id
                            }
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="text"
                            required
                            placeholder="First Name"
                            name="firstName"
                            value={
                                formData.firstName
                            }
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="text"
                            required
                            placeholder="Last Name"
                            name="lastName"
                            value={
                                formData.lastName
                            }
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="email"
                            required
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="tel"
                            required
                            placeholder="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="text"
                            required
                            placeholder="Residential Address"
                            name="residentialAddress"
                            value={
                                formData.residentialAddress
                            }
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="text"
                            required
                            placeholder="CNIC"
                            name="cnic"
                            value={formData.cnic}
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            type="text"
                            required
                            placeholder="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            required
                            type="date"
                            name="dateOfBirth"
                            value={
                                formData.dateOfBirth
                            }
                            onChange={handleChange}
                        />

                        <Input
                            mt={3}
                            mb={3}
                            required
                            type="date"
                            name="startDate"
                            value={
                                formData.startDate
                            }
                            onChange={handleChange}
                        />

                        <div className="priority-container">
                            <p>Status:</p>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.status ===
                                    'Active'
                                        ? 'green'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleStatusClick(
                                        'Active'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Active
                                </span>
                            </Tag>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.status ===
                                    'In Active'
                                        ? 'yellow'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleStatusClick(
                                        'In Active'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    In Active
                                </span>
                            </Tag>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.status ===
                                    'Terminated'
                                        ? 'red'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleStatusClick(
                                        'Terminated'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Terminated
                                </span>
                            </Tag>
                        </div>

                        <div className="priority-container">
                            <p>Gender:</p>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.gender ===
                                    'Male'
                                        ? 'green'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleGenderClick(
                                        'Male'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Male
                                </span>
                            </Tag>

                            <Tag
                                size="lg"
                                cursor="pointer"
                                colorScheme={
                                    formData.gender ===
                                    'Female'
                                        ? 'yellow'
                                        : 'gray'
                                }
                                borderRadius="full"
                                onClick={() =>
                                    handleGenderClick(
                                        'Female'
                                    )
                                }
                            >
                                <span className="tag-text">
                                    Female
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
                                'Add Employee'
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default AddEmployeeModal;