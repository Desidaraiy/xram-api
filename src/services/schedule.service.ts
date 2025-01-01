import Schedule from "../models/schedule.model";
import scheduleRepository from "../repositories/schedule.repository";

class ScheduleService {
  public async getAllSchedules(): Promise<Schedule[]> {
    return scheduleRepository.findAll();
  }

  public async updateSchedule(
    id: number,
    saints: string,
    time_1: string,
    description_1: string,
    time_2: string,
    description_2: string,
    time_3: string,
    description_3: string,
    time_4: string,
    description_4: string,
    time_5: string,
    description_5: string
  ): Promise<void> {
    await scheduleRepository.updateSchedule(
      id,
      saints,
      time_1,
      description_1,
      time_2,
      description_2,
      time_3,
      description_3,
      time_4,
      description_4,
      time_5,
      description_5
    );
  }

  public async updateAllSchedules(array: Schedule[]): Promise<void> {
    for (let i = 0; i < array.length; i++) {
      await scheduleRepository.updateSchedule(
        array[i].id,
        array[i].saints,
        array[i].time_1,
        array[i].description_1,
        array[i].time_2,
        array[i].description_2,
        array[i].time_3,
        array[i].description_3,
        array[i].time_4,
        array[i].description_4,
        array[i].time_5,
        array[i].description_5
      );
    }
  }
}

export default new ScheduleService();
