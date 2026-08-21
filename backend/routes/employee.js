const express = require('express');
const router = express.Router();
const Employee = require('../models/employees');

// ========================================
// GET ACTIVE EMPLOYEES FOR DROPDOWN
// ========================================
router.get('/employees/dropdown', async(req, res) => {
    try {
        const employees = await Employee.find({
                status: 'Active',
            })
            .select('_id employee_id firstName lastName role')
            .sort({ firstName: 1 });

        const dropdownData = employees.map((employee) => ({
            id: employee._id,
            employee_id: employee.employee_id,
            name: `${employee.firstName} ${employee.lastName}`.trim(),
            role: employee.role,
        }));

        return res.status(200).json(dropdownData);
    } catch (error) {
        console.error(
            'Get employee dropdown error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch employees',
            error: error.message,
        });
    }
});

// ========================================
// ADD EMPLOYEE
// ========================================
router.post('/employee', async(req, res) => {
    try {
        const {
            employee_id,
            firstName,
            lastName,
            email,
            phone,
            residentialAddress,
            cnic,
            role,
            dateOfBirth,
            startDate,
            status,
            gender,
        } = req.body;

        if (!employee_id || !employee_id.trim()) {
            return res.status(400).json({
                message: 'Employee ID is required',
            });
        }

        if (!firstName || !firstName.trim()) {
            return res.status(400).json({
                message: 'First name is required',
            });
        }

        if (!lastName || !lastName.trim()) {
            return res.status(400).json({
                message: 'Last name is required',
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: 'Email is required',
            });
        }

        const cleanEmployeeId = employee_id.trim();
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanCnic = cnic ? cnic.trim() : '';

        // Check duplicate employee ID
        const existingEmployeeById =
            await Employee.findOne({
                employee_id: cleanEmployeeId,
            });

        if (existingEmployeeById) {
            return res.status(400).json({
                message: 'Employee ID already exists',
            });
        }

        // Check duplicate email
        const existingEmployeeByEmail =
            await Employee.findOne({
                email: cleanEmail,
            });

        if (existingEmployeeByEmail) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }

        // Check duplicate CNIC
        if (cleanCnic) {
            const existingEmployeeByCnic =
                await Employee.findOne({
                    cnic: cleanCnic,
                });

            if (existingEmployeeByCnic) {
                return res.status(400).json({
                    message: 'CNIC already exists',
                });
            }
        }

        const newEmployee = new Employee({
            employee_id: cleanEmployeeId,
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            phone,
            residentialAddress: residentialAddress ?
                residentialAddress.trim() : '',
            cnic: cleanCnic,
            role: role ? role.trim() : '',
            dateOfBirth,
            startDate,
            status: status || 'Active',
            gender: gender || 'Male',
        });

        await newEmployee.save();

        return res.status(201).json({
            message: 'Employee added successfully',
            employee: newEmployee,
        });
    } catch (error) {
        console.error(
            'Add employee error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to add employee',
            error: error.message,
        });
    }
});

// ========================================
// GET ALL EMPLOYEES
// ========================================
router.get('/employees', async(req, res) => {
    try {
        const employees = await Employee.find()
            .select(
                '_id employee_id firstName lastName email phone role status'
            )
            .sort({ firstName: 1 });

        return res.status(200).json(employees);
    } catch (error) {
        console.error(
            'Get employees error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch employees',
            error: error.message,
        });
    }
});

// ========================================
// GET ACTIVE EMPLOYEES
// ========================================
router.get('/employees/active', async(req, res) => {
    try {
        const employees = await Employee.find({
                status: 'Active',
            })
            .select(
                '_id employee_id firstName lastName email role status'
            )
            .sort({ firstName: 1 });

        return res.status(200).json(employees);
    } catch (error) {
        console.error(
            'Get active employees error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch active employees',
            error: error.message,
        });
    }
});

// ========================================
// EMPLOYEE STATISTICS
// ========================================
router.get('/employees-stats', async(req, res) => {
    try {
        const totalEmployees =
            await Employee.countDocuments();

        const activeEmployees =
            await Employee.countDocuments({
                status: 'Active',
            });

        const inActiveEmployees =
            await Employee.countDocuments({
                status: 'In Active',
            });

        const terminatedEmployees =
            await Employee.countDocuments({
                status: 'Terminated',
            });

        return res.status(200).json({
            totalEmployees,
            activeEmployees,
            inActiveEmployees,
            terminatedEmployees,
        });
    } catch (error) {
        console.error(
            'Employee statistics error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch employee statistics',
            error: error.message,
        });
    }
});

module.exports = router;