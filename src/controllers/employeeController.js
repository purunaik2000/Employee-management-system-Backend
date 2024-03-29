const employeeModel = require('./../models/employeeModel');
const employeeValidation = require('./../validation/employeeValidation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
async function registerEmployee(req, res) {
    try {
        let data = req.body;
        if (!data) return res.status(400).send({
            status: false,
            message: 'Please provide employee details'
        })

        let fields = [
            'firstName',
            'lastName',
            'gender',
            'phoneNumber',
            'email',
            'dateOfBirth',
            'dateOfJoining',
            'password',
            'type',
            'designation',
            'salary'
        ];

        // check all the fields are available in req body
        for (let field of fields) {
            if (data[field]) data[field] = data[field].toString().trim();
            if (!data[field]) return res.status(400).send({
                status: false,
                message: `${field} is required`
            })
        }

        // validate the fields
        let isValid = employeeValidation(data);

        if (isValid !== true) return res.status(400).send(isValid);

        // Handle Unique email
        let oldEmp = await employeeModel.findOne({ email: data.email });

        if (oldEmp) return res.status(400).send({
            status: false,
            message: `${data.email} is already registered`
        })

        // Hash Password
        let hash = await bcrypt.hash(data.password, 10);
        data.password = hash;

        // Store in database
        await employeeModel.create(data);

        return res.status(201).send({
            status: true,
            message: 'Your profile is created successfully'
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function loginEmployee(req, res) {
    try {
        let data = req.body;

        // check email and password available in req body
        if (!data) return res.status(400).send({
            status: false,
            message: 'Email address and password are required'
        })

        if (data.email) data.email = data.email.toString().trim();
        if (!data.email) return res.status(400).send({
            status: false,
            message: 'Email address is required'
        })

        if (data.password) data.password = data.password.toString().trim();
        if (!data.password) return res.status(400).send({
            status: false,
            message: 'password is required'
        })

        // check email is registered or not
        let emp = await employeeModel.findOne({ email: data.email, isDeleted: false });
        if (!emp) return res.status(400).send({
            status: false,
            message: `${data.email} is not registered`
        })

        // password match
        let isMatch = await bcrypt.compare(data.password, emp.password);
        if (!isMatch) return res.status(400).send({
            status: false,
            message: 'Incorrect password'
        })

        // genrate token
        let token = jwt.sign(
            { 
                _id: emp._id,
                email: emp.email,
                type: emp.type
            },
            'jwtPrivateKey',
            { expiresIn: '1h' }
        )

        const empData = {
            firstName: emp.firstName,
            lastName: emp.lastName,
            designation: emp.designation,
            salary: emp.salary,
            phoneNumber: emp.phoneNumber,
            email: emp.email,
            address: emp.address,
            dateOfJoining: emp.dateOfJoining,
            gender: emp.gender,
            dateOfBirth: emp.dateOfBirth
        }

        res.send({
            status: true,
            message: 'You are logged in',
            token: token,
            data: empData
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function getEmployeeById(req, res) {
    try {
        let id = req.params.id;

        if(!ObjectId.isValid(id)) return res.status(400).send({
            status: false,
            message: 'Invalid user id'
        })

        let emp = await employeeModel.findById(id).select({
            firstName: 1,
            lastName: 1,
            gender: 1,
            address: 1,
            phoneNumber: 1,
            email: 1,
            dateOfBirth: 1,
            dateOfJoining: 1,
            type: 1,
            designation: 1,
            salary: 1
        });

        if(!emp) return res.status(404).send({
            status: false,
            message: 'User not found'
        })

        return res.status(200).send({
            status: true,
            data: emp
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function getEmployees(req, res) {
    try {
        let employees = await employeeModel.find({isDeleted: false}).select({
            firstName: 1,
            lastName: 1,
            gender: 1,
            address: 1,
            phoneNumber: 1,
            email: 1,
            dateOfBirth: 1,
            dateOfJoining: 1,
            designation: 1,
        });
        return res.status(200).send({
            status: true,
            data: employees
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function updateEmployee(req, res) {
    try {
        // Take user id and data to update
        let id = req.params.id;
        let data = req.body;

        // Validate id
        if(!ObjectId.isValid(id)) return res.status(400).send({
            status: false,
            message: 'Invalid user id'
        })

        let fields = [
            'firstName',
            'lastName',
            'gender',
            'phoneNumber',
            'dateOfBirth',
            'dateOfJoining',
            'password',
            'type',
            'designation',
            'salary'
        ];

        let isAnyField = false;

        for(let field of fields) {
            if(data[field]) data[field] = data[field].toString().trim();
            if(data[field]) isAnyField = true;
        }

        if(!isAnyField) return res.status(400).send({
            status: false,
            message: 'Please provide any field that you want to update'
        })

        //validate the fields
        let isValid = employeeValidation(data, id);

        if (isValid !== true) return res.status(400).send(isValid);

        if(data.password) {
            // Hash Password
            let hash = await bcrypt.hash(data.password, 10);
            data.password = hash;
        }

        // update in database
        let updatedData = await employeeModel.findOneAndUpdate({
            _id: id
        }, data,
        {
            new: true
        })

        if(!updatedData) return res.status(400).send({
            status: false,
            message: 'Incorrect id'
        })

        return res.status(200).send({
            status: true,
            message: 'Updated Successfully',
            data: updatedData
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function deleteEmployee(req, res) {
    try {
        // Take user id
        let id = req.params.id;

        // Validate user id
        if(!ObjectId.isValid(id)) return res.status(400).send({
            status: false,
            message: 'Invalid user id'
        })

        let emp = await employeeModel.findByIdAndUpdate({
            _id: id
        },{
            isDeleted : true
        })

        if(!emp) return status(400).send({
            status: false,
            message: 'User not found'
        })
        
        return res.status(200).send({
            status:true,
            message:'User has been deleted successfully.'
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

module.exports = {
    registerEmployee,
    loginEmployee,
    getEmployeeById,
    getEmployees,
    updateEmployee,
    deleteEmployee
}