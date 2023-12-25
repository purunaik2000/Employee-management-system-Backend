const router = require('express').Router();

router.get('/test', (req, res) => res.send('Working fine'));



module.exports = router;