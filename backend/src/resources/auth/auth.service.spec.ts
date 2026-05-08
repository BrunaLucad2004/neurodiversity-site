import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcryptjs';

import { UserService } from '@/resources/user/user.service';

import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

const mockUserService = {
  findOneByEmail: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);

      await expect(authService.validateUser('test@email.com', '123456')).rejects.toThrow(
        new UnauthorizedException('E-mail ou senha incorretos.'),
      );
    });

    it('deve lançar UnauthorizedException se a senha for inválida', async () => {
      mockUserService.findOneByEmail.mockResolvedValue({
        email: 'test@email.com',
        password: 'hashed_password',
      });
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.validateUser('test@email.com', 'senha_errada')).rejects.toThrow(
        new UnauthorizedException('E-mail ou senha incorretos.'),
      );
    });

    it('deve retornar o usuário se as credenciais forem válidas', async () => {
      const mockUser = { email: 'test@email.com', password: 'hashed_password' };
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@email.com', 'senha_certa');

      expect(result).toEqual(mockUser);
    });
  });
});
