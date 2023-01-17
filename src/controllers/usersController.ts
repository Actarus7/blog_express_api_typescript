import { Request, Response } from "express";
import { UsersService } from "../services/usersService";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
const usersService = new UsersService();
const accessTokenSecret = process.env.TOKEN_SECRET as string;


export class UsersController {
    async getUsers(req: Request, res: Response) {
        try {
            const data = await usersService.selectAllUsers();
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Users get !',
                data: data
            })
        }
        catch (err: any) {
            console.log(err.stack);
            res.status(500).json({
                status: 'FAIL',
                message: 'Erreur serveur',
                data: null
            })

        }
    };
    async register(req: Request, res: Response) {
        const { username, password, e_mail, lvl_admin } = req.body;
        const data = await usersService.getUserByUsername(username);
        if (!username) {
            res.status(400).json({
                status: 'FAIL',
                message: "Username manquant",
                data: null
            })
        }
        else if (!password) {
            res.status(400).json({
                status: 'FAIL',
                message: "Password manquant",
                data: null
            })
        }
        else if (!e_mail) {
            res.status(400).json({
                status: 'FAIL',
                message: "E_mail manquant",
                data: null
            })
        }
        else if (!(username === 'string') && !(password === 'string') && !(e_mail == 'string')) {
            res.status(400).json({
                status: 'FAIL',
                message: "Type de donnée incorrect pour 'Username' - Type attendu 'String'",
                data: null
            })
        }
        else if (data.username) {
            res.status(400).json({
                status: 'FAIL',
                message: "Username already exists",
                data: null
            })
        }
        else if (data.e_mail) {
            res.status(400).json({
                status: 'FAIL',
                message: "E_mail already exists",
                data: null
            })
        }
        else {
            bcrypt.hash(password, 10, async (err, password) => {
                try {
                    const data = await usersService.addUser(username, password, e_mail, lvl_admin);
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: 'User created !',
                        data: data
                    })
                }
                catch (err: any) {
                    console.log(err.stack);
                    res.status(500).json({
                        status: 'FAIL',
                        message: 'Erreur serveur',
                        data: null
                    })
                }
            })
        }
    };
    async login(req: Request, res: Response) {
        const { username, password } = req.body
        try {
            const data = await usersService.getUserByUsername(username);
            const accessToken = jwt.sign({ userId: data.id }, accessTokenSecret);
            
            if (data != undefined) {
                bcrypt.compare(password, data.password, async (err: any, result: boolean) => {
                    //console.log(result);

                    if (result == true) {
                        res.status(200).json({
                            status: 'SUCCESS',
                            message: 'Acces granted',
                            data: accessToken
                        })
                    }
                    else {
                        res.status(403).json({
                            status: 'FAIL',
                            message: 'Acces denied',
                            data: null
                        })
                    }
                })
            }
            else {
                res.status(404).json({
                    status: 'FAIL',
                    message: "Username inexistant",
                    data: null
                })
            }
        }
        catch (err: any) {
            console.log(err.stack);
        }

    };

}