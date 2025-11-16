import { Request, Response } from "express";
import mongoose, { FilterQuery } from "mongoose";
import jwt from "jsonwebtoken";
import {
  compareHash,
  createAndSendOTP,
  decrypt,
  emailQueue,
  encrypt,
  redis,
  s3_services,
  SuccessResponse,
} from "../../../utils";
import {
  conversation,
  friends_Blacklist,
  friendshipEnum,
  IFriendship,
  IGroup,
  IUser,
  notificationHandler,
  sendNotificationsToUser,
} from "../../../common";
import {
  ResetPasswordDTO,
  updatePasswordDTO,
  updateUserDTO,
} from "../user.dto";
import {
  BadRequestException,
  conflictException,
  notFoundException,
} from "../../../common/Errors";
import {
  commentRepo,
  conversation_Repo,
  friendshipRepo,
  NotificationRepo,
  Post_Repo,
  UserRepo,
} from "../../../repositories";
import {
  CommentModel,
  NotifiactionModel,
  postModel,
  UserModel,
} from "../../../DB/models";

export class ProfileServices {
  constructor() {}
  private userRepo: UserRepo = new UserRepo(UserModel);
  private s3Client = new s3_services();
  private postRepo: Post_Repo = new Post_Repo(postModel);
  private commnetRepo: commentRepo = new commentRepo(CommentModel);
  private friendshipRepo: friendshipRepo = new friendshipRepo();
  private notificationRepo = new NotificationRepo(NotifiactionModel);
  private conversationRepo: conversation_Repo = new conversation_Repo();
  profile = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId, {
      blockFriends: 0,
    });
    if (!user) throw new BadRequestException(`User not found`);
    if (user.phone) user.phone = decrypt(user.phone);
    return res.status(200).json(SuccessResponse("user profile", 200, { user }));
  };
  Updateuser = async (req: Request, res: Response) => {
    const user = req.user;
    const updateUser: updateUserDTO = req.body;
    if (updateUser.email) {
      const valid_email = await this.userRepo.findOneDocument({
        email: updateUser.email,
      });
      if (valid_email) throw new conflictException(`email already existed`);
          emailQueue.add("sendEmail", {
            to: updateUser.email,
            type: "confirmation",
          });
      updateUser.isConfirmed = false;
    }
    if (updateUser.phone) {
      updateUser.phone = encrypt(updateUser.phone);
    }
    const updatedUser = await this.userRepo.findAndUpdateDocument(
      user?._id as mongoose.Types.ObjectId,
      updateUser
    );
    if (!updatedUser) throw new BadRequestException(`something wrong`);
    return res
      .status(200)
      .json(SuccessResponse("user Updated", 200, { updatedUser }));
  };
  updatePassword = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const updatePassword: updatePasswordDTO = req.body;
    const user = await this.userRepo.findByIdDocument(userId, " +password", {
      blockFriends: 0,
    });
    if (!user) throw new notFoundException("user not found");
    if (updatePassword.newPassword !== updatePassword.confirmPassword) {
      throw new BadRequestException(
        "confirmPassword must be similar newPassword"
      );
    }
    const isMatch = await compareHash(
      updatePassword.oldPassword,
      user?.password as string
    );
    if (!isMatch) throw new BadRequestException(`invalid oldPasword`);
    user.password = updatePassword.confirmPassword;
    await this.userRepo.updateUser(user);
    const keys = await redis.keys(`refreshToken:${user._id as string}:*`);
    if (keys.length) await redis.del(...keys);
    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json(SuccessResponse(`password updated`, 200));
  };
  resetPasswordreq = async (req: Request, res: Response) => {
    const user = req.user;
    emailQueue.add("sendEmail", {
      to: user?.email,
      type: "reset_Password",
    });
    return res.status(200).json(SuccessResponse(`OTP is sent`, 200));
  };
  async resendOTP_reset(req: Request, res: Response) {
    const user = req.user;
    emailQueue.add("sendEmail", {
      to: user?.email,
      type: "reset_Password",
    });
    return res.status(200).json(SuccessResponse(`OTP sent`, 200));
  }
  resetPasswordconfrim = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const resetPassword: ResetPasswordDTO = req.body;
    if (
      !resetPassword.OTP ||
      !resetPassword.newPassword ||
      !resetPassword.confirmPassword
    )
      throw new BadRequestException(`Both OTP and new passwords are required`);
    const savedOTP = await redis.get(`otp_reset:${user.email}`);
    if (!savedOTP) throw new BadRequestException(`expire OTP.`);
    const isMatch = await compareHash(resetPassword.OTP, savedOTP);
    if (!isMatch) throw new BadRequestException(`Invalid OTP`);
    user.password = resetPassword.confirmPassword;
    await redis.del(`otp_reset:${user.email}`);
    await this.userRepo.updateUser(user);
    const keys = await redis.keys(`refreshToken:${user._id}:*`);
    if (keys.length) await redis.del(...keys);
    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json(SuccessResponse(`password updated`, 200));
  };
  uploadProfile_pic = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const file = req.file as Express.Multer.File;
    if (!file) throw new BadRequestException("file is required");
    const { Key } = await this.s3Client.upload_file(
      file,
      `${user?._id}/profile`
    );
    user.profilePicture = Key;
    await this.userRepo.updateUser(user);
    return res
      .status(200)
      .json(SuccessResponse("photo uploaded", 200, { Key }));
  };
  uploadCover_pic = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const file = req.file as Express.Multer.File;
    if (!file) throw new BadRequestException("file is required");
    const { Key } = await this.s3Client.upload_file(file, `${user?._id}/cover`);
    user.coverPicture = Key;
    await this.userRepo.updateUser(user);
    return res
      .status(200)
      .json(SuccessResponse("photo uploaded", 200, { Key }));
  };
  renew_SignedUrl = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const { key, keyType } = req.body as { key: string; keyType: keyof IUser };
    if (!key || !keyType)
      throw new BadRequestException("key and keyType required");
    if (user[keyType] !== key) throw new BadRequestException("invalid key");
    const url = await this.s3Client.getSignedUrl(key);
    return res.status(200).json(SuccessResponse("photo url", 200, { url }));
  };

  sendFreindship = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId | string;
    const { friendRequestTo } = req.body;
    const user = await this.userRepo.findByIdDocument(friendRequestTo);
    if (!user) throw new notFoundException("user not found");
    const existing = await redis.sismember(
      `friends:${userId}`,
      friendRequestTo
    );
    if (existing) throw new BadRequestException("You are already friends");
    if (
      user.blockFriends?.includes(userId as mongoose.Types.ObjectId) ||
      (await this.friendshipRepo.findOneDocument({
        requestFromId: userId,
        requestToId: friendRequestTo,
      }))
    ) {
      throw new BadRequestException("can't send friendship");
    }
    const friendshipRequest = await this.friendshipRepo.createDocument({
      requestFromId: userId,
      requestToId: friendRequestTo,
    });
    const { title, content } = notificationHandler("friend_request", {
      username: `${req.user?.username}`,
    });
    const notification = await this.notificationRepo.createDocument({
      userId: friendRequestTo,
      title,
      content,
    });
    await sendNotificationsToUser(
      friendRequestTo,
      notification,
      "friend_request"
    );
    return res
      .status(201)
      .json(SuccessResponse("request send", 201, { friendshipRequest }));
  };
  responseFreindship = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const { requestFromId, response } = req.body;
    const friendship = await this.friendshipRepo.findOneDocument({
      requestFromId,
      requestToId: userId,
      status: friendshipEnum.pending,
    });
    if (!friendship) throw new notFoundException("user not found");
    friendship.status = response;
    const updated = await this.friendshipRepo.saveUpdate(friendship);
    if (response == friendshipEnum.accepted) {
      await redis.sadd(`friends:${userId}`, requestFromId);
      await redis.sadd(`friends:${requestFromId}`, userId as any);
      const { title, content } = notificationHandler("friend_response", {
        username: `${req.user?.username}`,
      });
      const notification = await this.notificationRepo.createDocument({
        userId: requestFromId,
        title,
        content,
      });
      await sendNotificationsToUser(
        requestFromId,
        notification,
        "friend_response"
      );
    }
    return res
      .status(200)
      .json(SuccessResponse("response send", 200, { updated }));
  };

  listRequests = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const { status } = req.query;
    const filters: FilterQuery<IFriendship> = { status };
    if (filters.status == friendshipEnum.accepted) {
      const friends = await redis.smembers(`friends:${userId}`);
      if (friends.length) {
        const users = await this.userRepo.findDocuments(
          { _id: { $in: friends } },
          { username: 1, profilePicture: 1 }
        );
        return res
          .status(200)
          .json(SuccessResponse("friends from redis", 200, { friends: users }));
      }
    }
    const requests = await this.friendshipRepo.findDocuments(
      {
        status: status,
        requestToId: userId,
      },
      { requestToId: 0 },
      {
        populate: [
          {
            path: "requestFromId",
            select: "username profilePicture",
          },
        ],
      }
    );
    if (!requests.length)
      return res.status(200).json(SuccessResponse("no requests found", 200));
    return res
      .status(200)
      .json(SuccessResponse(" requests ", 200, { requests }));
  };
  unfriend = async (req: Request, res: Response) => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const { friendId } = req.body;
    const friendship = await this.friendshipRepo.findOneDocument({
      $or: [
        { requestFromId: userId, requestToId: friendId },
        { requestFromId: friendId, requestToId: userId },
      ],
      status: friendshipEnum.accepted,
    });
    if (!friendship) throw new notFoundException("friendship not found");
    await this.friendshipRepo.deleteDocument({ _id: friendship._id });
    await redis.srem(`friends:${userId}`, friendId);
    await redis.srem(`friends:${friendId}`, userId as any);
    return res
      .status(200)
      .json(SuccessResponse("friend removed successfully", 200));
  };
  createGroup = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as string;
    const { name, memberIds } = req.body as IGroup;
    const members = await this.userRepo.findDocuments({
      _id: { $in: memberIds },
    });
    if (members.length !== memberIds.length)
      throw new notFoundException("users not found");
    const friends = await redis.smembers(`friends:${userId}`);
    if (friends.length) {
      const result = await redis.smismember(`friends:${userId}`, memberIds);
      const IsAllFriends = result.every((v) => v == 1);
      if (!IsAllFriends)
        throw new BadRequestException("Some members are not your friends");
    } else {
      const IsFriends = await this.friendshipRepo.findDocuments({
        $or: [
          { requestFromId: userId, requestToId: { $in: memberIds } },
          { requestToId: userId, requestFromId: { $in: memberIds } },
        ],
      });
      if (IsFriends.length !== memberIds.length) {
        throw new BadRequestException("Some members are not your friends");
      }
    }
    const Group = await this.conversationRepo.createDocument({
      name,
      members: [userId, ...memberIds],
      type: conversation.group,
    });
    return res
      .status(200)
      .json(SuccessResponse("group created", 200, { Group }));
  };
  listUserGroups = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as string;
    const groups = await this.conversationRepo.findDocuments(
      { members: { $in: userId }, type: conversation.group },
      { name: 1, members: 1, createdAt: 1 }
    );
    if (!groups.length) return [];
    return res
      .status(200)
      .json(SuccessResponse("groups found", 200, { groups }));
  };
  blockFriend = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    const { friendId } = req.body;
    if (user.blockFriends?.includes(friendId))
      throw new BadRequestException("user already blocked");
    const isExist = await this.userRepo.findByIdDocument(friendId);
    if (!isExist) throw new notFoundException("user not found");
    user?.blockFriends?.push(friendId);
    await this.userRepo.updateUser(user);
    if (await redis.sismember(`friends:${user?._id}`, friendId)) {
      const friendship = await this.friendshipRepo.findOneDocument({
        $or: [
          { requestFromId: userId, requestToId: friendId },
          { requestFromId: friendId, requestToId: userId },
        ],
        status: friendshipEnum.accepted,
      });
      await this.friendshipRepo.deleteDocument({ _id: friendship?._id });
      await Promise.all([
        redis.srem(`friends:${userId}`, friendId),
        redis.srem(`friends:${friendId}`, userId as any),
      ]);
    }
    await redis.sadd(`blocked_friends:${userId}`, friendId);
    return res.status(200).json(SuccessResponse("user blocked", 200));
  };
  unBlockFriend = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    const { friendId } = req.body;
    const isExist = user.blockFriends?.includes(friendId);
    if (!isExist)
      throw new notFoundException("user not found in your block list");
    user.blockFriends = user.blockFriends?.filter((f) => {
      return f.toString() !== friendId.toString();
    });
    await this.userRepo.updateUser(user);
    await redis.srem(`blocked_friends:${userId}`, friendId);
    return res.status(200).json(SuccessResponse("user  unblocked", 200));
  };
  blockFriendsList = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    let list_redis = await friends_Blacklist(userId);
    let blockedIds: string[] = [];
    if (list_redis.length > 0) {
      blockedIds = list_redis;
    } else if (user.blockFriends && user.blockFriends.length > 0) {
      blockedIds = user.blockFriends.map((id: any) => id.toString());
    } else {
      return [];
    }
    const blockedUsers = await this.userRepo.findDocuments(
      { _id: { $in: blockedIds } },
      {
        username: 1,
        profilePicture: 1,
      }
    );
    return res
      .status(200)
      .json(SuccessResponse("users blocked", 200, { blockedUsers }));
  };
  logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(204);
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: any, decoded: any) => {
        if (!err && decoded.jti) {
          await redis.del(`refreshToken:${decoded.id}:${decoded.jti}`);
          await redis.set(
            `tokens_blacklist:${accessToken}`,
            "0",
            "EX",
            60 * 30
          );
        }
        return res.clearCookie("refreshToken").sendStatus(204);
      }
    );
    return;
  };
  logoutAllDevices = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: any, decoded: any) => {
        if (!err && decoded.jti) {
          const keys = await redis.keys(`refreshToken:${decoded.id}:*`);
          if (keys.length) await redis.del(keys);
        }
        return res.clearCookie("refreshToken").sendStatus(204);
      }
    );
    return;
  };
  deleteAccount = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const userId = user._id as mongoose.Types.ObjectId;
    const session = await mongoose.startSession();
    req.session = session;
    session.startTransaction();
    const deleted = await this.userRepo.findByIdAndDeleteDocument(
      user._id as mongoose.Types.ObjectId,
      { session }
    );
    await this.postRepo.deleteManyDocuments({ userId }, { session });
    await this.commnetRepo.deleteManyDocuments({ userId }, { session });
    await session.commitTransaction();
    session.endSession();
    await this.s3Client.deleteListderictory(userId.toString());
    return res
      .status(200)
      .json(SuccessResponse("account deleted", 200, { deleted }));
  };
  //graphQl
  profileInfo = async (userId: string) => {
    const user = await this.userRepo.findByIdDocument(userId, {
      blockFriends: 0,
    });
    if (!user) throw new BadRequestException(`User not found`);
    if (user.phone) user.phone = decrypt(user.phone);
    return user;
  };
  blockFriends = async (userId: string) => {
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    let list_redis = await friends_Blacklist(userId);
    let blockedIds: string[] = [];
    if (list_redis.length > 0) {
      blockedIds = list_redis;
    } else if (user.blockFriends && user.blockFriends.length > 0) {
      blockedIds = user.blockFriends.map((id: any) => id.toString());
    } else {
      return [];
    }
    const blockedUsers = await this.userRepo.findDocuments(
      { _id: { $in: blockedIds } },
      {
        blockFriends: 0,
      }
    );
    return blockedUsers;
  };
  Requests = async (userId: string, status: friendshipEnum) => {
    if (status == friendshipEnum.accepted) {
      const friends = await redis.smembers(`friends:${userId}`);
      if (friends.length) {
        const users = await this.userRepo.findDocuments(
          { _id: { $in: friends } },
          { username: 1, profilePicture: 1 }
        );
        return users;
      }
    }
    const requests = await this.friendshipRepo.findDocuments(
      {
        status: status,
        requestToId: userId,
      },
      { requestToId: 0 },
      {
        populate: [
          {
            path: "requestFromId",
            select: "username profilePicture coverPicture",
          },
        ],
      }
    );
    if (!requests.length) return "not found requests";
    return requests;
  };
}
export default new ProfileServices();
