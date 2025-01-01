import Device from "../models/device.model";
import deviceRepository from "../repositories/device.repository";

class DeviceService {
  async create(device: Device) {
    await deviceRepository.create(device);
  }
  async findByToken(token: string) {
    const device = await deviceRepository.findByToken(token);
    return device;
  }
  async findByUserId(userId: number) {
    const devices = await deviceRepository.findByUserId(userId);
    return devices;
  }
  async update(device: Device) {
    await deviceRepository.update(device);
  }
}

export default new DeviceService();
