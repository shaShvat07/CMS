const entryService = require('../services/entryService');
const collectionService = require('../services/collectionService');

exports.createEntry = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;
        const entryData = req.body;

        const collection = await collectionService.getCollection(collection_id);
        if (!collection || collection === null || collection == undefined) {
            return res.status(404).json('No Collection Data found!');
        }

        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized!");
        }

        const result = await entryService.createEntry(collection, entryData);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};

exports.getEntries = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;

        const collection = await collectionService.getCollection(collection_id);

        if (!collection || collection === null || collection == undefined) {
            return res.status(404).json('No Collection Data found!');
        }

        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized!");
        }

        const entries = await entryService.getEntries(collection);
        if(entries.length === 0){
            return res.status(201).json("No entries exists!");
        }
        return res.status(200).json(entries);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;
        const entry_id = req.params.entry_id;
        const entryData = req.body;

        const collection = await collectionService.getCollection(collection_id);

        if (!collection || collection === null || collection == undefined) {
            return res.status(404).json('No Collection Data found!');
        }

        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized!");
        }

        const result = await entryService.updateEntry(collection, entry_id, entryData);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;
        const entry_id = req.params.entry_id;

        const collection = await collectionService.getCollection(collection_id);

        if (!collection || collection === null || collection == undefined) {
            return res.status(404).json('No Collection Data found!');
        }

        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized!");
        }

        const result = await entryService.deleteEntry(collection, entry_id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
