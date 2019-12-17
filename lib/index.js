const baseURL = "https://api.onepipe.io"
const axios = require('axios');
const md5 = require('md5');
let auth = ``
let client_secret_key = null;
let headers = {
    'Content-Type': `application/json`,
    Authorization: null,
    Signature: null
}
// let pinchangebody = {
//     "request_ref": reference,
//     "request_type": "prepaid pin change",
//     "auth": {
//         "type": "card",
//         "secure": "mvmNCW3wGFccEboOr6ZCI/gQ+0nzjDFrFKHy4RL5HP9AHctY1DktKbwiVzkJs8ZAzt1Jm3g2D0MV0PKR308XPBmYyy8onyBU",
//         "auth_provider": "Verve"
//     },
//     "transaction": {
//         "transaction_ref": reference,
//         "transaction_desc": "My narration",
//         "transaction_ref_parent": "",
//     "customer": {
//             "customer_ref": "2349066870818",
//             "firstname": "Akin",
//             "surname": "Olunloye",
//             "email": "roqak1@gmail.com",
//             "mobile_no": "2349066870818"
//         },
//         "details": {
//             "new_pin":"7272"
//         }
//     }
// }
// }
// let body ={
//     "request_ref":"0000000001",
//     "request_type":"charge",
//     "auth": {
//       "type": "token", 
//       "secure": "YKBOxtdD8kZHqG7JO0C9TZ"
//     },
//     "transaction": {
//       "amount": "10000",
//       "transaction_ref": "000001",
//       "transaction_desc": "Payment for services",
//       "transaction_ref-parent": "000001",
//       "customer":{
//           "customer_ref": "000001",
//           "firstname": "Kola",
//             "surname": "Eboe",
//           "email": "kolaebue@gmail.com",
//           "mobile_no": "2348009871412"
//       }
//     }
//   }
const generateRef = () => {
    let min = 10000000000000;
    let max = 99999999999999;
    let transRef = (Math.random() * (max - min) + min);
    transRef = Math.round(transRef);
    return transRef.toString();
}
const generateSignature = (ref, secret_key) => {
    return md5(`${ref};${secret_key}`);
}
module.exports = {
    headers: headers,
    config: (Authorization, secret_key, contentType = "application/json") => {
        client_secret_key = secret_key;
        headers.Authorization = `Bearer ${Authorization}`;
        // headers.Signature = Signature !== undefined? Signature : null;
        headers["Content-Type"] = contentType !== undefined ? contentType : `application/json`
    },
    getOnepipeHomeURL: async () => {
        try {
            const getHomeURL = await axios.get(baseURL)
            // console.log(getHomeURL)
            return getHomeURL.data
        } catch (error) {
            return 'Error getting home URL';
        }
    },
    charge: async (reference = generateRef()) => {
        headers.Signature = generateSignature(reference, client_secret_key);

        let body = {
            "request_ref": reference,
            "request_type": "charge",
            "auth": {
                "type": "token",
                "secure": "YKBOxtdD8kZHqG7JO0C9TZ"
            },
            "transaction": {
                "amount": "10000",
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "transaction_ref-parent": "000001",
                "customer": {
                    "customer_ref": "000001",
                    "firstname": "Kola",
                    "surname": "Eboe",
                    "email": "kolaebue@gmail.com",
                    "mobile_no": "2348009871412"
                }
            }
        }
        body.request_ref = reference;
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const onepipeCharge = await axios.post(`${baseURL}/v1/payments/advanced/charge`, body, {
                    headers
                })
                return onepipeCharge
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    query: async (transaction_ref) => {
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers!!';
            } else {
                const onepipeQuery = await axios.get(`${baseURL}/v1/payments/query/${transaction_ref}`, {
                    'headers': headers
                })
                return onepipeQuery.data
            }

        } catch (err) {
            console.log("///////////", headers)
            return err.response ? err.response.data : err;
            // return err
        }
    },
    validateOTP: async (body) => {
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                headers.Signature = md5(headers.Signature);
                const otpResult = await axios.post(`${baseURL}/v1/payments/otp`,
                    headers,
                    body)
                return otpResult
            }

        } catch (err) {
            return err.response ? err.response : err;
            // return err
        }
    },
    getScore: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "transaction": {
                "amount": "10000",
                "transaction_desc": "Payment for services",
                "transaction_ref": reference,
                "currency": "NGN",
                "algo_code": "90106",
                "customer": {
                    "customer_ref": "2348022221412",
                    "firstname": "Ope",
                    "surname": "Adeoye",
                    "email": "opeadeoye@gmail.com",
                    "mobile_no": "2348022221412"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/loans/score`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    airtime: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "request_type": "airtime",
            "auth": {
                "type": "card",
                "secure": "YKBOxtdD8kZHqG7JO0C9TZ"
            },
            "transaction": {
                "amount": "10000",
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "transaction_ref-parent": "000001",
                "customer": {
                    "customer_ref": "000001",
                    "firstname": "Kola",
                    "surname": "Eboe",
                    "email": "kolaebue@gmail.com",
                    "mobile_no": "2348009871412"
                }
            }
        }
        body.request_ref = reference;
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const onepipeCharge = await axios.post(`${baseURL}/v1/payments/basic`, body, {
                    headers
                })
                return onepipeCharge
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    bills: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "request_type": "bill-payment",
            "auth": {
                "type": "card",
                "secure": "YKBOxtdD8kZHqG7JO0C9TZ"
            },
            "transaction": {
                "amount": "10000",
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "transaction_ref-parent": "000001",
                "customer": {
                    "customer_ref": "000001",
                    "firstname": "Kola",
                    "surname": "Eboe",
                    "email": "kolaebue@gmail.com",
                    "mobile_no": "2348009871412"
                }
            }
        }
        body.request_ref = reference;
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const onepipeCharge = await axios.post(`${baseURL}/v1/payments/basic`, body, {
                    headers
                })
                return onepipeCharge
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    bvn: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "request_type": "bvn_lookup",
            "auth": {
                "type": null,
                "secure": null,
                "auth_provider": "SunTrust"
            },
            "transaction": {
                "amount": null,
                "transaction_ref": reference,
                "transaction_desc": "My narration",
                "transaction_ref_parent": null,
                "customer": {
                    "customer_ref": "2349066870818",
                    "firstname": "Akin",
                    "surname": "Olunloye",
                    "email": "roqak1@gmail.com",
                    "mobile_no": "2349066870818"
                },
                "details": {
                    "bvn": "22534430922",
                    "otp_validation": false
                }
            }
        }
        body.request_ref = reference;
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const myBVN = await axios.post(`${baseURL}/v1/generic/transact`, body, {
                    headers
                })
                return myBVN
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    accountInfo: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "transaction": {
                "account_number": "6234784766",
                "bank_code": "070",
                "customer": {
                    "customer_ref": "6234784766",
                    "firstname": "Ope",
                    "surname": "Adeoye",
                    "email": "opeadeoye@gmail.com",
                    "mobile_no": "2349066870818"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/lookup/accountinfo`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    linkedCard: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "customer": {
                "customer_ref": "6234784766",
                "firstname": "Ope",
                "surname": "Adeoye",
                "email": "opeadeoye@gmail.com",
                "mobile_no": "2349066870818"
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers.Signature === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/lookup/cards`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    getLoanOffers: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "transaction": {
                "amount": "200",
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "service_type": "MONEY",
                "customer": {
                    "customer_ref": "2348022221412",
                    "firstname": "Ope",
                    "surname": "Adeoye",
                    "email": "opeadeoye@gmail.com",
                    "mobile_no": "2348022221412"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/loans/offers`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    acceptLoanOffer: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "auth": {
                "type": "card",
                "secure": "{{auth.secure}}"
            },
            "transaction": {
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "offer_id": "7DN3000",
                "provider_code": "CVS",
                "account_number": "0723506902",
                "bank_code": "044",
                "customer": {
                    "customer_ref": "2348022221412",
                    "firstname": "Ope",
                    "surname": "Adeoye",
                    "email": "opeadeoye@gmail.com",
                    "mobile_no": "2348022221412"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/loans/accept`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    loanStatus: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "transaction": {
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "customer": {
                    "customer_ref": "2348022221412",
                    "firstname": "Ope",
                    "surname": "Adeoye",
                    "email": "opeadeoye@gmail.com",
                    "mobile_no": "2348022221412"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/loans/status`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    disbursement: async (reference = generateRef()) => {
        let body = {
            "request_ref": reference,
            "request_type": "disbursement",
            "auth": {
                "type": null,
                "secure": null,
                "auth_provider": "SunTrust"
            },
            "transaction": {
                "amount": "500",
                "transaction_ref": reference,
                "transaction_desc": "Payment for services",
                "transaction_ref_parent": null,
                "customer": {
                    "customer_ref": "2348022221412",
                    "firstname": "Ope",
                    "surname": "Adeoye",
                    "email": "opeadeoye@gmail.com",
                    "mobile_no": "2348022221412"
                },
                "details": {
                    "destination_account": "2260730613",
                    "destination_bank_code": "057",
                    "processed_with": "nip"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/generic/transact`, body, {
                    headers
                })
                return result
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    encryptCard: async (pan, cvv, expdate, pin) => {
        let body = {
            "pan": "",
            "cvv": "",
            "expdate": "",
            "pin": "",
            "secret": client_secret_key
        }
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers!!';
            } else {
                const encryptedDetails = await axios.post(`${baseURL}/v1/utilities/encryptcard`, body, {
                    'headers': headers
                })
                return encryptedDetails.data
            }

        } catch (err) {
            console.log("///////////", headers)
            return err.response ? err.response.data : err;
            // return err
        }
    },
    encryptToken: async (token, reference = generateRef()) => {
        let body = {
            "request-ref": reference,
            "token": token,
            "secret": client_secret_key
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null) {
                throw 'Error!!! check your headers!!';
            } else {
                const encryptedDetails = await axios.post(`${baseURL}/v1/utilities/encrypttoken`, body, {
                    'headers': headers
                })
                return encryptedDetails.data
            }

        } catch (err) {
            console.log("///////////", headers)
            return err.response ? err.response.data : err;
            // return err
        }
    },
    prepaidCardIssue: async (reference = generateRef()) => {

        let body = {
            "request_ref": reference,
            "request_type": "prepaid card issue",
            "auth": {
                "type": "card",
                "secure": null,
                "auth_provider": "Verve"
            },
            "transaction": {
                "transaction_ref": reference,
                "transaction_desc": "My narration",
                "customer": {
                    "customer_ref": "2349066870818",
                    "firstname": "Akin",
                    "surname": "Olunloye",
                    "email": "roqak1@gmail.com",
                    "mobile_no": "2349066870818"
                },
                "details": {
                    "name_on_card": "Akinkunmi Abdulroqeeb Olunloye",
                    "address_line_1": "Alagbole",
                    "address_line_2": "Berger",
                    "address_city": "Lagos",
                    "address_state": "Lagos",
                    "address_postal_code": "100216",
                    "address_country_code": "NG",
                    "card_currency_code": "NGN",
                    "card_default_pin": "1234"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/generic/transact`, body, {
                    headers
                })
                return result.data
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    prepaidPinChange: async (reference = generateRef())=>{
        let body = {
            "request_ref": reference,
            "request_type": "prepaid pin change",
            "auth": {
                "type": "card",
                "secure": "mvmNCW3wGFccEboOr6ZCI/gQ+0nzjDFrFKHy4RL5HP9AHctY1DktKbwiVzkJs8ZAzt1Jm3g2D0MV0PKR308XPBmYyy8onyBU",
                "auth_provider": "Verve"
            },
            "transaction": {
                "transaction_ref": reference,
                "transaction_desc": "My narration",
                "transaction_ref_parent": "",
                "customer": {
                    "customer_ref": "2349066870818",
                    "firstname": "Akin",
                    "surname": "Olunloye",
                    "email": "roqak1@gmail.com",
                    "mobile_no": "2349066870818"
                },
                "details": {
                    "new_pin":"7272"
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/generic/transact`, body, {
                    headers
                })
                return result.data
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    prepaidBalance:async (reference = generateRef())=>{
        let body = {
            "request_ref": reference,
            "request_type": "prepaid balance",
            "auth": {
                "type": "card",
                "secure": "mvmNCW3wGFccEboOr6ZCI/gQ+0nzjDFrFKHy4RL5HP9AHctY1DktKbwiVzkJs8ZAzt1Jm3g2D0MV0PKR308XPBmYyy8onyBU",
                "auth_provider": "Verve"
            },
            "transaction": {
                "transaction_ref": reference,
                "transaction_desc": "My narration",
                "transaction_ref_parent": "",
                "customer": {
                    "customer_ref": "2349066870818",
                    "firstname": "Akin",
                    "surname": "Olunloye",
                    "email": "roqak1@gmail.com",
                    "mobile_no": "2349066870818"
                },
                "details": {
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/generic/transact`, body, {
                    headers
                })
                return result.data
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    },
    prepaidReissue: async (reference = generateRef())=>{
        let body = {
            "request_ref": reference,
            "request_type": "prepaid pin re-issue",
            "auth": {
                "type": "card",
                "secure": "mvmNCW3wGFccEboOr6ZCI/gQ+0nzjDFrFKHy4RL5HP9AHctY1DktKbwiVzkJs8ZAzt1Jm3g2D0MV0PKR308XPBmYyy8onyBU",
                "auth_provider": "Verve"
            },
            "transaction": {
                "transaction_ref": reference,
                "transaction_desc": "My narration",
                "customer": {
                    "customer_ref": "2349066870818",
                    "firstname": "Akin",
                    "surname": "Olunloye",
                    "email": "roqak1@gmail.com",
                    "mobile_no": "2349066870818"
                },
                "details": {
                }
            }
        }
        headers.Signature = generateSignature(reference, client_secret_key);
        try {
            if (headers.Authorization === null || headers["Content-Type"] === null || headers.Signature === null) {
                throw 'Error!!! check your headers';
            } else {
                console.table(headers)
                const result = await axios.post(`${baseURL}/v1/generic/transact`, body, {
                    headers
                })
                return result.data
            }

        } catch (err) {
            return err.response ? err.response.data : err;
        }
    }
}