import { INotification } from "../common";
import { BaseRepository } from "./Base.repository";
import { Model } from "mongoose";


export class NotificationRepo extends BaseRepository<INotification> {
  constructor(protected NotifiactionModel: Model<INotification>) {
    super(NotifiactionModel);
  }
  async updateNotification(notification: INotification): Promise<INotification> {
      return await notification.save()
  }

}