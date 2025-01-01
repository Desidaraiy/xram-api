import Schedule from "../models/schedule.model";

class ScheduleRepository {
  public async findAll(): Promise<Schedule[]> {
    return Schedule.findAll();
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
    await Schedule.update(
      {
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
        description_5,
      },
      { where: { id } }
    );
  }
}

export default new ScheduleRepository();
