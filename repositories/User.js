var UserModel = require("../models/User").getUserModel;

exports.create = function (user) {
  console.log(user)
  return UserModel.create(user);
};

exports.update = function (query, updates, multi) {
  if(multi){
    return UserModel.updateMany(query, updates);
  }
  else{
    return UserModel.updateOne(query, updates);
  }
};

exports.find = function (
  isSingle,
  query,
  selectParams,
  sortParams,
  limit,
  skip,
  isLeanNotRequired
) {
  if (isSingle) {
    if (isLeanNotRequired) {
      return UserModel.findOne(query)
        .select(selectParams || { password: false, Salt: false, ResetToken: false,  })
        .exec();
    }
    else {
      return UserModel.findOne(query)
        .select(selectParams || { password: false, Salt: false, ResetToken: false,  })
        .lean()
        .exec();
    }
  } 
  else {
    return UserModel.find(query)
      .select(selectParams || "")
      .sort(sortParams || "")
      .limit(limit || 0)
      .skip(skip || 0)
      .lean()
      .exec();

  }
};

exports.countUser = function (query) {
  return UserModel.count(query);
};

exports.aggregate = function (pipeline) {
  return UserModel.aggregate(pipeline);
};