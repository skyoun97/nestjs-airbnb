import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Room } from './room.entity';
@Entity()
export class Amenity extends CoreEntity {
  @Column()
  @IsString()
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  description: string;

  @ManyToMany(
    type => Room,
    room => room.amenities,
  )
  rooms: Room[];
}
