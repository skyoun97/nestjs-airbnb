import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Photo extends CoreEntity {
  @Column()
  @IsString()
  url: string;

  @Column({ nullable: true })
  @IsString()
  caption: string;

  // Inver Side Relation
  @ManyToOne(
    type => Room,
    room => room.photos,
    { nullable: true },
  )
  room: Room;
}
