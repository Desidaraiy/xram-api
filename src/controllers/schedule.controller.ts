import { Request, Response } from "express";
import ScheduleService from "../services/schedule.service";

class ScheduleController {
  public async getAllSchedules(req: Request, res: Response): Promise<void> {
    const schedules = await ScheduleService.getAllSchedules();
    res.status(200).json({ state: "success", data: schedules });
  }

  public async updateSchedule(req: Request, res: Response): Promise<void> {
    const {
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
      description_5,
    } = req.body;
    await ScheduleService.updateSchedule(
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
    res
      .status(200)
      .json({ state: "success", message: "Schedule updated successfully" });
  }

  public async updateAllSchedules(req: Request, res: Response): Promise<void> {
    await ScheduleService.updateAllSchedules(req.body);
    res.status(200).json({
      state: "success",
      message: "All schedules updated successfully",
    });
  }
}

export default new ScheduleController();
