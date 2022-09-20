import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { AppService } from './app.service';

const listUser: User[] = [
  {
    device: 'iPhone 13',
    userName: 'hiennd23',
    passWord: 'Matkhaune1234',
    isCheckin: true,
  },
  {
    device: 'iPhone 12 Pro Max',
    userName: 'phongtt36',
    passWord: 'daylamatkhaumoih0N',
    isCheckin: true,
  },
  {
    device: 'iPhone 12',
    userName: 'huyvn4',
    passWord: 'Acmongsanco3',
    isCheckin: true,
  },
  {
    device: 'iPhone Xs Max',
    userName: 'uyntq',
    passWord: 'Laughing1014@',
    isCheckin: true,
  },
  {
    device: 'iPhone 8 Plus',
    userName: 'haona6',
    passWord: 'Nah9898**ssd',
    isCheckin: true,
  },
  {
    device: 'iPhone Xr',
    userName: 'phuongndt3',
    passWord: 'Chuatehaidilao2',
    isCheckin: true,
  },
  {
    device: 'iPhone 13 Pro Max',
    userName: 'thanhtd31',
    passWord: 'yeuNguyennhat12',
    isCheckin: true,
  },
];

@Injectable()
export class TasksService {
  constructor(
    private readonly appService: AppService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 00 08 * * 1-5')
  async handleCronCheckin() {
    this.logger.log('start check-in');
    this.checkInAuto();
  }

  @Cron('0 30 17 * * 1-5')
  async handleCronCheckout() {
    this.logger.log('start check-out');
    this.checkOutAuto();
  }

  @Cron('0 */30 * * * *')
  //@Cron('*/30 * * * * *')
  async handleCronTest() {
    this.logger.log('running');
  }

  async getListUser() {
    const user = await this.userModel.find({});
    if (!user || user.length == 0) {
      return listUser;
    }
    return user;
  }

  async checkInAuto() {
    const ran = this.getRandomArbitrary(5, 10);
    const ms = ran * 60 * 1000;
    const users = await this.getListUser();
    const check = this.getRandomArbitrary(1, 3);
    setTimeout(() => {
      for (let i = 0; i < users.length; i++) {
        ((i) => {
          if (users[i].isCheckin) {
            setTimeout(async () => {
              const data = await this.appService.login(
                users[i].userName,
                users[i].passWord,
                users[i].device
              );
              if (data.token) {
                console.log(users[i].userName);
                const check = await this.appService.getDayStatus(data.token);
                if (check) {
                  this.appService.checkIn(data.token);
                  this.appService.saveData(data.userId, '1');
                }
              }
            }, check * 50 * 1000 * i);
          }
        })(i);
      }
    }, ms);
  }

  async checkOutAuto() {
    const ran = this.getRandomArbitrary(5, 15);
    const ms = ran * 60 * 1000;
    const users = await this.getListUser();

    const check = this.getRandomArbitrary(1, 3);

    setTimeout(() => {
      for (let i = 0; i < users.length; i++) {
        ((i) => {
          if (users[i].isCheckin) {
            setTimeout(async () => {
              const data = await this.appService.login(
                users[i].userName,
                users[i].passWord,
                users[i].device
              );

              if (data.token) {
                this.appService.checkOut(data.token);
                this.appService.saveData(data.userId, '2');
              }
            }, check * 50 * 1000 * i);
          }
        })(i);
      }
    }, ms);
  }

  getRandomArbitrary(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
