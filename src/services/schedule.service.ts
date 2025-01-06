import moment from "moment";
import Schedule from "../models/schedule.model";
import scheduleRepository from "../repositories/schedule.repository";

class ScheduleService {
  public async getAllSchedules(): Promise<Schedule[]> {
    return scheduleRepository.findAll();
  }

  public async getOneSchedule(): Promise<Schedule> {
    const formattedDate = moment().startOf("month").format("DD-MM-YYYY");
    return (
      (await scheduleRepository.getOne(formattedDate)) ??
      (await scheduleRepository.create(formattedDate))
    );
  }

  public async createSchedule(date: string): Promise<Schedule | null> {
    if ((await scheduleRepository.getOne(date)) != null) {
      return null;
    }
    return await scheduleRepository.create(date);
  }

  public async updateSchedule(
    id: number,
    body: string
  ): Promise<Schedule | null> {
    if ((await scheduleRepository.getById(id)) == null) {
      return null;
    }
    await scheduleRepository.update(id, body);
    return await scheduleRepository.getById(id);
  }
}

export default new ScheduleService();
