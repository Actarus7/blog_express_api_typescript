// Imports
import { NextFunction, Request, Response } from "express";
import { ArticlesService } from "../services/articlesService";
import { CommentsService } from "../services/commentsService";
import { UsersService } from "../services/usersService";
import { IArticleWithComments } from "../types/articleType";

// Exports - Déclarations
const articlesService = new ArticlesService();
const commentsService = new CommentsService();
const usersService = new UsersService();

/**
 * Création de la Class ArticlesController :   
 * * création des méthodes pour récupérer, ajouter, modifier ou supprimer des Articles
 * * contrôle de la validité de la donnée entrante (reçue de l'utilisateur)
 * * à défaut, renvoie le code status et message correspondant à l'erreur rencontrée
 * * envoie de la donnée vers le ArticlesService pour requête en BDD
 * * retour pour traitement en response
*/
export class ArticlesController {

    // Contrôle la donnée entrante et envoie au ArticlesService pour récupérer la liste de TOUS les Articles (sans les Comments)
    async getArticles(req: Request, res: Response) {
        try {
            const articles = await articlesService.selectAllArticles();

            if (!articles) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Aucun article disponible",
                    data: null
                });
            }
            else {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "Articles get",
                    data: articles
                });
            }
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

    // Contrôle la donnée entrante et envoie au ArticlesService pour récupérer un Article par son Id (sans les Comments - Utile pour les vérifications)
    async getArticleById(req: Request, res: Response) {
        const article_id = Number(req.params.id);

        try {
            const article = await articlesService.selectArticleByID(article_id);

            if (!article) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Article Id inconnu",
                    data: null
                });
            }

            else {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "Article get",
                    data: article
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

    // Contrôle la donnée entrante et envoie au ArticlesService pour récupérer un Article par son Id avec TOUS les Comments associés
    async getArticleByIdWithComments(req: Request, res: Response) {
        const article_id = Number(req.params.id);

        try {
            const comments = await commentsService.selectCommentsByArticleId(article_id);
            const article = await articlesService.selectArticleByID(article_id);
            const result: IArticleWithComments = Object.assign({}, article, { comments: comments });

            if (!article) {
                res.status(400).json({
                    status: "FAIL",
                    message: "Article Id inconnu",
                    data: null
                });
            }
            else {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "Article get",
                    data: result
                });
            }
        }
        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: "FAIL",
                message: "Erreur serveur ou inconnue",
                data: null
            })
        }
    };

    // Contrôle la donnée entrante et envoie au ArticlesService pour ajouter un Article
    async createArticle(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const { title, text } = req.body;
        if (!title) {
            res.status(404).json({
                status: 'FAIL',
                message: "Title manquant",
                data: null
            })
        }
        else if (typeof (title) != 'string') {
            res.status(404).json({
                status: 'FAIL',
                message: "Type de donnée pour 'title' incorrect - Type attendu 'String'",
                data: null
            })
        }
        else if (!text) {
            res.status(404).json({
                status: 'FAIL',
                message: "Text manquant",
                data: null
            })
        }
        else if (typeof (text) != 'string') {
            res.status(404).json({
                status: 'FAIL',
                message: "Type de donnée pour 'text' incorrect - Type attendu 'String'",
                data: null
            })
        }
        else {
            try {
                const data = await articlesService.addArticle(title, text, user_idLogged);
                res.status(201).json({
                    status: "SUCCESS",
                    message: "Article created",
                    data: data
                })
            }
            catch (err: any) {
                console.log(err.stack);
                res.status(500).json({
                    status: "FAIL",
                    message: "Erreur serveur ou inconnue",
                    data: null
                })
            }
        }
    };

    // Contrôle la donnée entrante et envoie au ArticlesService pour modifier un Article
    async updateArticle(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const article_id = parseInt(req.params.id);
        const { title, text } = req.body;

        const error = {
            statusCode: 400,
            message: '',
            status: 'FAIL',
            data: null
        };

        if (!title && (typeof (title) != 'string')) {
            error.message = "Title manquant ou Type de donnée incorrect (attendu 'String')";
        }

        else if (!text && (typeof (text) != 'string')) {
            error.message = "Text manquant ou Type de donnée incorrect (attendu 'String')";
        }

        else if (!article_id && (typeof (article_id) != 'number')) {
            error.message = "Article_id manquant ou Type de donnée incorrect (attendu 'String')";
        };

        if (error.message) {
            res.status(error.statusCode).json({
                status: 'FAIL',
                message: error.message,
                data: null
            });

            return;
        }

        try {
            const checkArticle = await articlesService.selectArticleByID(article_id);
            const lvl_admin_user_id_logged = await usersService.getUserById(user_idLogged);

            if (!checkArticle) {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Ticket ID inconnu - Vérifier le numéro du ticket",
                    data: null
                });

                return;
            };

            if (!(user_idLogged === checkArticle.user_id) && !(lvl_admin_user_id_logged?.lvl_admin === 1)) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Delete non autorisé - Vous n'êtes pas le propriétaire de l'article et n'êtes pas admin",
                    data: null
                });

                return;
            };

            const article = await articlesService.updateArticle(article_id, title, text);

            res.status(200).json({
                status: "SUCCESS",
                message: "Article updated",
                data: article
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

    // Contrôle la donnée entrante et envoie au ArticlesService pour supprimer un Article
    async deleteArticle(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const delete_id = parseInt(req.params.id);

        // const error = {
        //     statusCode: 400,
        //     message: '',
        //     status: 'FAIL',
        //     data: null
        // }

        if (!delete_id && !(typeof (delete_id) === 'number')) {
            res.status(400).json({
                status: 'FAIL',
                message: "ID manquant ou Type de donnée incorrect (attendu 'Number')",
                data: null
            });

            return
        };

        try {
            const article = await articlesService.selectArticleByID(delete_id);
            const lvl_admin_user_id_logged = await usersService.getUserById(user_idLogged);

            if (!article) {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Article ID inconnu - Vérifier le numéro du article",
                    data: null
                });

                return
            }
            else if (!(user_idLogged === article.user_id) && !(lvl_admin_user_id_logged?.lvl_admin === 1)) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Delete non autorisé - Vous n'êtes pas le propriétaire de l'article et n'êtes pas admin",
                    data: null
                });

                return
            };

            await commentsService.deleteCommentsByArticleId(delete_id);
            const deleteArticle = await articlesService.deleteArticle(delete_id);

            res.status(200).json({
                status: "SUCCESS",
                message: "Article deleted",
                data: deleteArticle
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
