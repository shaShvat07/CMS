const collectionService = require('../services/collectionService');

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

        const newProperty = { name, type, unique: finalUniqueValue };
        // console.log(newProperty);
        // Update collection properties and user-specific table
        const result = await collectionService.addPropertyToCollection(collection_id, newProperty);

        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}