import {z} from 'zod';

export function validateObjectId(obj) {
    // Define a schema for MongoDB _id
    console.log(obj);
    const objectIdSchema = z.object({
        _id: z.string({message : 'Id is required'}).refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
            message: 'Invalid question _id format',
        }),
    });
    const result = objectIdSchema.safeParse(obj);
    console.log(JSON.stringify(result));
    let response = {};
    if(!result.success){
        response = {message: result.error.errors[0].message, success: false}
    }
    else{
        response = {
            data : result.data,
            success : true
        }
    }
    return response;
}

export function validateSignUpInputs(obj){
    const objectSchema = z.object({
        username : z.string({
            required_error: "User Name is required",
            invalid_type_error: "User Name must be a string",
        })
        .min(5, {
            message : "User Name must be at least 5 characters long"
        })
        .trim(),

        email : z.string({
            required_error: "Email is required"
        }).email({ 
            message: "Invalid email address"
         }).trim(),

         password : z.string()
         .min(8, "Password must be at least 8 characters long")
         .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number"),

         confirmpassword : z.string()
         .min(8, "Password must be at least 8 characters long")
         .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!#%*?&]+$/, "Confirm Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number"),
    })

    const result = objectSchema.safeParse(obj);
    console.log("result of signup zod validation : ", result);

    let response = {};
    if(!result.success){
        response = {message: result.error.errors[0].message, success: false}
    }
    else{
        response = {
            data : result.data,
            success : true
        }
    }
    return response;

}