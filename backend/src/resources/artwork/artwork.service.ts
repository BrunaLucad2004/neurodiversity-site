import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CreateCommentDto } from '@/resources/artwork/dto/requests/create-comment.dto';
import { FetchArtworksByAttributesDto } from '@/resources/artwork/dto/requests/fetch-artworks-by-attributes.dto';
import { SessionData } from '@/resources/auth/auth.controller';
import { Roles } from '@/resources/user/user.constants';

import { CreateArtworkDto, QueryArtworkDto } from './dto';
import { Artwork, ArtworkDocument } from './schema/artwork.schema';

@Injectable()
export class ArtworkService {
  constructor(
    @InjectModel('Artwork') private readonly artworkModel: Model<ArtworkDocument>,
  ) {}

  async getArtworks(queryArtworkDto: QueryArtworkDto) {
    const page = Math.max(1, Number(queryArtworkDto.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryArtworkDto.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (queryArtworkDto.font) filter.font = queryArtworkDto.font.toLowerCase();
    if (queryArtworkDto.search) {
      filter.$or = [
        { title: { $regex: queryArtworkDto.search, $options: 'i' } },
        { code: { $regex: queryArtworkDto.search, $options: 'i' } },
      ];
    } else {
      if (queryArtworkDto.title) filter.title = { $regex: queryArtworkDto.title, $options: 'i' };
      if (queryArtworkDto.code) filter.code = { $regex: queryArtworkDto.code, $options: 'i' };
    }
    if (queryArtworkDto.author) {
      filter.attributes = {
        $elemMatch: {
          name: { $in: ['autor', 'compositor', 'compositores'] },
          value: { $regex: queryArtworkDto.author, $options: 'i' },
        },
      };
    }

    const [artworks, total] = await Promise.all([
      this.artworkModel
        .find(filter)
        .sort({ title: 1 })
        .collation({ locale: 'pt' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.artworkModel.countDocuments(filter).exec(),
    ]);

    return {
      data: artworks.map((artwork) => ({
        id: artwork.id,
        code: artwork.code,
        title: artwork.title,
        font: artwork.font,
        filePath: artwork.filePath,
        attributes: artwork.attributes,
        comments: artwork.comments,
      })),
      total,
      page,
      limit,
    };
  }

  async getOneArtwork(artworkId: string) {
    const isValidId = isValidObjectId(artworkId);
    if (!isValidId) throw new NotFoundException('Obra não encontrada.');
    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (artwork === null) throw new NotFoundException('Obra não encontrada.');
    return {
      id: artwork.id,
      code: artwork.code,
      title: artwork.title,
      font: artwork.font,
      filePath: artwork.filePath,
      attributes: artwork.attributes,
      comments: artwork.comments,
    };
  }

  async createArtwork(createArtworkDto: CreateArtworkDto) {
    try {
      const artwork = new this.artworkModel({
        ...createArtworkDto,
        attributes: JSON.parse(createArtworkDto.attributes),
        font: createArtworkDto.font.toLowerCase(),
      });
      return await artwork.save();
    } catch (err) {
      throw new ConflictException(
        `Já existe uma obra com o código '${createArtworkDto.code}' cadastrado.`,
      );
    }
  }

  async updateOneArtwork(artworkId: string, createArtworkDto: CreateArtworkDto) {
    const isValidId = isValidObjectId(artworkId);
    if (!isValidId) throw new NotFoundException('Obra não encontrada.');
    try {
      return await this.artworkModel
        .findByIdAndUpdate(artworkId, createArtworkDto, { new: true })
        .exec();
    } catch (err) {
      throw new ConflictException(
        `Já existe uma obra com o código '${createArtworkDto.code}' cadastrado.`,
      );
    }
  }

  deleteArtwork(artworkId: string) {
    return this.artworkModel.findByIdAndDelete(artworkId).exec();
  }

  async fetchArtworksByAttributes(
    fontName: string,
    fetchArtworksByAttributesDto: FetchArtworksByAttributesDto,
  ) {
    const names = !Array.isArray(fetchArtworksByAttributesDto.names)
      ? [fetchArtworksByAttributesDto.names]
      : fetchArtworksByAttributesDto.names;
    const values = !Array.isArray(fetchArtworksByAttributesDto.values)
      ? [fetchArtworksByAttributesDto.values]
      : fetchArtworksByAttributesDto.values;
    return this.artworkModel
      .find({
        font: fontName.toLowerCase(),
        'attributes.name': { $all: names },
        'attributes.value': { $all: values },
      })
      .sort({ title: 1 })
      .collation({ locale: 'pt' })
      .exec();
  }

  async createComment(artworkId: string, createCommentDto: CreateCommentDto, session: SessionData) {
    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (!artwork) throw new NotFoundException('Obra não encontrada.');
    if (!session.passport) throw new NotFoundException('Usuário não encontrado.');
    const { user } = session.passport;
    artwork.comments.push({
      id: uuidv4(),
      comment: createCommentDto.comment,
      userId: user.id,
      fullName: user.fullName,
      createdAt: new Date(),
    });
    const savedArtwork = await artwork.save();
    return {
      id: savedArtwork.id,
      code: savedArtwork.code,
      title: savedArtwork.title,
      font: savedArtwork.font,
      filePath: savedArtwork.filePath,
      attributes: savedArtwork.attributes,
      comments: savedArtwork.comments,
    };
  }

  async deleteComment(artworkId: string, commentId: string, session: SessionData) {
    if (!session.passport) throw new NotFoundException('Usuário não encontrado.');
    const { user } = session.passport;
    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (!artwork) throw new NotFoundException('Obra não encontrada.');
    const comment = artwork.comments.find((c) => c.id === commentId);
    if (!comment) throw new NotFoundException('Comentário não encontrado.');
    if (comment.userId !== user.id && user.role === Roles.visitor)
      throw new NotFoundException('Usuário não autorizado.');
    artwork.comments = artwork.comments.filter((c) => c.id !== commentId);
    const savedArtwork = await artwork.save();
    return {
      id: savedArtwork.id,
      code: savedArtwork.code,
      title: savedArtwork.title,
      font: savedArtwork.font,
      filePath: savedArtwork.filePath,
      attributes: savedArtwork.attributes,
      comments: savedArtwork.comments,
    };
  }

  async updateComment(
    artworkId: string,
    commentId: string,
    createCommentDto: CreateCommentDto,
    session: SessionData,
  ) {
    if (!session.passport) throw new NotFoundException('Usuário não encontrado.');
    const { user } = session.passport;
    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (!artwork) throw new NotFoundException('Obra não encontrada.');
    const commentToUpdate = artwork.comments.find((c) => c.id === commentId);
    if (!commentToUpdate) throw new NotFoundException('Comentário não encontrado.');
    if (commentToUpdate.userId !== user.id) throw new NotFoundException('Usuário não autorizado.');
    artwork.comments.forEach((c) => {
      if (c.id === commentId) c.comment = createCommentDto.comment;
    });
    await artwork.updateOne(artwork);
    return {
      id: artwork.id,
      code: artwork.code,
      title: artwork.title,
      font: artwork.font,
      filePath: artwork.filePath,
      attributes: artwork.attributes,
      comments: artwork.comments,
    };
  }
}
