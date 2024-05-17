const { pool } = require('../config/dbConfig');


//get user 
exports.getUserById = async (user_id) => {
    try {
        const query = 'SELECT * FROM users WHERE user_id = $1';
        const values = [user_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}
//Add the collection id inside the array
exports.addCollectionIdToUser = async (user_id, collection_id) => {
    try {
        const query = 'UPDATE users SET collection_ids = array_append(collection_ids, $1) WHERE user_id = $2';
        const values = [collection_id, user_id];
        await pool.query(query, values);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

exports.removeCollectionId = async (user_id, collection_id) => {
    try {
        const query = 'UPDATE users SET collection_ids = array_remove(collection_ids, $1) WHERE user_id = $2';
        const values = [collection_id, user_id];
        await pool.query(query, values);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};