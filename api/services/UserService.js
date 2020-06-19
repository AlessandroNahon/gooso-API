import db from "../../database/models";

class UserService {
  static async getAllUsers() {
    try {
      return await db.User.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await db.User.findOne({
        where: { id: Number(id) },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async signup(user) {
    try {
      return await db.User.create(user);
    } catch (error) {
      throw error;
    }
  }

  static async updateUserById(id, updateUser) {
    try {
      const userToUpdate = await db.User.findOne({
        where: { id: Number(id) },
      });

      if (userToUpdate) {
        await db.User.update(updateUser, { where: { id: Number(id) } });

        return updateUser;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const userToDelete = await db.User.findOne({ where: { id: Number(id) } });

      if (userToDelete) {
        const deleteUser = await db.User.destroy({
          where: { id: Number(id) },
        });

        return deleteUser;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
