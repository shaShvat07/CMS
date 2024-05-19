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

        // Determine SQL type
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
                sqlType = 'BIGINT';
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

        // Quote the column name to prevent SQL injection and handle reserved keywords
        const quotedColumnName = `"${newProperty.name}"`;

        // Add new column to user-specific table with or without NOT NULL constraint
        const notNullConstraint = newProperty.unique ? 'UNIQUE' : '';
        const addColumnQuery = `
            ALTER TABLE ${tableName}
            ADD COLUMN ${quotedColumnName} ${sqlType} ${notNullConstraint};
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

// Delete a property from a collection
exports.deletePropertyFromCollection = async (collection_id, property_id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get the current properties of the collection
        const { rows: collectionRows } = await client.query('SELECT * FROM collection_data WHERE collection_id = $1', [collection_id]);
        if (collectionRows.length === 0) {
            return {
                status: 404,
                message: 'Collection not found',
            };
        }
        const currentProperties = collectionRows[0].properties || [];

        // Find the index of the property to delete
        const propertyIndex = currentProperties.findIndex(property => property.id === property_id);
        if (propertyIndex === -1) {
            return {
                status: 404,
                message: 'Property not found in collection',
            };
        }

        // Remove the property from the array
        const deletedProperty = currentProperties.splice(propertyIndex, 1)[0];

        // Update the collection with the new properties array
        const updateQuery = 'UPDATE collection_data SET properties = $1, updated_at = CURRENT_TIMESTAMP WHERE collection_id = $2 RETURNING *';
        const updateValues = [currentProperties, collection_id];
        const { rows: updatedRows } = await client.query(updateQuery, updateValues);

        // Remove the corresponding column from the user-specific table
        const collection = collectionRows[0];
        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;
        const quotedColumnName = `"${deletedProperty.name}"`;
        const dropColumnQuery = `ALTER TABLE ${tableName} DROP COLUMN ${quotedColumnName};`;
        await client.query(dropColumnQuery);

        await client.query('COMMIT');

        return {
            status: 200,
            message: 'Property deleted successfully',
            collection: updatedRows[0],
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting property from collection:', error);
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message,
        };
    } finally {
        client.release();
    }
};
