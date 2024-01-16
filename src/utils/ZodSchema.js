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