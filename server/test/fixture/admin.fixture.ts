import { Admin } from '../../src/admin/entity/admin.entity';
import * as bcrypt from 'bcrypt';

export class AdminFixture {
  static readonly GENERAL_ADMIN = {
    loginId: 'test1234',
    password: 'test1234!',
  };
  static async createAdminFixture(
    overwrites: Partial<Admin> = {},
  ): Promise<Admin> {
    const admin = new Admin();
    Object.assign(admin, this.GENERAL_ADMIN);
    Object.assign(admin, overwrites);
    admin.password = await bcrypt.hash(admin.password, 10);
    return admin;
  }
}
