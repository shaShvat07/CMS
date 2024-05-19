const { pool } = require('../config/dbConfig');
const { isISO8601 } = require('validator');

exports.createEntry = async (collection, entryData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check uniqueness for properties that are marked as unique
        const uniqueProps = collection.properties.filter(prop => prop.unique);
        for (const prop of uniqueProps) {
            if (entryData[prop.name]) {
                const tableName = `table_${collection.user_id.replace(/-/g, '_')}_${collection.collection_id}`;
                const checkUniqueQuery = `
                    SELECT 1 FROM ${tableName} WHERE "${prop.name}" = $1;
                `;
                const { rows } = await client.query(checkUniqueQuery, [entryData[prop.name]]);
                if (rows.length > 0) {
                    return {
                        status: 400,
                        message: `${prop.name} must be unique. Value already exists.`,
                    };
                }
            }
        }

        // Validate type for each property
        for (const prop of collection.properties) {
            if (entryData[prop.name] !== undefined) {
                const value = entryData[prop.name];
                let expectedType = '';
                let isValid = true;

                switch (prop.type) {
                    case 'Text':
                    case 'Email':
                    case 'Password':
                        expectedType = 'string';
                        isValid = typeof value === expectedType;
                        break;
                    case 'Number':
                        expectedType = 'number';
                        isValid = typeof value === expectedType;
                        break;
                    case 'Boolean':
                        expectedType = 'boolean';
                        isValid = typeof value === expectedType;
                        break;
                    case 'Date':
                        expectedType = 'string';
                        isValid = typeof value === expectedType && isISO8601(value);
                        break;
                    default:
                        isValid = false;
                }

                if (!isValid) {
                    return {
                        status: 400,
                        message: `${prop.name} must be of type ${prop.type}.`,
                    };
                }
            }
        }

        // Proceed with entry creation if all unique properties are unique and types match
        // double quotes to handle the case-sensitive column
        const columns = Object.keys(entryData).map(column => `"${column}"`).join(', ');
        const values = Object.values(entryData);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;

        const insertQuery = `
            INSERT INTO ${tableName} (${columns})
            VALUES (${placeholders})
            RETURNING *;
        `;
        const { rows } = await client.query(insertQuery, values);

        await client.query('COMMIT');
        return {
            status: 201,
            message: 'Entry created successfully',
            entry: rows[0],
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating entry:', error);
        return {
            status: 400,
            message: error,
        };
    } finally {
        client.release();
    }
};


exports.getEntries = async (collection) => {
    const client = await pool.connect();
    try {
        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;

        const selectQuery = `SELECT * FROM ${tableName};`;
        const { rows } = await client.query(selectQuery);
        return rows;
    } catch (error) {
        console.error('Error retrieving entries:', error);
        return [];
    } finally {
        client.release();
    }
};

exports.updateEntry = async (collection, entry_id, entryData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;

        // Check uniqueness for properties that are marked as unique
        const uniqueProps = collection.properties.filter(prop => prop.unique);
        for (const prop of uniqueProps) {
            if (entryData[prop.name]) {
                const checkUniqueQuery = `
                    SELECT 1 FROM ${tableName} WHERE "${prop.name}" = $1 AND id != $2;
                `;
                const { rows } = await client.query(checkUniqueQuery, [entryData[prop.name], entry_id]);
                if (rows.length > 0) {
                    return {
                        status: 400,
                        message: `${prop.name} must be unique. Value already exists.`,
                    };
                }
            }
        }

        // Validate type for each property
        for (const prop of collection.properties) {
            if (entryData[prop.name] !== undefined) {
                const value = entryData[prop.name];
                const expectedType = prop.type.toLowerCase();
                const actualType = typeof value;
                if (actualType !== expectedType) {
                    return {
                        status: 400,
                        message: `${prop.name} must be of type ${prop.type}.`,
                    };
                }
            }
        }

        // Prepare update query
        const columns = Object.keys(entryData).map((column, index) => `"${column}" = $${index + 1}`).join(', ');
        const values = Object.values(entryData);

        const updateQuery = `
            UPDATE ${tableName}
            SET ${columns}
            WHERE id = $${values.length + 1}
            RETURNING *;
        `;

        // Execute update query
        const { rows } = await client.query(updateQuery, [...values, entry_id]);

        // Commit transaction
        await client.query('COMMIT');
        return {
            status: 200,
            message: 'Entry updated successfully',
            entry: rows[0],
        };
    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Error updating entry:', error);
        return {
            status: 400,
            message: error,
        };
    } finally {
        // Release client connection
        client.release();
    }
};



exports.deleteEntry = async (collection, entry_id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;

        const deleteQuery = `
            DELETE FROM "${tableName}"
            WHERE id = $1
            RETURNING *;
        `;
        const { rows } = await client.query(deleteQuery, [entry_id]);

        await client.query('COMMIT');
        return {
            status: 200,
            message: 'Entry deleted successfully',
            entry: rows[0],
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting entry:', error);
        return {
            status: 400,
            message: error,
        };
    } finally {
        client.release();
    }
};
