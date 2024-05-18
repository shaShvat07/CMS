const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/:collection_id/entry', verifyToken, entryController.createEntry);
router.get('/:collection_id/entry', verifyToken, entryController.getEntries);
router.put('/:collection_id/entry/:entry_id', verifyToken, entryController.updateEntry);
router.delete('/:collection_id/entry/:entry_id', verifyToken, entryController.deleteEntry);

module.exports = { entryRoutes: router }