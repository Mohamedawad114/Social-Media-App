"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    createDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(document);
        });
    }
    findDocuments(filter, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find(filter !== null && filter !== void 0 ? filter : {}, projection, options);
        });
    }
    findOneDocument(filter, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter, projection, options);
        });
    }
    findByIdDocument(id, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id, projection, options);
        });
    }
    findByIdAndDeleteDocument(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndDelete(id, options);
        });
    }
    findAndUpdateDocument(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, payload, { new: true });
        });
    }
    deleteDocument(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteOne(filter, options);
        });
    }
    updateDocument(filter, payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.updateOne(filter, payload, options);
        });
    }
    updateManyDocuments(filter, payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.updateMany(filter, payload, options);
        });
    }
    deleteManyDocuments(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteMany(filter, options);
        });
    }
    countDocuments(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(filter, options);
        });
    }
}
exports.BaseRepository = BaseRepository;
