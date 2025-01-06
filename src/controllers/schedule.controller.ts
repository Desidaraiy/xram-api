import { Request, Response } from "express";
import ScheduleService from "../services/schedule.service";
import moment from "moment";
import Schedule from "../models/schedule.model";

class ScheduleController {
  public async getAllSchedules(req: Request, res: Response): Promise<void> {
    const schedules = await ScheduleService.getAllSchedules();
    res.status(200).json({ state: "success", data: schedules });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const schedule = await ScheduleService.getOneSchedule();
    res.status(200).json({ state: "success", data: schedule });
  }

  public async updateSchedule(req: Request, res: Response): Promise<void> {
    const { id, body } = req.body;
    const updated: Schedule | null = await ScheduleService.updateSchedule(
      id,
      JSON.stringify(body)
    );
    if (updated != null) {
      res.status(200).json({ state: "success", data: updated });
    } else {
      res.status(200).json({ state: "error", message: "not found" });
    }
  }

  public async createSchedule(req: Request, res: Response): Promise<void> {
    const { date } = req.body;
    const schedule = await ScheduleService.createSchedule(date);
    if (schedule != null) {
      res.status(200).json({ state: "success", data: schedule });
    } else {
      res.status(200).json({ state: "error", message: "Schedule exists" });
    }
  }
}

export default new ScheduleController();
