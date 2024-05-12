// USING PROMISES
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}


export {asyncHandler}

// Higher Order Functions
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => async() => {}

// USING TRY CATCH

// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message,
//         })
//     }
// } 