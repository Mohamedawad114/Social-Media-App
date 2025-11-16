import { Router } from "express";
import NotificationsServices from "./Notifications.services";
import { verifyToken } from "../../middlwares";

const notificationsControllor = Router({ mergeParams: true });

notificationsControllor.get("/nuRead-notifications",verifyToken,NotificationsServices.unReadNotifications)
notificationsControllor.get("/", verifyToken, NotificationsServices.allReadNotifications)
notificationsControllor.delete("/delete", verifyToken, NotificationsServices.delete_Notifications)



export {notificationsControllor}