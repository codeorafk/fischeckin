import { Injectable, Param, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Trip, TripDocument } from '../schema/trip.schema';
import { DetailTrip, DetailTripDocument } from '../schema/detail.trip.schema';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(DetailTrip.name)
    private detailTripModel: Model<DetailTripDocument>
  ) {}

  public async checkTrip(@Param('phone') phone: string) {
    const trips = await this.getAllTrip(phone);

    if (!trips || trips.length == 0) {
      return {
        finishTrip: true,
      };
    }

    let _finishTrip = true;
    const lastTrip = trips[0];

    if (lastTrip.detail) {
      var check = lastTrip.detail.filter((x) => x['status'] === 'end');
      _finishTrip = check.length > 0;
    }

    return {
      trip: lastTrip,
      finishTrip: _finishTrip,
    };
  }

  public async getAllTrip(@Param('phone') phone: string) {
    return await this.tripModel
      .find({ phone: phone })
      .sort({ createdAt: -1 })
      .populate('detail')
      .exec();
  }

  public async startTrip(request: Request) {
    const body = request.body;
    const detail = new this.detailTripModel({
      lat: body['lat'],
      lng: body['lng'],
      status: 'start',
    });
    const kq = await detail.save();

    const trip = new this.tripModel({
      detail: kq,
      phone: body['phone'],
      name: body['name'],
      uid: body['uid'],
    });

    return await trip.save();
  }

  public async endTrip(request: Request) {
    const body = request.body;
    const trip = await this.tripModel.findById(body['_id']);

    if (trip) {
      const detail = new this.detailTripModel({
        lat: body['lat'],
        lng: body['lng'],
        status: 'end',
      });
      const kq = await detail.save();
      trip.detail.push(kq);

      return await trip.save();
    }
    return {};
  }
}
