exports.getUser = () => {
    return {
        FirstName: 'Admin',
        LastName: 'Master',
        LoginID: 'admin',
        ContactNumber: '00112233',
        EmailIDs: 'abc@def.net',
        RoleTitle: 'Admin',
        CreationDetails: {
            ActionTakenOn: new Date(),
        },  
        password: 'Abc@123#!',
        StatusCode: 1, 
        IsMasterAdmin: true
    }
    // {
    //     "firstName":"Thomas Alexander",
    //     "middleNames":"Adrian",
    //     "lastName":"Smith"
    // }
}