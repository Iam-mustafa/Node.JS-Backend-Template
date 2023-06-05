const user_repo = require('../repositories/User');
const factory = require('../seed/factory')

user_repo.find(true, {}, '_id').then(user => {
    if(!user){
            user_repo.create(factory.getUser())
                    .then(user => console.log('User Created!', user))
                    .catch(err => console.log('Error in Seed User Creation=> ', err));
    }
}).catch(err => console.log('Error in Finding user!', err));