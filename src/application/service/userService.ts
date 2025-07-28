import { UserRepository } from '../../domain/interfaces/userRepository';
import { User } from '../../domain/entities/user';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(name: string): Promise<User> {
    const user = await this.userRepository.create({ name });
    return user;
  }
}