import { client } from "../client";

export class UsersService {
    async selectAllUsers() {
        const data = await client.query('SELECT * FROM users');
        if (data.rowCount) {
            return data.rows
        }
        return undefined
    };
    async addUser(username: string, password: string, e_mail: string, lvl_admin: number) {
        const data = await client.query('INSERT INTO users (username, password, e_mail, lvl_admin) VALUES ($1, $2, $3, $4) RETURNING *', [username, password, e_mail, lvl_admin]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async getUserById(id: number) {
        const data = await client.query('SELECT * FROM users WHERE id =$1', [id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async getUserByUsername(username: string) {
        const data = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async getUserByEmail(e_mail: string) {
        const data = await client.query('SELECT * FROM users WHERE e_mail = $1', [e_mail]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
};