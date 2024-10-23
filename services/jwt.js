import jwt from "jwt-simple";
import moment from "moment"
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET_KEY;

const createToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }
    return jwt.encode(payload, secret);
}


export {
    secret,
    createToken,
}