import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryColumn()
  postId: string;

  @PrimaryColumn()
  userId: string;

  @Column()
  text: string;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @ManyToOne(() => User, user => user.comments)
  user: User;
}
