export const asyncHandler = (callBack)=>{
    return (req, res, next)=>{
        Promise.resolve(callBack(req, res, next)).catch((err)=>next(err));
    }
}