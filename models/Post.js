const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: true }
);

module.exports = Post;
