const employeeModel = require('./../models/employeeModel');
const employeeValidation = require('./../validation/employeeValidation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        let newEmp = new employeeModel(data);

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

async function login(req, res) {
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
        let emp = await employeeModel.findOne({ email: data.email });
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
        let token = await jwt.sign(
            { 
                _id: emp._id,
                email: emp.email,
            },
            'jwtPrivateKey',
            { expiresIn: '1h' }
        )

        res.send({
            status: true,
            message: 'You are logged in',
            token: token
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function getEmployee(req, res) {
    try {

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function getEmployees(req, res) {
    try {

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function updateEmployee(req, res) {
    try {

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function deleteEmployee(req, res) {
    try {

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}