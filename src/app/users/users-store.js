class UserStore {
  constructor(db) {
    this.db = db;
  }

  async getUserByUUID(uuid) {
    return await this.db('users')
      .select()
      .where('UUID', uuid)
      .first();
  }

  async getAllUsers() {
    return await this.db('users')
      .select();
  }

  async getUsername(username) {
    return await this.db('users')
      .where('username', username)
      .first();
  }

  async registerUser(user, hash) {
    return await this.db('users')
    .insert({
      USERNAME: user.username,
      PASSWORD: hash,
      FIRSTNAME: user.firstname,
      LASTNAME: user.lastname,
      EMAIL: user.email,
      ROLE: user.role
    });
  }

  async updateUser(uuid, user, hash) {
    return await this.db('users')
      .where('UUID', uuid)
      .update({
        USERNAME: user.username,
        PASSWORD: hash,
        FIRSTNAME: user.firstname,
        LASTNAME: user.lastname,
        EMAIL:user.email,
        ROLE: user.role
      });
  }


  async createLogs(uuid) {
    await this.db('users_logs')
      .insert({
        created_acc_at: this.db.fn.now(),
        user_id: uuid
      });
  }


  async updateLogs(uuid) {
    await this.db('users_logs')
      .where({user_id: uuid})
      .update({updated_acc_at: this.db.fn.now()})
  }

  
  async loginLogs(uuid) {
    await this.db('users_logs')
      .where({user_id: uuid})
      .update({logged_in_at: this.db.fn.now()})
  }


  async deleteUser(uuid) {
    return await this.db('users')
      .where('UUID', uuid)
      .del();
  }
}

module.exports = UserStore;