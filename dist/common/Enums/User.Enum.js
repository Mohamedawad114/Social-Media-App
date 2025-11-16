"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendshipEnum = exports.Provider = exports.Gender = exports.Sys_Role = void 0;
var Sys_Role;
(function (Sys_Role) {
    Sys_Role["user"] = "user";
    Sys_Role["admin"] = "admin";
})(Sys_Role || (exports.Sys_Role = Sys_Role = {}));
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
    Gender["other"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var Provider;
(function (Provider) {
    Provider["local"] = "local";
    Provider["google"] = "google";
})(Provider || (exports.Provider = Provider = {}));
var friendshipEnum;
(function (friendshipEnum) {
    friendshipEnum["pending"] = "pending";
    friendshipEnum["accepted"] = "accepted";
    friendshipEnum["rejected"] = "rejected";
})(friendshipEnum || (exports.friendshipEnum = friendshipEnum = {}));
