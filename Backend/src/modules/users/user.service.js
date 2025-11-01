import { userModel } from "../../../Models/user.model.js";

const CreateUser = async({firstname , lastname , email , password}) => {
    if(!firstname || !lastname || !email || !password){
        throw new Error("All fields are required");
    }

    const user = userModel.create({
        fullname :{
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}

export {CreateUser}; 
