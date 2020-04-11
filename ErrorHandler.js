function getErrorResponse(error){
    let response = error != null ? (error.stack != undefined ? error.stack.split('\n')[0] : error) || error : 'Solvable Error'
    return response;
}

module.exports = {getErrorResponse}