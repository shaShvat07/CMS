const propService = require('../services/propService');
const collectionService = require('../services/collectionService');
const { v4: uuidv4 } = require('uuid');

exports.addProp = async (req, res) => {
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

        const { name, type, unique } = req.body;
        if (!name || typeof name !== 'string' || name.length === 0 || name.length > 100) {
            return res.status(400).json({ message: "Name must be a non-empty string with maximum 100 characters" });
        }

        const validTypes = ['Text', 'Email', 'Password', 'Number', 'Date', 'Boolean'];
        if (!type || typeof type !== 'string' || !validTypes.includes(type)) {
            return res.status(400).json({ message: "Type must be one of 'Text', 'Email', 'Password', 'Number', 'Date', or 'Boolean'" });
        }

        if (!unique || typeof unique !== 'boolean') {
            return res.status(400).json({ message: "Unique must be a non-empty boolean" });
        }

        // Check if the type is Boolean, Date, or Password, and override unique to false
        const shouldOverrideUnique = ['Boolean', 'Date', 'Password'].includes(type);
        const finalUniqueValue = shouldOverrideUnique ? false : unique;
        const existingProperties = collection.properties || [];
        if (existingProperties) {
            for (const prop of existingProperties) {
                if (prop.name === name) {
                    return res.status(400).json({ message: 'Property name already exists' });
                }
            }
        }
        const newProperty = { id: uuidv4(), name, type, unique: finalUniqueValue };
        // console.log(newProperty);
        // Update collection properties and user-specific table
        const result = await propService.addPropertyToCollection(collection_id, newProperty);

        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

exports.getAllProp = async (req, res) => {
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

        const existingProperties = collection.properties;

        return res.status(201).json(existingProperties);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

exports.deleteProp = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const collection_id = req.params.collection_id;
        const prop_id = req.params.prop_id;
        const collection = await collectionService.getCollection(collection_id);

        if (!collection || collection === null || collection == undefined) {
            return res.status(404).json('No Collection Data found!');
        }

        if (collection.user_id !== user_id) {
            return res.status(401).json("Unauthorized !");
        }

        const existingProperties = collection.properties;

        // Find the index of the property with the given id
        const propIndex = existingProperties.findIndex(prop => prop.id === prop_id);

        if (propIndex === -1) {
            return res.status(404).json('Property not found!');
        }

        // Remove the property from the array
        existingProperties.splice(propIndex, 1);

        // Update the collection with the new properties array
        const data = await propService.updateCollectionProperties(collection_id, existingProperties);
        if(!data){
            return res.status(400).json("Oops Error in deleting the props!");
        }
        return res.status(200).json({ message: 'Property deleted successfully!', data: data });

    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};