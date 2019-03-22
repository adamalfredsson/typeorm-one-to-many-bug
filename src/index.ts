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

    /**
    
    {
        QueryFailedError: duplicate key value violates unique constraint "PK_7b79aec4c8b4b2b936306016964"
            at new QueryFailedError (/Users/Adam/Projects/typeorm-one-to-many-insert/src/error/QueryFailedError.ts:9:9)
            at Query.callback (/Users/Adam/Projects/typeorm-one-to-many-insert/src/driver/postgres/PostgresQueryRunner.ts:176:30)
            at Query.handleError (/Users/Adam/Projects/typeorm-one-to-many-insert/node_modules/pg/lib/query.js:142:17)
            at Connection.connectedErrorMessageHandler (/Users/Adam/Projects/typeorm-one-to-many-insert/node_modules/pg/lib/client.js:183:17)
            at Connection.emit (events.js:197:13)
            at Connection.EventEmitter.emit (domain.js:481:20)
            at Socket.<anonymous> (/Users/Adam/Projects/typeorm-one-to-many-insert/node_modules/pg/lib/connection.js:125:12)
            at Socket.emit (events.js:197:13)
            at Socket.EventEmitter.emit (domain.js:481:20)
            at addChunk (_stream_readable.js:288:12)
        message: 'duplicate key value violates unique constraint "PK_7b79aec4c8b4b2b936306016964"',
        name: 'QueryFailedError',
        length: 241,
        severity: 'ERROR',
        code: '23505',
        detail: 'Key ("postId", "userId")=(1, 1) already exists.',
        hint: undefined,
        position: undefined,
        internalPosition: undefined,
        internalQuery: undefined,
        where: undefined,
        schema: 'public',
        table: 'comment',
        column: undefined,
        dataType: undefined,
        constraint: 'PK_7b79aec4c8b4b2b936306016964',
        file: 'nbtinsert.c',
        line: '535',
        routine: '_bt_check_unique',
        query:
        'INSERT INTO "comment"("postId", "userId", "text") VALUES ($1, $2, $3)',
        parameters: [ 1, 1, 'Timbers comment' ]
    }
    
     */
  })
  .catch(error => console.log(error));
