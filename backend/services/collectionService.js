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

const checkDuplicatePropertyName = async (collection_id, newPropertyName) => {
    try {
        const query = `
            SELECT properties
            FROM collection_data
            WHERE collection_id = $1;
        `;
        const values = [collection_id];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            console.log('No collection found with the given collection_id');
            return false;
        }

        const propertiesArray = rows[0].properties;
        for (let i = 0; i < propertiesArray.length; i++) {
            const property = propertiesArray[i];
            if (property.name === newPropertyName) {
                // console.log('Duplicate name found:', newPropertyName);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error checking duplicate property name:', error);
        return false;
    }
};

// Add a property to a collection
exports.addPropertyToCollection = async (collection_id, newProperty) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update properties array in collection_data
        const updatePropertiesQuery = `
            UPDATE collection_data
            SET properties = array_append(properties, $1::jsonb)
            WHERE collection_id = $2
            RETURNING properties;
        `;
        const updatePropertiesValues = [newProperty, collection_id];
        const { rows: updatedRows } = await client.query(updatePropertiesQuery, updatePropertiesValues);

        if (!updatedRows[0]) {
            return {
                status: 400,
                message: 'Failed to update collection properties',
            };
        }

        // Get the collection data for user and collection name
        const collectionQuery = 'SELECT * FROM collection_data WHERE collection_id = $1';
        const { rows } = await client.query(collectionQuery, [collection_id]);
        const collection = rows[0];
        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;

        // Ensure the table exists or create it
        const createTableQuery = `
                CREATE TABLE IF NOT EXISTS ${tableName} (
                    id SERIAL PRIMARY KEY
                );
            `;
        await client.query(createTableQuery);

        // Ensure property name is unique in the user-specific table
        const isDuplicate = await checkDuplicatePropertyName(collection_id, newProperty.name);
        if (isDuplicate) {
            return {
                status: 400,
                message: `Property name "${newProperty.name}" already exists in the table "${tableName}"`,
            };
        }

        // Determine SQL type and constraints
        let sqlType;
        switch (newProperty.type) {
            case 'Text':
                sqlType = 'VARCHAR(255)';
                break;
            case 'Email':
                sqlType = 'VARCHAR(255)';
                break;
            case 'Password':
                sqlType = 'VARCHAR(255)';
                break;
            case 'Number':
                sqlType = 'INTEGER';
                break;
            case 'Date':
                sqlType = 'TIMESTAMPTZ';
                break;
            case 'Boolean':
                sqlType = 'BOOLEAN';
                break;
            default:
                return {
                    status: 400,
                    message: "Invalid type",
                };
        }

        const notNullConstraint = newProperty.unique ? 'NOT NULL' : '';

        // Add new column to user-specific table
        const addColumnQuery = `
            ALTER TABLE ${tableName}
            ADD COLUMN ${newProperty.name} ${sqlType} ${notNullConstraint};
        `;
        await client.query(addColumnQuery);

        await client.query('COMMIT');
        return {
            status: 201,
            message: 'Property added successfully',
            properties: updatedRows[0].properties,
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding property to collection:', error);
        return {
            status: 400,
            message: error,
        };
    } finally {
        client.release();
    }
};
