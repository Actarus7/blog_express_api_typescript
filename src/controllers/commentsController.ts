// Imports
import { Request, Response } from "express";
import { ArticlesService } from "../services/articlesService";
import { CommentsService } from "../services/commentsService";

// Exports - Déclarations
const articlesService = new ArticlesService();
const commentsService = new CommentsService();

/**
 * Création de la Class CommentsController :   
 * * création des méthodes pour récupérer, ajouter, modifier ou supprimer des Comments
 * * contrôle de la validité de la donnée entrante (reçue de l'utilisateur)
 * * à défaut, renvoie le code status et message correspondant à l'erreur rencontrée
 * * envoie de la donnée vers le CommentsService pour requête en BDD
 * * retour pour traitement en response
*/
export class CommentsController {
    // Contrôle la donnée entrante et envoie au CommentsService pour récupérer la liste de TOUS les Comments (quel que soit l'article - Utile pour les vérfifications) 
    async getAllComments(req: Request, res: Response) {
        try {
            const comments = await commentsService.selectAllComments();

            if (!comments) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Aucun comment disponible",
                    data: null
                });
            }

            else {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "Comments get",
                    data: comments
                });
            };
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur ou inconnue',
                data: null
            });
        };
    };

    // Contrôle la donnée entrante et envoie au CommentsService pour récupérer un Comment par son Id (Utile pour les vérifications)
    async getCommentById(req: Request, res: Response) {
        const comment_id = Number(req.params.id);

        try {
            const comment = await commentsService.selectCommentById(comment_id);

            if (!comment) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Comment Id inconnu",
                    data: null
                });
            }

            else {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "Comment get",
                    data: comment
                });
            };
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: "FAIL",
                message: "Erreur serveur ou inconnue",
                data: null
            });
        };
    };

    // Contrôle la donnée entrante et envoie au CommentsService pour récupérer la liste de TOUS les Comments d'un Article
    async getCommentsByArticleId(req: Request, res: Response) {
        const article_id = Number(req.params.id);

        try {
            const article = await articlesService.selectArticleByID(article_id);

            if (!article) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Article Id inconnu",
                    data: null
                });

                return;
            };

            const comments = await commentsService.selectCommentsByArticleId(article_id);

            if (!comments) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Aucun comment pour cet article",
                    data: null
                });

                return;
            };

            res.status(200).json({
                status: "SUCCESS",
                message: "Comments get",
                data: comments
            });
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur ou inconnue',
                data: null
            });
        };
    };
    /* async getCommentsByArticleId2(req: Request, res: Response) {
        const article_id = Number(req.params.id);

        try {
            const data = await commentsService.selectCommentsByArticleId(article_id);
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Comments get',
                data: data
            });
        }
        catch (err: any) {
            console.log(err.stack);
            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur ou inconnue',
                data: null
            })
        }
    }; */

    // Contrôle la donnée entrante et envoie au CommentsService pour ajouter un Comment
    async createComment(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const article_id = req.body.article_id;
        const message: string = req.body.message;

        if (!message && !(typeof (message) != 'string')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Message manquant ou Type de donnée incorrect (attendu 'String')",
                data: null
            });

            return;
        };

        if (!article_id && !(typeof (article_id) != 'number')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Article manquant ou Type de donnée incorrect (attendu 'Number')",
                data: null
            });

            return;
        };

        try {
            const verifArticleId = await articlesService.selectArticleByID(article_id);

            if (!verifArticleId) {
                res.status(400).json({
                    status: 'FAIL',
                    message: "L'article n'existe pas - Impossible de poster un commentaire",
                    data: null
                });

                return;
            };

            const data = await commentsService.addComment(message, user_idLogged, article_id);

            res.status(200).json({
                status: 'SUCCESS',
                message: 'Comment posted !',
                data: data
            });
        }
        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur ou inconnue',
                data: null
            });
        };
    };

    // Contrôle la donnée entrante et envoie au CommentsService pour modifier un Comment
    async updateComment(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const commentId = Number(req.params.id);
        const message: string = req.body.message;

        if (!message && !(typeof (message) != 'string')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Message manquant ou Type de donnée incorrect (attendu 'String')",
                data: null
            });

            return;
        };

        if (!commentId && !(typeof (commentId) != 'number')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Comment manquant ou Type de donnée incorrect (attendu 'Number')",
                data: null
            });

            return;
        };

        try {
            const verifCommentId = await commentsService.selectCommentById(commentId);

            if (!verifCommentId) {
                res.status(400).json({
                    status: 'FAIL',
                    message: "Id inconnu - Le commentaire n'existe pas",
                    data: null
                });

                return;
            };

            if (user_idLogged !== verifCommentId.user_id) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Update non autorisé - Vous n'êtes pas le propriétaire du commentaire",
                    data: null
                });

                return;
            };

            const updatedComment = await commentsService.updateComment(commentId, message);

            res.status(200).json({
                status: 'SUCCESS',
                message: 'Comment updated !',
                data: updatedComment
            });
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur ou inconnue',
                data: null
            });

        };
    };

    // Contrôle la donnée entrante et envoie au CommentsService pour supprimer un Comment
    async deleteComment(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const id = Number(req.params.id);

        if (!id && !(typeof (id) === 'number')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Id manquant ou Type de donnée incorrect (attendu 'Number')",
                data: null
            });

            return;
        };

        try {
            const comment = await commentsService.selectCommentById(id);

            if (!comment) {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Comment ID inconnu - Vérifier le numéro du commentaire",
                    data: null
                });

                return;
            };

            if (user_idLogged !== comment.user_id) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Delete non autorisé - Vous n'êtes pas le propriétaire du commentaire",
                    data: null
                });

                return;
            };

            const deleteComment = await commentsService.deleteComment(id);

            res.status(200).json({
                status: "SUCCESS",
                message: "Comment deleted",
                data: deleteComment
            });
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: "FAIL",
                message: "Erreur de serveur",
                data: null
            });
        };
    };
};