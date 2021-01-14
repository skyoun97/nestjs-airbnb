import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, JoinTable, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';

export class Message extends CoreEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(
    type => User,
    user => user.messages,
  )
  sender: User;

  @ManyToOne(
    type => Conversation,
    conversation => conversation.messages,
  )
  conversation: Conversation;
}