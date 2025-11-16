"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const db_connection_1 = __importDefault(require("./DB/db.connection"));
const controllors = __importStar(require("./modules/controllor.index"));
const Errors_1 = require("./common/Errors");
const utils_1 = require("./utils");
const middlwares_1 = require("./middlwares");
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("graphql-http/lib/use/express");
const graphQl_1 = require("./graphQl");
const swagger_config_1 = require("./swagger.config");
dotenv_1.default.config({ path: "./dev.env" });
const app = (0, express_1.default)();
app.use((0, helmet_1.default)(), (0, hpp_1.default)());
app.use(express_1.default.json(), (0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(middlwares_1.httpLogger);
app.all("/graphql", (0, express_2.createHandler)({
    schema: graphQl_1.schema,
    context: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const User = yield (0, middlwares_1.verifyGraphQLContext)(req);
        return { User };
    }),
}));
(0, db_connection_1.default)();
app.use("/api/home", controllors.homeRouter);
app.use("/api/auth", controllors.authControllor);
app.use("/api/profile", controllors.profileControllor);
app.use("/api/posts", controllors.postControllor);
app.use("/api/admin", controllors.adminRouter);
(0, swagger_config_1.swaggerDocs)(app);
app.use((req, res) => {
    res.status(404).json({ message: `Page Not Found` });
});
app.use((err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session && req.session.inTransaction()) {
        yield req.session.abortTransaction();
        req.session.endSession();
    }
    if (err instanceof Errors_1.AppError) {
        return res
            .status(err.statusCode)
            .json((0, utils_1.FailerResponse)(err.message, err.statusCode, err.error));
    }
    return res.status(500).json({
        messsage: "something broking",
        context: err.message,
        stck: err.stack,
    });
}));
exports.default = app;
