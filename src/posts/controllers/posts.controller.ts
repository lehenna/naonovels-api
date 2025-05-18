import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId = req.user.id;
    return this.postsService.createPost(createPostDto, userId);
  }

  @Get()
  async getAllPosts(
    @Query('teamId') teamId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.getAllPosts({ teamId }, page, limit);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Patch(':postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.postsService.updatePost(postId, updatePostDto, userId);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('postId') postId: string, @Req() req) {
    const userId = req.user.id;
    return this.postsService.deletePost(postId, userId);
  }
}
