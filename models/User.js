const mongoose = require("mongoose");
const uuidv1 = require("uuid").v1();
const Schema = mongoose.Schema;
var crypto = require("crypto");


const ActionDetails = {
  ActionTakenByName: { type: String },
  ActionTakenByID: { type: Schema.ObjectId },
  ActionTakenOn: { type: Date },
  ActionTakenByLoginID: { type: String },
};

const UserSchema = new Schema({
  FirstName: String,
  LastName: String,
  LoginID: {type: String, unique: true},
  ContactNumber: String,
  Email: String,
  ResidentialAddress: String,
  Role: String,
  CreationDetails: ActionDetails,  
  Salt: { type: String, required: true, default: uuidv1 },
  password: { type: String, required: true },
  StatusCode: Number, // 1 for active , 2 for delete
  LastUpdatedOn: Date,
  DeletionDetails: ActionDetails,
  UpdateDetails: ActionDetails,
  ForgotPasswordEmailSentTimeStamp: Date,
  ResetToken: String,  
  OrganizationID: { type: Schema.ObjectId },
  OrganizationName: String,
  Designation : String,
  Password_ResetToken: String,

});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual("token").get(function () {
  return {
    id: this._id,
    Role: this.Role
  };
});

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre("save", function (next) {
  // Handle new/update passwords

  if (!this.isModified("password")) {
    return next();
  }

  if (!validatePresenceOf(this.password)) {
    return next(new Error("Invalid password"));
  }

  // Make Salt with a callback
  this.makeSalt((saltErr, Salt) => {
    if (saltErr) {
      return next(saltErr);
    }
    this.Salt = Salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        console.log('Error in Encryption : ', err)
        return callback(err);
      }

      if (this.password === pwdGen) {
        console.log("With Call Back PWD Matched!");
        callback(null, true);
      } else {
        console.log("With Call Back PWD Does not Matched!");
        callback(null, false);
      }
    });
  },

  /**
   * Make Salt
   *
   * @param {Number} byteSize Optional Salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    console.log("Inside Salt Creation!!");
    var defaultByteSize = 16;

    if (typeof arguments[0] === "function") {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === "function") {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString("base64");
    }

    return crypto.randomBytes(byteSize, (err, Salt) => {
      if (err) {
        callback(err);
      } else {
        callback(null, Salt.toString("base64"));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.Salt) {
      if (!callback) {
        return null;
      } else {
        return callback("Missing password or Salt");
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var Salt = Buffer.from(this.Salt, "base64");

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, Salt, defaultIterations, defaultKeyLength)
        .toString("base64");
    }

    return crypto.pbkdf2(
      password,
      Salt,
      defaultIterations,
      defaultKeyLength,
      "sha1",
      (err, key) => {
        if (err) {
          callback(err);
        } else {
          callback(null, key.toString("base64"));
        }
      }
    );
  }
};

exports.getUserModel = mongoose.model("users", UserSchema);
