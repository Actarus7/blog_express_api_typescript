// Imports
import { QueryResult } from "pg";
import { client } from "../client";
import { IUser } from "../types/userType";

/**
 * Création de la classe UsersService : Requêtes SQL liées à la table Users
*/
export class UsersService {

    // Requête GET SQL qui renvoie tous les Users
    async selectAllUsers(): Promise<IUser[] | undefined> {
        const data: QueryResult = await client.query('SELECT * FROM users');
        if (data.rowCount) {
            return data.rows
        }
        return undefined
    };

    // Requête GET SQL qui renvoie un User par son Id
    async getUserById(id: number): Promise<IUser | undefined> {
        const data = await client.query('SELECT * FROM users WHERE id =$1', [id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };

    // Requête GET SQL qui renvoie un User par son Username
    async getUserByUsername(username: string): Promise<IUser | undefined> {
        const data = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };

    // Requête GET SQL qui renvoie un User par son Email
    async getUserByEmail(e_mail: string): Promise<IUser | undefined> {
        const data = await client.query('SELECT * FROM users WHERE e_mail = $1', [e_mail]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };

    // Requête POST SQL qui ajoute un User
    async addUser(username: string, password: string, e_mail: string, lvl_admin: number): Promise<IUser | undefined> {
        const data = await client.query('INSERT INTO users (username, password, e_mail, lvl_admin) VALUES ($1, $2, $3, $4) RETURNING *', [username, password, e_mail, lvl_admin]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
};