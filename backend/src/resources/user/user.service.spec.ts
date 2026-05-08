import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { MailService } from '@/resources/mail/mail.service';
import { Roles } from '@/resources/user/user.constants';

import { UserService } from './user.service';

jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed_password') }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(), verify: jest.fn() }));

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@email.com',
  password: 'hashed_password',
  fullName: 'Test User',
  status: true,
  role: Roles.visitor,
  authKey: undefined,
  save: jest.fn().mockResolvedValue(true),
};

const mockUserModel = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  findOneAndUpdate: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  save: jest.fn(),
};

const mockMailService = { sendPasswordRecoveryEmail: jest.fn() };
const mockConfigService = { get: jest.fn().mockReturnValue('mock_value') };

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken('User'), useValue: jest.fn().mockImplementation(() => mockUser) },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve lançar ConflictException se o e-mail já estiver cadastrado', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser as any);

      await expect(
        userService.create({ email: 'test@email.com', password: '123456' } as any),
      ).rejects.toThrow(new ConflictException('E-mail já cadastrado.'));
    });

    it('deve criar o usuário com senha hashada e role visitor', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(undefined);

      const result = await userService.create({
        email: 'novo@email.com',
        password: '123456',
      } as any);

      expect(hash).toHaveBeenCalledWith('123456', 12);
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      mockUserModel.exec.mockResolvedValue([mockUser]);
      jest.spyOn(userService['userModel'], 'find').mockReturnValue({ exec: jest.fn().mockResolvedValue([mockUser]) } as any);

      const result = await userService.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOneByEmail', () => {
    it('deve retornar undefined se usuário não for encontrado', async () => {
      jest.spyOn(userService['userModel'], 'findOne').mockReturnValue({ exec: jest.fn().mockResolvedValue(undefined) } as any);

      const result = await userService.findOneByEmail('naoexiste@email.com');
      expect(result).toBeUndefined();
    });

    it('deve retornar o usuário se encontrado', async () => {
      jest.spyOn(userService['userModel'], 'findOne').mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) } as any);

      const result = await userService.findOneByEmail('test@email.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('deve lançar NotFoundException se o id for inválido', async () => {
      await expect(userService.update('id_invalido', {} as any)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado.'),
      );
    });

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(undefined);

      await expect(userService.update('507f1f77bcf86cd799439011', {} as any)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado.'),
      );
    });
  });

  describe('passwordRecoveryEmail', () => {
    it('deve retornar sem fazer nada se o usuário não existir', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(undefined);

      await expect(userService.passwordRecoveryEmail('naoexiste@email.com')).resolves.toBeUndefined();
      expect(mockMailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled();
    });

    it('deve enviar e-mail de recuperação se o usuário existir', async () => {
      const userWithSave = { ...mockUser, save: jest.fn().mockResolvedValue(true), authKey: undefined };
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(userWithSave as any);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      await userService.passwordRecoveryEmail('test@email.com');

      expect(mockMailService.sendPasswordRecoveryEmail).toHaveBeenCalled();
    });
  });

  describe('changeUserPassword', () => {
    it('deve lançar BadRequestException se o token for inválido', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid token'); });

      await expect(userService.changeUserPassword('nova_senha', 'token_invalido')).rejects.toThrow(
        new BadRequestException('Token de recuperação de senha inválido.'),
      );
    });

    it('deve lançar BadRequestException se o usuário não for encontrado com o authKey', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ email: 'test@email.com' });
      jest.spyOn(userService['userModel'], 'findOne').mockReturnValue({ exec: jest.fn() } as any);
      // findOne retorna null — exec não existe aqui, forçamos o erro
      jest.spyOn(userService['userModel'], 'findOne').mockReturnValue(null as any);

      await expect(userService.changeUserPassword('nova_senha', 'token_valido')).rejects.toThrow(
        new BadRequestException('Token de recuperação de senha inválido.'),
      );
    });
  });
});
