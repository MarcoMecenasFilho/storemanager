const express = require('express');
const rescue = require('express-rescue');
const productsControllers = require('../controllers/productsControllers');

const router = express.Router();

router.put('/:id', rescue(productsControllers.update));
router.delete('/:id', rescue(productsControllers.exclude));
router.post('', rescue(productsControllers.create));
router.get('/:id', rescue(productsControllers.getById));
router.get('', rescue(productsControllers.getAll));

module.exports = router;
