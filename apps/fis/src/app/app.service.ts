import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as axios from 'axios';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  private readonly logger = new Logger(AppService.name);

  public async getListUser() {
    const user = await this.userModel.find({});
    return user;
  }

  public async editUser(body) {
    const user = new this.userModel({
      userName: body['user-name'],
      passWord: body['pass-word'],
      isCheckin: body['isCheckin'],
      device: body['device'],
    });

    const temp = await this.userModel.findOne({ userName: user.userName });
    temp.passWord = user.passWord;
    temp.isCheckin = user.isCheckin;
    temp.device = user.device;
    temp.save();
  }

  public async login(username: string, pass: string, deviceModel: string) {
    const ran = this.getRandomArbitrary(2, 254);

    const body = {
      username: username,
      password: pass,
      buildNumber: '10947',
      version: '1.83',
      deviceIP: '10.86.161.' + ran,
      deviceModel: deviceModel,
      osVersion: '16.0',
    };

    const rs = await axios.default.post(
      'https://ddc.fis.vn/fis0/api/login',
      body
    );

    if (rs && rs.data && rs.data['resultCode'] === 1) {
      return rs.data['data'];
    }
    return '';
  }

  async getDayStatus(token: string) {
    const header = {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'FIS/10901 CFNetwork/1335.0.3 Darwin/21.6.0',
    };

    const rs = await axios.default.get(
      'https://ddc.fis.vn/fis0/api/get_day_status',
      { headers: header }
    );
    if (rs && rs.data && rs.data['data']) {
      const data = rs.data['data'];
      if (data['checkinTime']) {
        return false;
      }
    }
    return true;
  }

  async checkOut(token: string) {
    const body = {
      deviceId: '',
      ipGateway: '10.86.160.1',
      type: 0,
    };

    const header = {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'FIS/10901 CFNetwork/1335.0.3 Darwin/21.6.0',
    };

    const rs = await axios.default.post(
      'https://ddc.fis.vn/fis0/api/checkout_all',
      body,
      { headers: header }
    );
    this.logger.log(rs.data);
  }

  async checkIn(token: string) {
    const body = {
      deviceId: '',
      reason: '',
      ipGateway: '10.86.160.1',
      type: 0,
    };

    const header = {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'FIS/10901 CFNetwork/1335.0.3 Darwin/21.6.0',
    };

    const rs = await axios.default.post(
      'https://ddc.fis.vn/fis0/api/checkin_all',
      body,
      { headers: header }
    );

    this.logger.log(rs.data);
  }

  async saveData(userId: string, type: string) {
    const header = {
      Authorization: 'Basic c3NkX2FwaTpzc2RAMjAxNw==',
      'User-Agent': 'FIS/10901 CFNetwork/1335.0.3 Darwin/21.6.0',
    };
    await axios.default.post(
      'https://ddc.fis.vn/apietms/api/ChechInData/MobileAddCheckInOut?userId=' +
        userId +
        '&typeCheckInOut=' +
        type +
        '&dateCheckInOut=0-0-0%200:0:0',
      null,
      { headers: header }
    );
  }

  async apiCheck(userName: string, pass: string) {
    const ran = this.getRandomArbitrary(2, 254);
    const data = await this.login(userName, pass, '10.86.161.' + ran);
    if (data.token) {
      const check = await this.getDayStatus(data.token);

      if (check) {
        this.checkIn(data.token);
        this.saveData(data.userId, '1');
      } else {
        this.checkOut(data.token);
        this.saveData(data.userId, '2');
      }
    }
    return { code: 0, message: 'thanh cong' };
  }

  getRandomArbitrary(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
