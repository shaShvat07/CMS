const { pool } = require('../config/dbConfig');

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

//Delete property from a collection
exports.updateCollectionProperties = async (collection_id, properties) => {
    const query = 'UPDATE collection_data SET properties = $1, updated_at = CURRENT_TIMESTAMP WHERE collection_id = $2 RETURNING *';
    const values = [properties, collection_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};