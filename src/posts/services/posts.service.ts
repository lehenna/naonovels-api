import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { TeamRoles } from '@/teams/schemas/team-member.schema';
import { TeamMembersService } from '@/teams/services/team-members.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const member = await this.teamMembersService.getMemberByTeamAndUser(
      createPostDto.teamId,
      userId,
    );
    if (
      !member ||
      ![TeamRoles.OWNER, TeamRoles.ADMIN, TeamRoles.EDITOR].includes(
        member.role,
      )
    ) {
      throw new Error('No tienes permisos para publicar contenido.');
    }

    return this.postModel.create(createPostDto);
  }

  async getPostById(postId: string) {
    return this.postModel.findById(postId).exec();
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Publicación no encontrada.');

    const member = await this.teamMembersService.getMemberByTeamAndUser(
      post.teamId.toString(),
      userId,
    );
    if (
      !member ||
      ![TeamRoles.OWNER, TeamRoles.ADMIN, TeamRoles.EDITOR].includes(
        member.role,
      )
    ) {
      throw new Error('No tienes permisos para modificar esta publicación.');
    }

    return this.postModel
      .findByIdAndUpdate(postId, updatePostDto, { new: true })
      .exec();
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Publicación no encontrada.');

    const member = await this.teamMembersService.getMemberByTeamAndUser(
      post.teamId.toString(),
      userId,
    );
    if (!member || ![TeamRoles.OWNER, TeamRoles.ADMIN].includes(member.role)) {
      throw new Error('No tienes permisos para eliminar esta publicación.');
    }

    return this.postModel.findByIdAndDelete(postId).exec();
  }
}
