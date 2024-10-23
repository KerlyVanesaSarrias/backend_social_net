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
    try{
        const userId = req.params.id;
        
        if(!req.user || !req.eser.userId) {
            return res.status(401).send({
                status: "success",
                message: "usuario no autenticado"
            })
        }

        const userProfile = await User.findById(userId).select("-password -role -email -_v")
        if(!userProfile) {
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