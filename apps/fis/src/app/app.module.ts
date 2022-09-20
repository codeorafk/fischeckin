import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { User, UserSchema } from '../schema/user.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './task.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.3kq72zf.mongodb.net/?retryWrites=true&w=majority'
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
