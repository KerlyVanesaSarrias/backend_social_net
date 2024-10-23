import moment from "moment";
import { secret} from "../services/jwt.js";
import jwt from "jwt-simple"



export const ensureAuth = (req, res, next ) => {
    if (!req.headers.authorization) {
        return res.status(404).send({
            satus: "error",
            message: "No token provided"
        })
    }

    const token = req.headers.authorization.replace(/['"]+/g).replace('Bearer',"");

    try {
        let payload = jwt.decode(token, secret);
        if(payload.exp <= moment.unix() ) {
            return res.status(401).send({
                status: "error",
                message: "Token has expired"
            })
        }
        req.user = payload;
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Invalid token"
        })
    }
    next();
}