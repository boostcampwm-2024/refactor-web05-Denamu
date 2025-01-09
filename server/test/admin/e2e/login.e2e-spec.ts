import { INestApplication } from '@nestjs/common';
import { AdminService } from '../../../src/admin/service/admin.service';
import { LoginAdminRequestDto } from '../../../src/admin/dto/request/login-admin.dto';
import * as request from 'supertest';
import { RegisterAdminRequestDto } from '../../../src/admin/dto/request/register-admin.dto';
describe('POST api/admin/login E2E Test', () => {
  let app: INestApplication;
  let adminService: AdminService;
  const registerAdminDto: RegisterAdminRequestDto = {
    loginId: 'testAdminId',
    password: 'testAdminPassword!',
  };

  beforeAll(async () => {
    app = global.testApp;
    adminService = app.get(AdminService);
    await adminService.createAdmin(registerAdminDto);
  });
  it('등록된 계정이면 정상적으로 로그인할 수 있다.', async () => {
    //given
    const loginAdminDto: LoginAdminRequestDto = {
      loginId: 'testAdminId',
      password: 'testAdminPassword!',
    };

    //when
    const response = await request(app.getHttpServer())
      .post('/api/admin/login')
      .send(loginAdminDto);

    //then
    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('sessionId=');
  });

  it('등록되지 않은 ID로 로그인을 시도하면 401 UnAuthorized 예외가 발생한다.', async () => {
    //given
    const loginWrongAdminIdDto: LoginAdminRequestDto = {
      loginId: 'testWrongAdminId',
      password: 'testAdminPassword!',
    };

    //when
    const response = await request(app.getHttpServer())
      .post('/api/admin/login')
      .send(loginWrongAdminIdDto);

    //then
    expect(response.status).toBe(401);
  });

  it('비밀번호가 다르다면 401 UnAuthorized 예외가 발생한다.', async () => {
    //given
    const loginWrongAdminPasswordDto: LoginAdminRequestDto = {
      loginId: 'testAdminId',
      password: 'testWrongAdminPassword!',
    };
    //when
    const response = await request(app.getHttpServer())
      .post('/api/admin/login')
      .send(loginWrongAdminPasswordDto);

    //then
    expect(response.status).toBe(401);
  });
});
