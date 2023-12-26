const employeeModel = require('./../models/employeeModel');
const employeeValidation = require('./../validation/employeeValidation');
const bcrypt = require('bcrypt');

async function employeeRegistration(req, res) {
    try {
        let data = req.body;
        if(!data) return res.status(400).send({
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

        for(let field of fields) {
            if(data[field]) data[field] = data[field].toString().trim();
            if(!data[field]) return res.status(400).send({
                status: false,
                message: `${field} is required`
            })
        }

        let isValid = employeeValidation(data);

        if(isValid !== true) return res.status(400).send(isValid);

        // Handle Unique email
        let oldEmp = await employeeModel.findOne({email: data.email});

        if(oldEmp) return res.status(400).send({
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

async function employeeGet(req, res) {
    try {
        
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function employeeUpdate(req, res) {
    try {
        
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

async function employeeDelete(req, res) {
    try {
        
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}