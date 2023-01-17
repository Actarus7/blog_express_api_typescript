import { client } from "../client";
import Comment from "../types/commentType";

export class CommentsService {
    async selectAllComments():Promise<Comment[]| undefined> {
        const data = await client.query('SELECT * FROM comments');
        if (data.rowCount) {
            return data.rows
        }
        return undefined
    };
    async selectCommentById(id: number): Promise<Comment | undefined> {
        const data = await client.query('SELECT * FROM comments WHERE id = $1', [id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async selectCommentsByArticleId(article_id: number): Promise<Comment[]| undefined> {
        const data = await client.query('SELECT * FROM comments WHERE article_id = $1', [article_id]);
        if (data.rowCount) {
            return data.rows
        }
        return undefined
    };
    async addComment(message: string, user_id: number, article_id: number): Promise<Comment | undefined> {        
        const data = await client.query('INSERT INTO comments (message, user_id, article_id) VALUES($1, $2, $3) RETURNING *', [message, user_id, article_id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async updateComment(id: number, message: string): Promise<Comment | undefined> {
        const data = await client.query('UPDATE comments SET message=$2 WHERE id = $1', [id, message]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };
    async deleteComment(id: number): Promise<Comment | undefined> {
        const data = await client.query('DELETE FROM comments WHERE id = $1', [id]);
        if (data.rowCount > 0) {
            return data.rows[0]
        }
        return undefined
    };
}