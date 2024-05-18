const express = require('express');
const router = express.Router();
const propController = require('../controllers/propController');
const { verifyToken } = require('../middleware/verifyToken');

router.post("/collection/:collection_id/prop", verifyToken, propController.addProp);
router.get("/collection/:collection_id/prop", verifyToken, propController.getAllProp);
// router.patch("/collection/:collection_id/prop/:prop_id", verifyToken, collectionController.updateCollection);
router.delete("/collection/:collection_id/prop/:prop_id", verifyToken, propController.deleteProp);

module.exports = { propRoutes: router }