import User from "../models/users.js"
import bcrypt from "bcrypt";
import { createToken } from "../services/jwt.js";

export const testUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde el controlador de Usuarios"
    });
};

export const register = async (req, res) => {
    try {
        let params = req.body;
        if (!params.name || !params.last_name || !params.nick || !params.email || !params.password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        let user_to_save = new User(params);

        const existingUser = await User.findOne({
            $or: [
                { email: user_to_save.email.toLowerCase() },
                { nick: user_to_save.nick.toLowerCase() }
            ]
        })
        if (existingUser) {
            return res.status(409).send({
                status: "error",
                message: "El usuario ya existe"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_to_save.password, salt);
        user_to_save.password = hashedPassword;

        await user_to_save.save();

        return res.status(200).json({
            status: "created",
            message: "Registro de usuario exitoso"
        });
    } catch (error) {
        console.log("Error en el registro de usuario: ", error);

        return res.status(500).send({
            status: "error",
            message: "Error en el registro de usuario"
        });
    }
};

export const login = async (req, res) => {
    try {
        let params = req.body;
        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "faltan datos por enviar"
            });
        }
        const userBD = await User.findOne({ email: params.email.toLowerCase() });
        if (!userBD) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe"
            })
        }

        const validPassword = await bcrypt.compare(params.password, userBD.password);
        if (!validPassword) {
            return res.status(401).send({
                status: "error",
                message: "Contraseña incorrecta"
            })
        }

        const token = createToken(userBD);

        return res.status(200).json({
            status: "success",
            message: "Autenticación exitosa",
            token,
            userBD: {
                id: userBD._id,
                name: userBD.name,
                last_name: userBD.last_name,
                email: userBD.email,
                nick: userBD.nick,
                image: userBD.image
            }
        });

    } catch (error) {
        console.log("Error en la autenticación del usuario: ", error);
        return res.status(500).send({
            status: "error",
            message: "Error en la autenticación del usuario"
        });
    }
};

export const profile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!req.user || !req.eser.userId) {
            return res.status(401).send({
                status: "success",
                message: "usuario no autenticado"
            })
        }

        const userProfile = await User.findById(userId).select("-password -role -email -_v")
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            })
        }
        return res.estatus(200).json({
            status: "success",
            message: "Perfil del usuario",
        })
    } catch {
        console.log('Error en la obtención del perfil del usuari')
        return res.status(500).send({
            status: "error",
            message: "Error en la obtención del perfil del usuario"
        })
    }
}

export const listUsers = async (req, res) => {
    try {
        let page = req.params.page ? parseInt(req.params.page, 10) : 1;
        let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 4;
        const options = {
            page: page,
            limit: itemsPerPage,
            select: "-password -role -email -_v"
        }
        const users = await User.paginate({}, options)

        if (!users || users.docs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Lista de usuarios",
            users: users.docs,
            totalDocs: users.totalDocs,
            totalPages: users.totalPages,
            currentPage: users.page
        });

    } catch (error) {
        console.log('Error en la obtención de usuarios')
        return res.status(500).send({
            status: "error",
            message: "Error en la obtención de usuarios"
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        let userIdentity = req.user;  
        let userToUpdate = req.body;  

        delete userToUpdate.iat;
        delete userToUpdate.exp;
        delete userToUpdate.role;

        const users = await User.find({
            $or: [
                { email: userToUpdate.email },
                { nick: userToUpdate.nick }
            ]
        }).exec();

        const isDuplicateUser = users.some(user => {
            return user && user._id.toString() !== userIdentity.userId;
        });

        if (isDuplicateUser) {
            return res.status(400).send({
                status: "error",
                message: "Error, solo se puede actualizar los datos del usuario logueado"
            });
        }

        if (userToUpdate.password) {
            try {
                let pwd = await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = pwd;
            } catch (hashError) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al cifrar la contraseña"
                });
            }
        } else {
            delete userToUpdate.password;
        }

        let userUpdated = await User.findByIdAndUpdate(userIdentity.userId, userToUpdate, { new: true });

        if (!userUpdated) {
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar el usuario"
            });
        };

        return res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: userUpdated
        });

    } catch (error) {
        console.log("Error al actualizar los datos del usuario: ", error);
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar los datos del usuario"
        });
    }
};

