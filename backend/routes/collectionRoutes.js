const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { verifyToken } = require('../middleware/verifyToken');

router.post("/collection", verifyToken, collectionController.createCollection);
router.get("/collection", verifyToken, collectionController.getAllCollection);
router.get("/collection/:collection_id", verifyToken, collectionController.getCollection);
router.patch("/collection/:collection_id", verifyToken, collectionController.updateCollection);
router.delete("/collection/:collection_id", verifyToken, collectionController.deleteCollection);

module.exports = { collectionRoutes: router };