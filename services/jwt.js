import jwt from "jwt-simple";
import moment from "moment"

const secret = 'SECRET_KEY_PROJECT_SoCiAl_Net';

const createToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }
}
return jwt.encode(payload, secret);

export {
    secret,
    createToken,
    
}