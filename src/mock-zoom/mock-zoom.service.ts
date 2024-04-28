import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MockZoomService {
  async createZoomConference() {
    const url = `http://mock-zoom-conference/conference/${uuidv4()}`;

    return {
      message: 'Zoom conference created successfully',
      result: true,
      url: url
    };
  }

  async joinZoomConference(url: string, email: string) {
    return {
      message: 'User joined zoom conference successfully',
      result: true,
      url: url
    };
  }

  async leaveZoomConference(url: string, email: string) {
    return {
      message: 'User left zoom conference successfully',
      result: true,
      url: url
    };
  }

  async finishZoomConference(url: string) {
    return {
      message: 'Zoom conference finished successfully',
      result: true,
      url: url
    };
  }
}
