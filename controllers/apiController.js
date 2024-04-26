const { Checkout } = require('checkout-sdk-node');
/*-------------------------------------*/
exports.checkoutAPI = async(req, res, next) =>{
    const cko = new Checkout('pk_sd5fr47pwdfcczsu5ngxfkym6mu',{
        pk:'52B7F348CFA448B37528C9F63F6AF09E'
    });

    const action = await cko.payments.capture().then(result =>{
        
    }).catch(err => console.log(err));

    res.status(200).json({
        message:'data',
        data:action,
        resultData:result
    });
};