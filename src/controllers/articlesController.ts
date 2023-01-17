import { NextFunction, Request, Response } from "express";
import { ArticlesService } from "../services/articlesService";
import Article from "../types/articleType";
const articlesService = new ArticlesService()

export class ArticlesController {
    async getArticles(req: Request, res: Response)/* : Promise<Article[] | undefined> */ {
        try {
            const data = await articlesService.selectAllArticles();
            res.status(200).json({
                status: "SUCCESS",
                message: "Successfully !",
                data: data
            })
        }
        catch (err: any) {
            console.log(err.stack);
            res.status(400).json({
                status: "FAIL",
                message: "Erreur de syntaxe",
                data: null
            })
        }
    };
    async getArticleById(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);
        try {
            const data = await articlesService.selectArticleByID(id);
            res.status(200).json({
                status: "SUCCESS",
                message: "Article get",
                data: data
            });
            next();
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
    async updateArticle(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const article_id = req.params.id;
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
        else if (!article_id) {
            res.status(404).json({
                status: 'FAIL',
                message: "Article_id manquant",
                data: null
            })
        }
        else if (typeof (article_id) != 'number') {
            res.status(404).json({
                status: 'FAIL',
                message: "Type de donnée pour 'article_id' incorrect - Type attendu 'Number'",
                data: null
            })
        }
        else {
            const data = await articlesService.selectArticleByID(article_id);
            if (!data) {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Ticket ID inconnu - Vérifier le numéro du ticket",
                    data: null
                })
            }
            else if (user_idLogged !== data.user_id) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Delete non autorisé - Vous n'êtes pas le propriétaire de l'article",
                    data: null
                })
            }
            else {
                try {
                    const data = await articlesService.updateArticle(article_id, title, text);
                    res.status(200).json({
                        status: "SUCCESS",
                        message: "Article updated",
                        data: data
                    })
                }
                catch (err: any) {
                    console.log(err.stack);
                    res.status(500).json({
                        status: "FAIL",
                        message: "Erreur de serveur",
                        data: null
                    })
                }
            }
        }
    };
    async deleteArticle(req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const id = Number(req.params.id);
        if (!id) {
            res.status(400).json({
                status: 'FAIL',
                message: "id manquant",
                data: null
            })
        }
        else if (!(typeof (id) === 'number')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Le type de donnée attendu pour 'id' n'est pas conforme - Type attendu 'Number'",
                data: null
            })
        }
        else {
            const data = await articlesService.selectArticleByID(id);
            if (!data) {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Article ID inconnu - Vérifier le numéro du article",
                    data: null
                })
            }
            else if (user_idLogged !== data.user_id) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Delete non autorisé - Vous n'êtes pas le propriétaire de l'article",
                    data: null
                })
            }
            else {
                try {
                    const data = await articlesService.deleteArticle(id);
                    res.status(200).json({
                        status: "SUCCESS",
                        message: "Article deleted",
                        data: data
                    })
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
    };
};
