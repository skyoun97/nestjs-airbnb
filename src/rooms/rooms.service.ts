import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { CustomRule, DetailChoice, RuleChoice } from './entities/rule.entity';
import { AmenityGroup, AmenityItem } from './entities/amenity.entity';
import { Photo } from '../common/entities/photo.entity';
import {
  CraeteAmenityItemDTO,
  CraeteAmenityGroupDTO,
} from './dto/create-amenity.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RuleChoice)
    private readonly ruleChoiceRepository: Repository<RuleChoice>,
    @InjectRepository(DetailChoice)
    private readonly detailChoiceRepository: Repository<DetailChoice>,
    @InjectRepository(CustomRule)
    private readonly customRuleRepository: Repository<CustomRule>,
    @InjectRepository(AmenityItem)
    private readonly AmenityItemRepository: Repository<AmenityItem>,
    @InjectRepository(AmenityGroup)
    private readonly AmenityGroupRepository: Repository<AmenityGroup>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(host: User, createRoomDto: CreateRoomDto): Promise<any> {
    const {
      countryId,
      photos,
      amenityItemIds,
      ruleChoices: _ruleChoices,
      customRules: _customRules,
      detailChoices: _detailChoices,
      ...rest
    } = createRoomDto;

    // TODO: CHECK Whether User is Host or not
    await this.photoRepository.insert(photos);
    const { identifiers: ruleChoices } = await this.ruleChoiceRepository.insert(
      _ruleChoices.map(({ ruleId, ...rest }) => ({
        rule: { id: ruleId },
        ...rest,
      })),
    );
    const { identifiers: customRules } = await this.customRuleRepository.insert(
      _customRules.map(title => ({ title })),
    );
    const {
      identifiers: detailChoices,
    } = await this.detailChoiceRepository.insert(
      _detailChoices.map(({ detailId, ...rest }) => ({
        detail: { id: detailId },
        ...rest,
      })),
    );

    const room = this.roomRepository.create({
      ...rest,
      host,
      country: { id: countryId },
      photos,
      ruleChoices,
      customRules,
      detailChoices,
      amenities: amenityItemIds.map(id => ({ id })),
    });
    return (await this.roomRepository.insert(room)).generatedMaps;
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    return await this.roomRepository.findOneOrFail(id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async findAllAmenities(): Promise<AmenityItem[]> {
    return await this.AmenityItemRepository.find();
  }

  async createAmenityItem(
    createAmentityDTO: CraeteAmenityItemDTO,
  ): Promise<AmenityItem> {
    return await this.AmenityItemRepository.save(createAmentityDTO);
  }

  async createAmenityGroup(
    createAmenityGroupDTO: CraeteAmenityGroupDTO,
  ): Promise<AmenityGroup> {
    return await this.AmenityGroupRepository.save(createAmenityGroupDTO);
  }
}
