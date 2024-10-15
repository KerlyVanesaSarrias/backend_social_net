import { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const UserShema = Schema({
    name: {
        type:String,
        require:true,
    },
    lastName: {
        type:String,
        require:true,
    },
    nick: {
        type:String,
        require:true,
        unique:true
    },
    email: {
        type:String,
        require:true,
        unique:true
    },

    bio: String,

    password: {
        type:String,
        require:true,
    },
    role: {
        type:String,
        default: 'role_user',
    },
    image: {
        type:String,
        default: 'default_user.png'
    },
    created_at:{
        type:String,
        default:Date.now
    }

});

UserShema.plugin(mongoosePaginate)

export default model('User', UserShema, "users");

