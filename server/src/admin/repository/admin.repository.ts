import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Admin } from '../entity/admin.entity';
import { RegisterAdminRequestDto } from '../dto/request/register-admin.dto';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(private dataSource: DataSource) {
    super(Admin, dataSource.createEntityManager());
  }

  async createAdmin(registerAdminDto: RegisterAdminRequestDto) {
    const { loginId, password } = registerAdminDto;
    const admin = this.create({
      loginId,
      password,
    });
    await this.save(admin);
    return admin;
  }
}
