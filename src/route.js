const router = require('express').Router();
const { 
    registerEmployee, 
    loginEmployee, 
    getEmployeeById, 
    getEmployees, 
    updateEmployee, 
    deleteEmployee
} = require('./controllers/employeeController');

router.get('/test', (req, res) => res.send('Working fine'));

router.post('/test1', (req, res) => {
    console.log(req);
    res.send('done');
})

router.post('/register', registerEmployee);



module.exports = router;