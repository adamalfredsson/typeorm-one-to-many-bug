import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";

createConnection()
  .then(async connection => {
    console.log("Inserting a new post into the database...");
    const post = await Post.create({
      title: "Some post"
    }).save();
    console.log("Saved a new post");

    console.log("Inserting a new user with comment into the database...");
    await User.create({
      firstName: "Timber",
      lastName: "Saw",
      age: 25,
      comments: [
        Comment.create({
          text: "Timbers comment",
          post
        })
      ]
    }).save();
    console.log("Saved a new user");

    console.log("Get user with posts");
    const user = await getRepository(User)
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.comments", "c")
      .getOne();

    console.log("Set user age");
    user.age = 29;

    console.log("Save user...");
    await user.save();
  })
  .catch(error => console.log(error));
