import daySchedule from "../interfaces/daySchedule.interface";
import Schedule from "../models/schedule.model";

class ScheduleRepository {
  public async findAll(): Promise<Schedule[]> {
    return await Schedule.findAll();
  }

  public async getOne(date: string): Promise<Schedule | null> {
    return await Schedule.findOne({
      where: { date },
    });
  }

  public async getById(id: number): Promise<Schedule | null> {
    return await Schedule.findByPk(id);
  }

  public async update(id: number, body: string): Promise<void> {
    await Schedule.update(
      {
        body: body,
      },
      { where: { id } }
    );
  }

  public async create(date: string): Promise<Schedule> {
    const body: daySchedule[] = [];

    for (let i: number = 1; i < 32; i++) {
      const day: daySchedule = {
        id: i,
        saints: "",
        time_1: null,
        isActive_1: false,
        description_1: null,
        time_2: null,
        isActive_2: false,
        description_2: null,
        time_3: null,
        isActive_3: false,
        description_3: null,
        time_4: null,
        isActive_4: false,
        description_4: null,
        time_5: null,
        isActive_5: false,
        description_5: null,
      };
      body.push(day);
    }

    const jsonStringBody = JSON.stringify(body);

    return await Schedule.create({
      date: date,
      body: jsonStringBody,
    });
  }
}

export default new ScheduleRepository();
