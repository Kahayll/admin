import { query } from "../db.js";
import bcrypt from 'bcryptjs';

export const getUsers = async() => {
    const {rows} = await query(`SELECT id, name, email, position, age, isactive FROM users_tb`);
    return rows;
}

export const createUser = async (userData) => {
    const { name, email, position, age, isactive, password } = userData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows } = await query(
        `INSERT INTO users_tb (name, email, position, age, isactive, password)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, email, position, age, isactive, hashedPassword]
    );
    return rows[0];
}

export const updateUser = async (userId, userData) => {
    const { name, email, position, age, isactive, password } = userData;
    let queryParts = [];
    let queryParams = [];

    let paramIndex = 1;

    if (name !== undefined) {
        queryParts.push(`name = $${paramIndex++}`);
        queryParams.push(name);
    }
    if (email !== undefined) {
        queryParts.push(`email = $${paramIndex++}`);
        queryParams.push(email);
    }
    if (position !== undefined) {
        queryParts.push(`position = $${paramIndex++}`);
        queryParams.push(position);
    }
    if (age !== undefined) {
        queryParts.push(`age = $${paramIndex++}`);
        queryParams.push(age);
    }
    if (isactive !== undefined) {
        queryParts.push(`isactive = $${paramIndex++}`);
        queryParams.push(isactive);
    }
    if (password !== undefined && password !== null && password !== '') {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        queryParts.push(`password = $${paramIndex++}`);
        queryParams.push(hashedPassword);
    }

    if (queryParts.length === 0) {
        const { rows } = await query('SELECT * FROM users_tb WHERE id = $1', [userId]);
        return rows[0];
    }

    const queryText = `UPDATE users_tb SET ${queryParts.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(userId);

    const { rows } = await query(queryText, queryParams);
    return rows[0];
}

export const deleteUser = async (userId) => {
    const {rowCount} = await query (`DELETE FROM users_tb WHERE id = $1`, [userId]);
    return rowCount > 0;
}

export const searchUser = async (searchTerm) => {
    const { rows } = await query(
        `SELECT id, name, email, position, age, isactive FROM users_tb WHERE name ILIKE $1 OR email ILIKE $1 OR position ILIKE $1`,
        [`%${searchTerm}%`]
    );
    return rows;
}