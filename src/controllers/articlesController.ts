import { Request, Response } from "express";
import { client } from "../client";
import { ArticlesService } from "../services/articlesService";
const articlesService = new ArticlesService()


export class ArticlesController {
    async getArticles(req: Request, res: Response) {
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
    async getArticleById(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const data = await articlesService.selectArticleByID(id);
            res.status(200).json({
                status: "SUCCESS",
                message: "Article get",
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
    };
    async createArticle(req: Request, res: Response) {
        const { title, text, user_id } = req.body;
        try {
            const data = await articlesService.addArticle(title, text, user_id);
            if ((title && text && user_id) && (data)) {
                res.status(201).json({
                    status: "SUCCESS",
                    message: "Article created",
                    data: data
                })
            }
            else {
                res.status(400).json({
                    status: "FAIL",
                    message: "Title or text article empty",
                    data: null
                })
            }
        }
        catch (err: any) {
            console.log(err.stack);
            res.status(500).json({
                status: "FAIL",
                message: "Erreur serveur",
                data: null
            })

        }
    };
    async updateArticle(req: Request, res: Response) {
        const user_idLogged = req.userId;
        const id = Number(req.params.id);
        const { title, text } = req.body;
        try {
            const data = await articlesService.updateArticle(id, title, text);
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
    };
    async deleteArticle(req: Request, res: Response) {
        const user_idLogged = req.userId;
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
                    message: "Ticket ID inconnu - Vérifier le numéro du ticket",
                    data: null
                })
            }
            else if (user_idLogged !== data['user_id']) {
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
