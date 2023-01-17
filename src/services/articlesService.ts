import { client } from "../client";
import Article from "../types/articleType";

export class ArticlesService {
    async selectAllArticles(): Promise<Article[] | undefined> {
        const data = await client.query('SELECT * FROM articles');
        if (data.rowCount) {
            return data.rows
        }
        return undefined
    };
    async selectArticleByID(id: number): Promise<Article | undefined> {
        const data = await client.query('SELECT * FROM articles WHERE id =$1', [id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async addArticle(title: string, text: string, user_id: number): Promise<Article | undefined> {
        const data = await client.query('INSERT INTO articles (title, text, user_id) VALUES ($1, $2, $3) RETURNING *', [title, text, user_id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async updateArticle(id: number, title: string, text: string): Promise<Article | undefined> {
        const data = await client.query('UPDATE articles SET title = $2, text = $3 WHERE id = $1 RETURNING *', [id, title, text]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async deleteArticle(id: number): Promise<Article | undefined> {
        const data = await client.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);
        if (data.rowCount > 0) {
            return data.rows[0]
        }
        return undefined 
    };
};