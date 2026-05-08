import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Session,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateCommentDto } from '@/resources/artwork/dto/requests/create-comment.dto';
import { FetchArtworksByAttributesDto } from '@/resources/artwork/dto/requests/fetch-artworks-by-attributes.dto';
import { SessionData } from '@/resources/auth/auth.controller';

import { ArtworkService } from './artwork.service';
import { ArtworkRoDto, CreateArtworkDto, QueryArtworkDto } from './dto';
import { Artwork } from './schema/artwork.schema';

@Controller()
@ApiTags('Artwork')
export class ArtworkController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,

    private readonly artworkService: ArtworkService,
  ) {}

  @Get('artworks')
  async getArtworks(@Query() queryArtworkDto: QueryArtworkDto) {
    return this.artworkService.getArtworks(queryArtworkDto);
  }

  @Get('artworks/:artwork_id')
  @ApiNotFoundResponse({ description: 'Obra não encontrada.' })
  async getOneArtwork(@Param('artwork_id') artworkId: string) {
    return this.artworkService.getOneArtwork(artworkId);
  }

  @Post('artworks')
  @ApiConflictResponse({ description: 'Já existe uma obra com o código informado.' })
  async createArtwork(@Body() createArtworkDto: CreateArtworkDto) {
    return this.artworkService.createArtwork(createArtworkDto);
  }

  @Put('artworks/:artwork_id')
  @ApiConflictResponse({ description: 'Já existe uma obra com o código informado.' })
  async updateOneArtwork(
    @Param('artwork_id') artworkId: string,
    @Body() createArtworkDto: CreateArtworkDto,
  ) {
    return this.artworkService.updateOneArtwork(artworkId, createArtworkDto);
  }

  @Delete('artworks/:artwork_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Obra deletada com sucesso.' })
  async deleteFont(@Param('artwork_id') artworkId: string) {
    return this.artworkService.deleteArtwork(artworkId);
  }

  @Get('fonts/:font_name/artworks')
  @ApiNotFoundResponse({ description: 'Fonte não encontrada.' })
  async getArtworksByAttribute(
    @Param('font_name') fontName: string,
    @Query() fetchArtworksByAttributesDto: FetchArtworksByAttributesDto,
  ) {
    const artworks = await this.artworkService.fetchArtworksByAttributes(
      fontName,
      fetchArtworksByAttributesDto,
    );
    return this.mapper.mapArrayAsync(artworks, Artwork, ArtworkRoDto);
  }

  @Post('artworks/:artwork_id')
  @ApiUnauthorizedResponse({ description: 'Usuário não autorizado.' })
  @ApiNotFoundResponse({ description: 'Fonte não encontrada.' })
  async createComment(
    @Session() session: SessionData,
    @Param('artwork_id') artwork_id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.artworkService.createComment(artwork_id, createCommentDto, session);
  }

  @Delete('artworks/:artwork_id/:comment_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Comentário deletado com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Usuário não autorizado.' })
  @ApiNotFoundResponse({ description: 'Fonte não encontrada.' })
  async deleteComment(
    @Session() session: SessionData,
    @Param('artwork_id') artwork_id: string,
    @Param('comment_id') comment_id: string,
  ) {
    return this.artworkService.deleteComment(artwork_id, comment_id, session);
  }

  @Put('artworks/:artwork_id/:comment_id')
  @ApiUnauthorizedResponse({ description: 'Usuário não autorizado.' })
  @ApiNotFoundResponse({ description: 'Fonte ou comentário não encontrados.' })
  async updateComment(
    @Session() session: SessionData,
    @Param('artwork_id') artwork_id: string,
    @Param('comment_id') comment_id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.artworkService.updateComment(artwork_id, comment_id, createCommentDto, session);
  }
}
