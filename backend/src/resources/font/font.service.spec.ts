import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';

import { FontService } from './font.service';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  isValidObjectId: jest.fn(),
}));

const mockFont = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Fonte Teste',
};

const mockFontModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
};

describe('FontService', () => {
  let fontService: FontService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FontService,
        {
          provide: getModelToken('Font'),
          useValue: jest.fn().mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockFont),
          })),
        },
      ],
    }).compile();

    fontService = module.get<FontService>(FontService);
    jest.clearAllMocks();
  });

  describe('createFont', () => {
    it('deve criar uma fonte com sucesso', async () => {
      const result = await fontService.createFont({ name: 'Fonte Teste' } as any);
      expect(result).toEqual(mockFont);
    });

    it('deve lançar ConflictException se o nome já existir', async () => {
      jest.spyOn(fontService['fontModel'].prototype, 'save' as any).mockRejectedValue(new Error('duplicate'));

      // Recria o service com model que lança erro no save
      const module = await Test.createTestingModule({
        providers: [
          FontService,
          {
            provide: getModelToken('Font'),
            useValue: jest.fn().mockImplementation(() => ({
              save: jest.fn().mockRejectedValue(new Error('duplicate')),
            })),
          },
        ],
      }).compile();

      const service = module.get<FontService>(FontService);
      await expect(service.createFont({ name: 'Fonte Teste' } as any)).rejects.toThrow(
        new ConflictException("Já existe uma fonte com o nome 'Fonte Teste' cadastrada."),
      );
    });
  });

  describe('showOneFont', () => {
    it('deve lançar NotFoundException se o id for inválido', async () => {
      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(fontService.showOneFont('id_invalido')).rejects.toThrow(
        new NotFoundException('Fonte não encontrada.'),
      );
    });

    it('deve lançar NotFoundException se a fonte não existir no banco', async () => {
      (isValidObjectId as jest.Mock).mockReturnValue(true);
      jest.spyOn(fontService['fontModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(fontService.showOneFont('507f1f77bcf86cd799439011')).rejects.toThrow(
        new NotFoundException('Fonte não encontrada.'),
      );
    });

    it('deve retornar a fonte se encontrada', async () => {
      (isValidObjectId as jest.Mock).mockReturnValue(true);
      jest.spyOn(fontService['fontModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFont),
      } as any);

      const result = await fontService.showOneFont('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockFont);
    });
  });

  describe('updateFont', () => {
    it('deve lançar NotFoundException se o id for inválido', async () => {
      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(fontService.updateFont('id_invalido', {} as any)).rejects.toThrow(
        new NotFoundException('Fonte não encontrada.'),
      );
    });
  });

  describe('showAllFonts', () => {
    it('deve retornar lista de fontes ordenada', async () => {
      jest.spyOn(fontService['fontModel'], 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        collation: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockFont]),
      } as any);

      const result = await fontService.showAllFonts();
      expect(result).toEqual([mockFont]);
    });
  });

  describe('deleteFont', () => {
    it('deve deletar a fonte pelo id', async () => {
      jest.spyOn(fontService['fontModel'], 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFont),
      } as any);

      const result = await fontService.deleteFont('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockFont);
    });
  });
});
