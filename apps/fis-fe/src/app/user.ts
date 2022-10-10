export class User {
  _id?: string;
  device?: string;
  userName?: string;
  passWord?: string;
  isCheckin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _v?: number;
  id?: string;
  constructor(clone: User) {
    this._id = clone._id;
    this.device = clone.device;
    this.userName = clone.userName;
    this.passWord = clone.passWord;
    this.isCheckin = clone.isCheckin;
    this.createdAt = clone.createdAt;
    this.updatedAt = clone.updatedAt;
    this._v = clone._v;
    this.id = clone.id;
  }
}
