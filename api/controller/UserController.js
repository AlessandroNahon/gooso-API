import Joi from "joi";
import bcrypt from "bcrypt";

import UserService from "../services/UserService";
import Util from "../utils/Utils";

const util = new Util();

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  };

  return Joi.validate(user, schema);
}

function setInvalidIdError(res) {
  util.setError(400, "Please input a valid numeric value");
  return util.send(res);
}

function setPassword(value) {
  return bcrypt.hashSync(value, 10);
}

class UserController {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await UserService.getAllUsers();
      if (allUsers.length > 0) {
        util.setSuccess(200, "Users retrieved", allUsers);
      } else {
        util.setSuccess(200, "No users found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;
    if (!Number(id)) setInvalidIdError(res);

    try {
      const user = await UserService.getUserById(id);

      if (!user) {
        util.setError(404, `Cannot find user with the id ${id}`);
      } else {
        util.setSuccess(200, "Found user", user);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async signup(req, res) {
    const { error } = validateUser(req.body);

    if (error) {
      util.setError(400, "Please provide all required details");
      // util.send(error.details[0].message);
    }

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: setPassword(req.body.password),
    };

    try {
      const createUser = await UserService.signup(user);
      util.setSuccess(201, "New user added!", createUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateUser(req, res) {
    const alteredUser = req.body;
    const { id } = req.params;
    if (!Number(id)) setInvalidIdError(res);

    try {
      const updateUser = await UserService.updateUserById(id, alteredUser);

      if (!updateUser) {
        util.setError(404, `Cannot find user with id: ${id}`);
      } else {
        util.setSuccess(200, "User updated", updateUser);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    if (!Number(id)) setInvalidIdError(res);

    try {
      const userToDelete = await UserService.deleteUser(id);

      if (userToDelete) {
        util.setSuccess(200, "User deleted");
      } else {
        util.setError(404, `User with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default UserController;
