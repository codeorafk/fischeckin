import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/user.schema';
import { AppService } from './app.service';
import { TasksService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [TasksService, AppService],
})
export class TasksModule {}
