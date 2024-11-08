import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { FindOneOptions } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(option: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne(option);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.userRepository.save(createUserDto);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            await this.userRepository.update(id, updateUserDto);
            return await this.findOne({ where: { id } });
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException("User not found");
            }
        }
    }
}