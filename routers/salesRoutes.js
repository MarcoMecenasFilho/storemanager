const express = require('express');
const rescue = require('express-rescue');
const salesControllers = require('../controllers/salesControllers');

const router = express.Router();

router.put('/:id', rescue(salesControllers.update));
router.delete('/:id', rescue(salesControllers.exclude));
router.post('', rescue(salesControllers.create));
router.get('/:id', rescue(salesControllers.getById));
router.get('', rescue(salesControllers.getAll));

module.exports = router;