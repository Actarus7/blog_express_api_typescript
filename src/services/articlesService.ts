// Imports
import { client } from "../client";
import { IArticle } from "../types/articleType";


/**
    * Création de la Class ArticlesService : Requêtes SQL liées à la table Artciles
 */
export class ArticlesService {

    // Requête GET SQL qui renvoie la liste de tous les Articles - Utile surtout pour les tests
    async selectAllArticles(): Promise<IArticle[] | undefined> {
        const data = await client.query('SELECT * FROM articles');
        if (data.rowCount) {
            return data.rows
        }
        return undefined
    };

    // Requête GET SQM qui renvoie un Article en fonction de son Id
    async selectArticleByID(id: number): Promise<IArticle | undefined> {
        const data = await client.query('SELECT * FROM articles WHERE id =$1', [id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };

    // Requête POST SQL qui permet d'ajouter un Article
    async addArticle(title: string, text: string, user_id: number): Promise<IArticle | undefined> {
        const data = await client.query('INSERT INTO articles (title, text, user_id) VALUES ($1, $2, $3) RETURNING *', [title, text, user_id]);
        if (data.rowCount) {
            return data.rows[0]
        }
        return undefined
    };

    // Requête PUT SQL qui permet de modifier un Article
    async updateArticle(id: number, title: string, text: string): Promise<IArticle | undefined> {
        const updatedArticle = await client.query('UPDATE articles SET title = $2, text = $3 WHERE id = $1 RETURNING *', [id, title, text]);

        if (updatedArticle.rowCount) {
            return updatedArticle.rows[0]
        };

        return undefined;
    };

    // Requête DELETE SQL qui permet de supprimer un Article
    async deleteArticle(id: number): Promise<IArticle | undefined> {
        const deleteArticle = await client.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);
        if (deleteArticle.rowCount > 0) {
            return deleteArticle.rows[0]
        }
        return undefined
    };
};