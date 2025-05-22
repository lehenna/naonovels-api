import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Public } from '@/common/lib/decorators';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId = req.user.id;
    return this.postsService.createPost(createPostDto, userId);
  }

  @Public()
  @Get()
  async getAllPosts(
    @Query('teamId') teamId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.getAllPosts({ teamId }, page, limit);
  }

  @Public()
  @Get(':postId')
  async getPost(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.postsService.updatePost(postId, updatePostDto, userId);
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string, @Req() req) {
    const userId = req.user.id;
    return this.postsService.deletePost(postId, userId);
  }
}
