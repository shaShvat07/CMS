const { pool } = require('../config/dbConfig');

exports.createEntry = async (collection, entryData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const sanitizedUserId = collection.user_id.replace(/-/g, '_');
        const tableName = `table_${sanitizedUserId}_${collection.collection_id}`;

        const columns = Object.keys(entryData).join(', ');
        const values = Object.values(entryData);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

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

        const columns = Object.keys(entryData).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(entryData);

        const updateQuery = `
            UPDATE ${tableName}
            SET ${columns}
            WHERE id = $${values.length + 1}
            RETURNING *;
        `;
        const { rows } = await client.query(updateQuery, [...values, entry_id]);

        await client.query('COMMIT');
        return {
            status: 200,
            message: 'Entry updated successfully',
            entry: rows[0],
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating entry:', error);
        return {
            status: 400,
            message: error,
        };
    } finally {
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
            DELETE FROM ${tableName}
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
