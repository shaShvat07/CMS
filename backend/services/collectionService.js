const { pool } = require('../config/dbConfig');

// Create a new collection data
exports.createCollection = async (user_id, collection_name, created_at) => {
    // Check if a collection with the same name already exists for the user
    const checkQuery = 'SELECT * FROM collection_data WHERE user_id = $1 AND collection_name = $2';
    const checkValues = [user_id, collection_name];
    const { rows: existingCollections } = await pool.query(checkQuery, checkValues);

    if (existingCollections.length > 0) {
        return 'error';
    }

    const query = 'INSERT INTO collection_data (user_id, collection_name, created_at) VALUES ($1, $2, $3) RETURNING *';
    const values = [user_id, collection_name, created_at];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Get a collection based on its id
exports.getCollection = async (collection_id) => {
    const query = 'SELECT * FROM collection_data WHERE collection_id = $1';
    const values = [collection_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Get all collection data of a user
exports.getAllCollection = async (user) => {
    try {
        const data = [];
        if (user.collection_ids) {
            for (const collectionId of user.collection_ids) {
                const collection = await this.getCollection(collectionId);
                if (collection) {
                    data.push(collection);
                }
            }
        }
        return data;
    } catch (error) {
        console.log(error);
        res.json('The server has encountered an unexpected error: ', error);
    }
};

// Update the collection
exports.updateCollection = async (user_id, collection_id, collection_name, updated_at) => {
    // Check if a collection with the same name already exists for the user
    const checkQuery = 'SELECT * FROM collection_data WHERE user_id = $1 AND collection_name = $2';
    const checkValues = [user_id, collection_name];
    const { rows: existingCollections } = await pool.query(checkQuery, checkValues);

    if (existingCollections.length > 0) {
        return 'error';
    }

    const query = 'UPDATE collection_data SET collection_name = $1, updated_at = $2 WHERE collection_id = $3 RETURNING *';
    const values = [collection_name, updated_at, collection_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Delete the collection
exports.deleteCollection = async (collection_id) => {
    const query = 'DELETE FROM collection_data WHERE collection_id = $1 RETURNING *';
    const values = [collection_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

