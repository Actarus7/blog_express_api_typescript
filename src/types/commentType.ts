/**
 * Création de l'interface IComment */ 
export interface IComment {
    id: number;
    message: string;
    date: Date;
    user_id: number;
    article_id: number;
};