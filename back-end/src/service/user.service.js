const connection = require("../config/database.config");

// update user function is not worked

exports.addNewUser = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO users SET ?", data, (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log("New user inserted successfully");
        resolve(results);
      }
    });
  });
};

exports.findAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users", (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          console.log("Users found successfully");
          resolve(results);
        } else {
          reject(new Error("User not found"));
        }
      }
    });
  });
};

exports.findUserById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users WHERE id = ?", id, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length > 0) {
          console.log("User found successfully");
          resolve(result);
        } else {
          reject(new Error("User not found"));
        }
      }
    });
  });
};

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      email,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            console.log("User found successfully");
            resolve(result);
          } else {
            reject(new Error("User not found"));
          }
        }
      }
    );
  });
};

exports.updateUser = (id, user) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET ? WHERE id = ?",
      [user, parseInt(id, 10)],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("User updated successfully");
          resolve(results);
        }
      }
    );
  });
};

exports.getUsersWithMostPosts = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT u.name AS name, u.email AS email, u.profilePicture AS profilePicture, COUNT(p.author) AS totalPosts
    FROM posts p
    JOIN users u ON p.author = u.id
    GROUP BY p.author, u.name, u.email, u.profilePicture
    ORDER BY totalPosts DESC
    LIMIT 5;`;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log("User updated successfully");
        resolve(results);
      }
    });
  });
};
