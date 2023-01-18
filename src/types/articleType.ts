// Imports
import { IComment } from "./commentType";

/**
 * Création de l'interface IArticle - typage des réponses d'article
 *  */ 
export interface IArticle {
    id: number;
    title: string;
    text: string;
    date: Date;
    user_id: number;
};

/**
 * Création de l'extension IArticleWithComments (pour ajouter "comments" qui est un array comprenant tous les commentaires de l'article)
 *  */
export interface IArticleWithComments extends IArticle {
    comments: IComment[] | undefined
};