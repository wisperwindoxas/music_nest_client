import {Injectable} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model, ObjectId } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateTrackDto } from './dto/create-track';
import { CreateCommentDto } from './dto/create-comment';
import { trace } from 'console';


@Injectable()

export class TrackService{

  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
              @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async create(dto:CreateTrackDto):Promise<Track>{
    const track  = await this.trackModel.create({...dto, listens:0})
    return track
  }


  async getAll():Promise<Track[]>{
    return await this.trackModel.find()
  }

  async getOne(id:ObjectId):Promise<Track>{
    return await this.trackModel.findById(id).populate('comments')
  }


  async delete(id:ObjectId):Promise<Track>{
        return await this.trackModel.findByIdAndDelete(id)
  }


  async addComment(dto:CreateCommentDto):Promise<Comment>{
    const track = await this.trackModel.findById(dto.trackId)
    const comment = await this.commentModel.create({...dto})
    track.comments.push(comment.id)
    await track.save();
    return comment
  }

}