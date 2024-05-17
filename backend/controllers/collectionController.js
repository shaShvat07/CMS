const collectionService = require('../services/collectionService');
const userService = require('../services/userService');

//Create a Collections 
exports.createCollection = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const { collection_name } = req.body;
        if (!collection_name || typeof collection_name !== 'string' || collection_name.length === 0 || collection_name.length > 100) {
            return res.status(400).json({ message: "Title must be a non-empty string with maximum 100 characters" });
        }
        // Generate the current timestamp in milliseconds
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const created_at = dateObject.toISOString();

        const collection = await collectionService.createCollection(user_id, collection_name, created_at);
        if (collection == 'error') {
            return res.status(400).json('A collection with this name already exists for the user. Plz Try a different name');
        }
        await userService.addCollectionIdToUser(user_id, collection.collection_id);

        return res.status(201).json(collection);
    } catch (error) {
        console.log('Server Error: ', error);
        return res.status(400).json(error);
    }
};

//Get all collection
exports.getAllCollection = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const user = await userService.getUserById(user_id);
        const collection_data = await collectionService.getAllCollection(user);
        if (!collection_data || collection_data === null || collection_data == undefined) {
            return res.status(404).json('No Collection Data found!');
        }
        return res.status(201).json(collection_data);
    } catch (error) {
        console.log('Server Error: ', error);
        return res.status(400).json(error);
    }
}


//Get one collection
exports.getCollection = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;
        const collection = await collectionService.getCollection(collection_id);
        if (!collection || collection === null || collection == undefined) {
            return res.status(404).json('No Collection Data found!');
        }
        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized !");
        }
        return res.status(201).json(collection);
    } catch (error) {
        console.log('Server Error: ', error);
        return res.status(400).json(error);
    }
}

//Update the collection
exports.updateCollection = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const { collection_name } = req.body;
        if (!collection_name || typeof collection_name !== 'string' || collection_name.length === 0 || collection_name.length > 100) {
            return res.status(400).json({ message: "Title must be a non-empty string with maximum 100 characters" });
        }

        const collection_id = req.params.collection_id;

        // Generate the current timestamp in milliseconds
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const updated_at = dateObject.toISOString();

        const collection = await collectionService.updateCollection(user_id, collection_id, collection_name, updated_at);
        if (collection == 'error') {
            return res.status(400).json('A collection with this name already exists for the user. Plz Try a different name');
        }

        if (!collection) {
            return res.status(404).json("Can't update!");
        }
        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized !");
        }
        return res.status(201).json(collection);
    } catch (error) {
        console.log('Server Error: ', error);
        return res.status(400).json(error);
    }
}

//Delete the collection
exports.deleteCollection = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;
        const collection = await collectionService.getCollection(collection_id);
        if (!collection) {
            return res.status(404).json(`No collection with id = ${collection_id} exists to delete!`);
        }
        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized !");
        }

        const result = await collectionService.deleteCollection(collection_id);
        if (!result) {
            return res.status(400).json("Server Error!!");
        }
        if (result) {
            await userService.removeCollectionId(user_id, collection_id);
            return res.status(201).json(result);
        }
        return res.status(404).json("Oops Unable to delete!");
    } catch (error) {
        console.log('Server Error: ', error);
        return res.status(400).json(error);
    }
}

exports.addPropsToCollection = async (req, res) => {
    try {
        const collection_id = req.params.collection_id;
        const user_id = req.data.user.user_id;

        const collection = await collectionService.getCollection(collection_id);
        if (!collection) {
            return res.status(404).json("Collection not exists");
        }
        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized!");
        }


    } catch (error) {
        console.log(error);
        return res.json(error);
    }
};