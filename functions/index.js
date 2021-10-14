const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const stripe = require('stripe')('sk_test_51HHgxYJv1MhKMLcCaUbSDPOVMZ5g1FsuAB54SpLhNsCdzCd6yNzlGqTCJtKvD94MrYJJctlpVrvs5N1ev96fS4lw00dEsBHGZG');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


/* exports.payWithStripe = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        // your function body here - use the provided req and res from cors
    
        //response.set('Access-Control-Allow-Origin', '*');
        const stripe = require('stripe')('sk_test_51HHgxYJv1MhKMLcCaUbSDPOVMZ5g1FsuAB54SpLhNsCdzCd6yNzlGqTCJtKvD94MrYJJctlpVrvs5N1ev96fS4lw00dEsBHGZG');
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        console.log(request);
        // eslint-disable-next-line promise/catch-or-return
        stripe.charges.create({
            amount: request.query.amount,
            currency: request.query.currency,
            source: request.query.source,
            description: 'My First Test Charge (created for API docs)',
        }).then((charge) => {
                // asynchronously called
                return response.send(charge);
            })
            .catch(err =>{
                console.log(err);
            });

    })
    
}); */

exports.payWithStripe = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    req = JSON.parse(request.body);
    // eslint-disable-next-line promise/catch-or-return
    stripe.charges.create({
        amount: req.amount,
        currency: req.currency,
        source: req.token,
    }).then((charge) => {
            // asynchronously called
            return response.send(charge);
        })
        .catch(err =>{
            console.log(err);
        });
    })

});


exports.orderStatusChangeNotification = functions.database.ref('/orders/{orderId}').onUpdate((change, context) =>{

    const newStatus = change.after.status.val();
    const user = change.after.userId.val();

    const payload = {
        notification :{
            title:'Order Status'
        }
    }


    const db = admin.database();
    const deviceRef = db.collection('devices').where('userId','==' ,userId)

})
