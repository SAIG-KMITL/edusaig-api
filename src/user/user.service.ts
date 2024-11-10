import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { FindOneOptions } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { hash } from "argon2";

@Injectable()
export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(options: FindOneOptions<User>): Promise<User> {
        const user = this.userRepository.findOne(options);
        if (!user)
            throw new NotFoundException("User not found");
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.userRepository.save(createUserDto);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            if (updateUserDto.password)
                updateUserDto.password = await hash(updateUserDto.password);
            await this.userRepository.update(id, updateUserDto);
            return await this.findOne({ where: { id } });
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException("User not found");
            }
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException("User not found");
            }
        }
    }
}