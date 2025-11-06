let UserModel = require('../models/users');

module.exports.userByID = async function (req, res, next) {
    try {
        let id = req.params.id;
        req.user = await UserModel.findOne({ _id: id }, '-hashed_password -salt');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getUser = async function (req, res, next) {
  try {
    res.json(req.user);

  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports.create = async function (req, res, next) {
  try {

    let user = req.body;

    let result = await UserModel.create(user);
    console.log(result);

    res.status(200);
    res.json(
      {
        success: true,
        message: "User created successfully.",
        user: result
      }
    );

  } catch (error) {
    console.log(error);
    next(error);
  }

}

module.exports.getAll = async function (req, res, next) {
  try {
    let list = await UserModel.find();

    res.json(list);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports.update = async function (req, res, next) {
  try {
    console.log(req.body);
    let updatedUser = UserModel(req.body);
    updatedUser._id = req.params.id;
    updatedUser.admin = false;

    let result = await UserModel.updateOne({ _id: req.params.id }, updatedUser);
    console.log(result);

    if (result.modifiedCount > 0) {
      res.status(200);
      res.json(
        {
          success: true,
          message: "User updated successfully."
        }
      );
    } else {
      throw new Error('User not updated. Are you sure it exists?')
    }

  } catch (error) {
    console.log(error);
    next(error);
  }
}


module.exports.remove = async function (req, res, next) {
  try {
    let result = await UserModel.deleteOne({ _id: req.params.id });
    console.log(result);

    if (result.deletedCount > 0) {
      res.status(200);
      res.json(
        {
          success: true,
          message: "User deleted successfully."
        }
      );
    } else {
      throw new Error('User not deleted. Are you sure it exists?')
    }

  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports.hasAuthorization = async function(req, res, next){
    console.log("Payload", req.auth);
    let authorized = req.auth && req.user && req.auth.username == req.user.username;

    if(!authorized){
        return res.status('403').json(
            {
                success: false,
                message: "User is not authorized"
            }
        )
    }
    next();
}


module.exports.setAdmin = async function (req, res, next) {
    try {
        // Check if the current user is admin. Only admins can set another admin.
        let authorized = await UserModel.findOne({ _id: req.auth.id }, 'admin');
        console.log("authorized", authorized.admin);

        if (!authorized.admin) {
            return res.status(403).json(
                {
                    success: false,
                    message: "User is not authorized"
                }
            )
        }
        else
        {
            // Update one single field.
            let result = await UserModel.updateOne({ _id: req.params.id }, {admin : true});
            console.log("setAdmin", result);
            if (result.modifiedCount > 0) {
                res.json(
                    {
                        success: true,
                        message: "User promoted successfully."
                    }
                );
            }
            else {
                // Express will catch this on its own.
                throw new Error('User not updated. Are you sure it exists?')
            }
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}
