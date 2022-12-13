import { errorMessage, notAuthorized } from "./message.mjs"

const response = (error,message,body) =>{
    return {
        error: error,
        message: message,
        body: body
    }
}

const errorResponse = (message) => {
    return {
        error: true,
        message: message,
        body: null
    }
}

const badRequest = (req, res) => {
    res.status(400).json(response(true, errorMessage(),null));
    res.end();
}

const forbidden = (req, res) => {
    res.status(403).json(response(true, errorMessage(),null));
    res.end();
}

const unauthorized = (req, res) => {
    res.status(401).json(response(true, notAuthorized(),null));
    res.end();
}




export {response}
export {errorResponse}
export {badRequest}
export {forbidden}
export {unauthorized}