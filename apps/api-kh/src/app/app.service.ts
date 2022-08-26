import { Injectable } from '@nestjs/common';
import * as axios from 'axios';
import FormData = require('form-data');
import * as excel from 'exceljs';
import path = require('path');
import fs = require('fs');
import converter = require('json-2-csv');

@Injectable()
export class AppService {
  listUser = [];

  async processFile(file: Express.Multer.File) {
    var paths = this.saveFileTemp(file);

    if (paths) {
      var excel = await this.readCell(paths);
      var getToken = await this.getToken();
      for (let i = 1050; i < excel.rowCount; i++) {
        const row = excel.getRow(i);
        const cccd = row.getCell(2).value;

        if (cccd) {
          if (i % 30 === 0) {
            getToken = await this.getToken();
          }
          console.log(i);
          const info = await this.getInfo(cccd.toString(), getToken);
          console.log('success: ', info['success']);
          if (info && info['success'] === 1) {
            let NAME_CHECK = info['url']?.toString();
            if (NAME_CHECK) {
              NAME_CHECK = NAME_CHECK.replace(/[0-9]/g, '').replace('/', '');
            }

            const name = row.getCell(1).value;
            this.listUser.push({
              KHACH_HANG: name,
              CMND_DKKD: cccd,
              NAME_CHECK: NAME_CHECK,
              TYPE: info['type'],
            });
          }
        }
      }
      converter.json2csv(this.listUser, (err, csv) => {
        if (err) {
          throw err;
        }
        let fileName = 'csv' + new Date().toISOString() + '.' + 'csv';

        let pathTemp = path.resolve(__dirname, './assets/' + fileName);
        fs.writeFileSync(pathTemp, csv);
      });

      this.deleteFileTemp(paths);
    }

    return {};
  }

  private async readCell(filename) {
    let workBook = new excel.Workbook();
    await workBook.xlsx.readFile(filename);

    let sheet = workBook.getWorksheet('Sheet1');
    //let cellValue = sheet.getRow(2).getCell(1).value;

    return sheet;
  }

  saveFileTemp(file: Express.Multer.File) {
    let fileName = 'file' + new Date().toISOString() + '.' + 'xlsx';

    let pathTemp = path.resolve(__dirname, './assets/' + fileName);

    try {
      fs.writeFileSync(pathTemp, file.buffer);
      return pathTemp;
    } catch {
      return false;
    }
  }

  deleteFileTemp(file) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }

  async getToken() {
    const form = new FormData();
    form.append('r', '5rk3r7');

    const rs = await axios.default.post(
      'https://masothue.com/Ajax/Token',
      form
    );
    if (rs) {
      return rs;
    }
    return null;
  }

  async getInfo(cccd: string, getToken) {
    const form = new FormData();

    var token = getToken.data['token'];
    var cookie = getToken.headers['set-cookie'];

    form.append('q', Number.parseInt(cccd));
    form.append('type', 'auto');
    form.append('token', token);
    form.append('force-search', 1);

    var header = {
      ...form.getHeaders(),
      'Content-Length': await form.getLengthSync(),
      dnt: 1,
      origin: 'https://masothue.com',
      referer: 'https://masothue.com/',
      'x-requested-with': 'XMLHttpRequest',
      Accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      Cookie: cookie,
    };
    try {
      axios.default.defaults.timeout = 5000;
      const rs = await axios.default.post(
        'https://masothue.com/Ajax/Search',
        form,
        {
          headers: header,
          withCredentials: true,
        }
      );

      if (rs.data) {
        return rs.data;
      }
    } catch (e) {}

    return '';
  }
}
