const query = async (transaction_ref)=>{
    try{
        // console.log(transaction_ref)
        if(headers.Authorization === null|| headers["Content-Type"] === null){
            throw 'Error!!! check your headers';
        }else{
            // headers.Signature = md5(headers.Signature);
            // headers.Authorization = `Bearer 86q0JwHVMfstEcpe0olO_dd21a36fba3042b3a409b5ee688c0338`
            // headers.Authorization = auth
            const onepipeQuery = await axios.get(`${baseURL}/v1/payments/query/${transaction_ref}`,
            {'headers':headers})
            return onepipeQuery.data
        }
       
    } catch (err){
        console.log("///////////",headers)
        return err.response ? err.response.data : err;
        // return err
    }
}

module.exports = query;