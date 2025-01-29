class HttpError extends Error{
    constructor(code, message){
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

const catchError = (err, req, res, next)=>{
    if(err instanceof HttpError){
        return res.status(err.code).json({
            error: {
                code: err.code,
                message: err.message
            }
        });
    }

    console.error(err);
    return res.status(500).json({
        error: {
            code: 500,
            message: "System error"
        }
    });
}

export {
    HttpError,
    catchError
}
