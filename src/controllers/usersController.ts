// Imports
import { Request, Response } from "express";
import { UsersService } from "../services/usersService";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

// Exports - Déclarations
const usersService = new UsersService();
const accessTokenSecret = process.env.TOKEN_SECRET as string;


/**
 * Création de la Class UserController :   
 * * création des méthodes pour récupérer, ajouter ou logger un User
 * * contrôle de la validité de la donnée entrante (reçue de l'utilisateur)
 * * à défaut, renvoie le code status et message correspondant à l'erreur rencontrée
 * * envoie de la donnée vers le UsersService pour requête en BDD
 * * retour pour traitement en response
 */
export class UsersController {

    // Contrôle la donnée entrante et envoie au Service pour récupérer la liste de TOUS les Users
    async getUsers(req: Request, res: Response) {
        try {
            const data = await usersService.selectAllUsers();

            res.status(200).json({
                status: 'SUCCESS',
                message: 'Users get !',
                data: data
            });
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur',
                data: null
            });
        };
    };

    // Contrôle la donnée entrante (pas de création possible en cas de Username/Email déjà existant)
    // Permet in fine d'ajouter un User
    async register(req: Request, res: Response) {
        const { username, password, e_mail, lvl_admin } = req.body;

        const error = {
            statusCode: 400,
            message: '',
            status: 'FAIL',
            data: null
        };

        if (!username && !(typeof (username) === 'string')) {
            error.message = "Username manquant ou Type de donnée incorrect (attendu 'String')";
        }

        else if (!password && !(typeof (password) != 'string')) {
            error.message = "Password manquant ou Type de donnée incorrect (attendu 'String')";
        }

        else if (!e_mail && !(typeof (e_mail) != 'string')) {
            error.message = "Email manquant ou Type de donnée incorrect (attendu 'String')";
        }

        if (error.message) {
            res.status(error.statusCode).json({
                status: 'FAIL',
                message: error.message,
                data: null
            });

            return;
        };

        const isUsernameExists = await usersService.getUserByUsername(username);
        const isEmailExists = await usersService.getUserByEmail(e_mail);

        if (isUsernameExists != undefined) {
            error.message = "Username already exists";
        }

        else if (isEmailExists != undefined) {
            error.message = "E_mail already exists";
        }

        if (error.message) {
            res.status(error.statusCode).json({
                status: 'FAIL',
                message: error.message,
                data: null
            });

            return;
        };

        bcrypt.hash(password, 10, async (err, password) => {
            try {
                const data = await usersService.addUser(username, password, e_mail, lvl_admin);

                res.status(200).json({
                    status: 'SUCCESS',
                    message: 'User created !',
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
        });
    };

    // Contrôle la donnée entrante et vérifie l'authentification en comparant les mdp via bcrypt
    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        const error = {
            statusCode: 400,
            message: '',
            status: 'FAIL',
            data: null
        };

        if (!username && !(typeof (username) === 'string')) {
            error.message = "Username manquant ou Type de donnée incorrect (attendu 'String')";
        }

        else if (!password && !(typeof (password) != 'string')) {
            error.message = "Password manquant ou Type de donnée incorrect (attendu 'String')";
        }

        if (error.message) {
            res.status(error.statusCode).json({
                status: 'FAIL',
                message: error.message,
                data: null
            });

            return;
        };

        try {
            const data = await usersService.getUserByUsername(username);

            if (data === undefined) {
                res.status(400).json({
                    status: 'FAIL',
                    message: "Username unknown",
                    data: null
                });

                return;
            }

            const accessToken: string = jwt.sign({ userId: data.id }, accessTokenSecret);

            bcrypt.compare(password, data.password, async (err: any, result: boolean) => {

                if (result == true) {
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: 'Acces granted',
                        data: { token: accessToken, lvl_admin: data.lvl_admin }
                    });
                }

                else {
                    res.status(403).json({
                        status: 'FAIL',
                        message: 'Acces denied - Wrong password',
                        data: null
                    });
                };
            });
        }

        catch (err: any) {
            console.log(err.stack);

            res.status(500).json({
                status: 'FAIL',
                message: "Erreur serveur ou inconnue",
                data: null
            });
        };
    };
};