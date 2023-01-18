// Imports
import { client } from "../client";
import {IComment} from "../types/commentType";

/**
    * Création de la Class CommentService : Requêtes SQL liées à la table Comments
 */
export class CommentsService {
    // Requête GET SQL qui renvoie la liste de tous les Comments (quel que soit l'article) - Utile surtout pour les tests
    async selectAllComments():Promise<IComment[]| undefined> {
        const data = await client.query('SELECT * FROM comments');

        if (data.rowCount) {
            return data.rows
        };

        return undefined;
    };

    // Requête GET SQL qui renvoie un Comment par son Id
    async selectCommentById(id: number): Promise<IComment | undefined> {
        const data = await client.query('SELECT * FROM comments WHERE id = $1', [id]);

        if (data.rowCount) {
            return data.rows[0]
        };

        return undefined;
    };

    // Requête GET SQL qui renvoie la liste de TOUS les Comments d'un Article en fonction de son Id
    async selectCommentsByArticleId(article_id: number): Promise<IComment[]| undefined> {
        const data = await client.query('SELECT * FROM comments WHERE article_id = $1', [article_id]);

        if (data.rowCount) {
            return data.rows
        };

        return undefined;
    };

    // Requête POST SQL qui permet d'ajouter un Comment dans un Article
    async addComment(message: string, user_id: number, article_id: number): Promise<IComment | undefined> {        
        const data = await client.query('INSERT INTO comments (message, user_id, article_id) VALUES($1, $2, $3) RETURNING *', [message, user_id, article_id]);

        if (data.rowCount) {
            return data.rows[0]
        };

        return undefined;
    };

    // Requête PUT SQL qui permet de modifier un Comment
    async updateComment(id: number, message: string): Promise<IComment | undefined> {
        const updatedComment = await client.query('UPDATE comments SET message=$2 WHERE id = $1 RETURNING *', [id, message]);

        if (updatedComment.rowCount) {
            return updatedComment.rows[0]
        };

        return undefined;
    };

    // Requête DELETE SQL qui permet de supprimer un Comment
    async deleteComment(id: number): Promise<IComment | undefined> {
        const deletedComment = await client.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);

        if (deletedComment.rowCount > 0) {
            return deletedComment.rows[0]
        };

        return undefined;
    };

    // Requête DELETE SQL qui permet de supprimer TOUS les Comments d'un Article en fonction de son Id
    async deleteCommentsByArticleId(article_id: number): Promise<IComment[]| undefined> {
        const deletedComments = await client.query('DELETE FROM comments WHERE article_id = $1 RETURNING *', [article_id]);

        if (deletedComments.rowCount) {
            return deletedComments.rows
        };

        return undefined;
    };
};