"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hashPassword = async (password) => {
    const hashedPasswordString = await bcrypt_1.default.hash(password, saltRounds);
    return Buffer.from(hashedPasswordString, 'utf-8');
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    const hashedPasswordString = hash.toString('utf-8');
    return await bcrypt_1.default.compare(password, hashedPasswordString);
};
exports.comparePassword = comparePassword;
