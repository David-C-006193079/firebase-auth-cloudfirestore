const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


//auth trigger (new user signup)


exports.newUserSignup = functions.auth.user().onCreate(user => 
{

   return admin.firestore().collection('users').doc(user.uid).set(
    {
    
        email: user.email,
        upvotedOn: []

        
    });

});

exports.userDeleted = functions.auth.user().onDelete(user => 
{
    
    const doc = admin.firestore().collection('users').doc(user.uid);
    return doc.delete();

});

exports.addRequest = functions.https.onCall((data, context) =>
{

    if(!context.auth)
    {

        throw new functions.https.HttpsError(

           'unauthenticated', 
           'only authenicated users can add requests'
        
        );

    }

    if(data.text.length > 30)
    {

           throw new functions.https.HttpsError(

           'invalid-arguement', 
           'request must be no more than 30 characters long'
        
        );

    }

    return admin.firestore().collection('requests').add(
    {

        text: data.text,
        upvotes: 0, 
    
    });


});
