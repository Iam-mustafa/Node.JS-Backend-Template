const user_repo = require('../repositories/User');

exports.create = async (request, reply) => {
    try {
        const ActionDetails = {
          ActionTakenByName: `${request?.user?.FirstName} ${request?.user?.LastName}`,
          ActionTakenByID: request?.user?._id,
          ActionTakenOn: new Date(),
          ActionTakenByLoginID: request?.user?.Login_ID,
        };
        console.log("sdfghjk")
        const user = request.body;
        user['CreationDetails'] = ActionDetails;
        // user['Status'] = true;
        console.log(user,"fghj")
        const newUser = await user_repo.create(user);

        // reply.code(201).send({data:newUser,status: true,message: 'Success in Update'});
        reply.status(200).json({data: newUser, message: "Successfully Created User!", status: true})
      } catch (e) {
        // reply.status(500).send(e);
        console.log(e,"dffgg")
        reply.status(500).json({message:e, status: false})
      }
}
