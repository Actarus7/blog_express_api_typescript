import { Request, Response } from "express";
import { ArticlesService } from "../services/articlesService";
import { CommentsService } from "../services/commentsService";

const articlesService = new ArticlesService();
const commentsService = new CommentsService();

export class CommentsController {
    async getAllComments (req: Request, res: Response) {
        try {
            const data = await commentsService.selectAllComments();
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Comments get',
                data: data
            })
        }
        catch (err: any) {
            console.log(err.stack);
            res.status(500).json({
            status: 'FAIL',
            message: 'Erreur serveur ou inconnue',
            data: null
            })            
        }
    };
    async getCommentById (req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const data = await commentsService.selectCommentById(id);
            res.status(200).json({
                status: "SUCCESS",
                message: "Comment get",
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
    };
    async getCommentsByArticleId (req: Request, res: Response) {
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
    };
    async createComment (req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const article_id  = req.body.article_id;
        const message: string = req.body.message;
        
        if (!message) {
            res.status(400).json({
                status: 'FAIL',
                message: "Message manquant",
                data: null
            })
        }
        else if (typeof (message) != 'string') {
            res.status(400).json({
                status: 'FAIL',
                message: "Type de donnée incorrect pour 'Message' - Type attendu 'String'",
                data: null
            })
        }
        if (!article_id) {
            res.status(400).json({
                status: 'FAIL',
                message: "Article manquant",
                data: null
            })
        }
        else if (typeof (article_id) != 'number') {
            res.status(400).json({
                status: 'FAIL',
                message: "Type de donnée incorrect pour 'Article_id' - Type attendu 'Number'",
                data: null
            })
        }
        else {
            const verifArticleId = await articlesService.selectArticleByID(article_id);
            if (verifArticleId == undefined) {
                res.status(400).json({
                    status: 'FAIL',
                    message: "L'article n'existe pas - Impossible de poster un commentaire",
                    data: null
                })
            }
            else {
                try {
                    const data = await commentsService.addComment(message, user_idLogged, article_id);
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: 'Comment posted !',
                        data: data
                    })
                }
                catch (err: any) {
                    console.log(err.stack);
                    res.status(500).json({
                        status: 'FAIL',
                        message: 'Erreur serveur ou inconnue',
                        data: null
                    })
                    
                }
            }
        }
    };
    async updateComment (req: Request, res: Response) {
        const user_idLogged = Number(req.userId);
        const commentId = Number(req.params.id);
        const message: string = req.body.message;
        
        if (!message) {
            res.status(400).json({
                status: 'FAIL',
                message: "Message manquant",
                data: null
            })
        }
        else if (typeof (message) != 'string') {
            res.status(400).json({
                status: 'FAIL',
                message: "Type de donnée incorrect pour 'Message' - Type attendu 'String'",
                data: null
            })
        }
        else if (!commentId) {
            res.status(404).json({
                status: 'FAIL',
                message: "Article_id manquant",
                data: null
            })
        }
        else if (typeof (commentId) != 'number') {
            res.status(404).json({
                status: 'FAIL',
                message: "Type de donnée pour 'article_id' incorrect - Type attendu 'Number'",
                data: null
            })
        }
        else {
            const verifCommentId = await commentsService.selectCommentById(commentId);
            if (verifCommentId == undefined) {
                res.status(400).json({
                    status: 'FAIL',
                    message: "Id inconnu - Le commentaire n'existe pas",
                    data: null
                })
            }
            else if (user_idLogged !== verifCommentId.user_id) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Update non autorisé - Vous n'êtes pas le propriétaire du commentaire",
                    data: null
                })
            }
            else {
                try {
                    const data = await commentsService.updateComment(commentId, message);
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: 'Comment updated !',
                        data: data
                    })
                }
                catch (err: any) {
                    console.log(err.stack);
                    res.status(500).json({
                        status: 'FAIL',
                        message: 'Erreur serveur ou inconnue',
                        data: null
                    })
                    
                }
            }
        }
    };
    async deleteComment (req: Request, res: Response) {
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
            const data = await commentsService.selectCommentById(id);
            if (!data) {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Comment ID inconnu - Vérifier le numéro du commentaire",
                    data: null
                })
            }
            else if (user_idLogged !== data.user_id) {
                res.status(403).json({
                    status: 'FAIL',
                    message: "Delete non autorisé - Vous n'êtes pas le propriétaire du commentaire",
                    data: null
                })
            }
            else {
                try {
                    const data = await commentsService.deleteComment(id);
                    res.status(200).json({
                        status: "SUCCESS",
                        message: "Comment deleted",
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