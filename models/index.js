const sequelize = require("../config/database");
const User = require("./User");
const Post = require("./Post");

// Define associations in a single place
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

const db = { sequelize, User, Post };

module.exports = db;
