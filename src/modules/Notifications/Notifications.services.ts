import { Request, Response } from "express";
import { NotifiactionModel } from "../../DB/models";
import { NotificationRepo } from "../../repositories";
import { SuccessResponse } from "../../utils";

export class NotificationsServices {
  private notificationRepo: NotificationRepo = new NotificationRepo(
    NotifiactionModel
  );
  unReadNotifications =async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const limit = 5;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const notifications =await this.notificationRepo.findDocuments(
      { userId, isRead: false },
      { userId: 0,isRead: 0 },
      { lean: true, limit, skip, sort: { createdAt: -1 } }
      );
      const notificationsCount: number = await this.notificationRepo.countDocuments({ userId, isRead: false });
      const pages = Math.ceil(notificationsCount / limit)
      await this.notificationRepo.updateManyDocuments({ userId, isRead: false },{ isRead: true })
      if(notifications.length)
      return res
        .status(200)
              .json(SuccessResponse("unRead notifications", 200, { notifications, notificationsCount, pages }));
      return res.status(200).json({ message: "no unRead notifications yet" })
  };
  allReadNotifications =async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const limit = 8;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const notifications =await this.notificationRepo.findDocuments(
      { userId, isRead: true },
      { userId: 0 },
      { lean: true, limit, skip, sort: { createdAt: -1 } }
      );
      return res
        .status(200)
        .json(SuccessResponse("Read notifications", 200, { notifications }));
  };
  delete_Notifications =async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const notifications =await this.notificationRepo.deleteManyDocuments(
      { userId, isRead: true }
      );
      return res
        .status(200)
        .json(SuccessResponse(" notifications deleted", 200, { notifications }));
  };
}

export default new NotificationsServices()