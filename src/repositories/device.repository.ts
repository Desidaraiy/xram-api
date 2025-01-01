import Device from "../models/device.model";

class DeviceRepository {
  async findByToken(token: string) {
    const device = await Device.findOne({ where: { token } });
    return device;
  }
  async create({ ...object }) {
    await Device.create(object);
  }

  async update(device: Device) {
    await Device.update(device, { where: { id: device.id } });
  }

  async findByUserId(userId: number) {
    const devices = await Device.findAll({ where: { userId } });
    return devices;
  }
}

export default new DeviceRepository();
