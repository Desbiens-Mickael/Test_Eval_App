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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../../lib/db");
var seed = function () { return __awaiter(void 0, void 0, void 0, function () {
    var subjects, gradeLevels, levels;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // create LessonSubject
            return [4 /*yield*/, db_1.prisma.lessonSubject.createMany({
                    data: [
                        {
                            label: "Mathématique",
                            color: "bg-green-500",
                        },
                        {
                            label: "Français",
                            color: "bg-sky-500",
                        },
                        {
                            label: "Histoire",
                            color: "bg-yellow-500",
                        },
                        {
                            label: "Physique",
                            color: "bg-red-500",
                        },
                    ],
                })];
            case 1:
                // create LessonSubject
                _a.sent();
                return [4 /*yield*/, db_1.prisma.lessonSubject.findMany()];
            case 2:
                subjects = _a.sent();
                // create GradeLevels for user
                return [4 /*yield*/, db_1.prisma.gradeLevels.createMany({
                        data: [
                            {
                                label: "CP",
                                color: "bg-red-500",
                            },
                            {
                                label: "CE1",
                                color: "bg-orange-500",
                            },
                            {
                                label: "CE2",
                                color: "bg-green-500",
                            },
                            {
                                label: "CM1",
                                color: "bg-blue-500",
                            },
                            {
                                label: "CM2",
                                color: "bg-purple-500",
                            },
                            {
                                label: "6e",
                                color: "bg-pink-500",
                            },
                            {
                                label: "5e",
                                color: "bg-indigo-500",
                            },
                            {
                                label: "4e",
                                color: "bg-yellow-500",
                            },
                            {
                                label: "3e",
                                color: "bg-amber-500",
                            },
                        ],
                    })];
            case 3:
                // create GradeLevels for user
                _a.sent();
                return [4 /*yield*/, db_1.prisma.gradeLevels.findMany()];
            case 4:
                gradeLevels = _a.sent();
                // create Level
                return [4 /*yield*/, db_1.prisma.exerciceLevel.createMany({
                        data: [
                            {
                                label: "Facile",
                                color: "bg-green-500",
                            },
                            {
                                label: "Difficile",
                                color: "bg-yellow-500",
                            },
                            {
                                label: "Très difficile",
                                color: "bg-red-500",
                            },
                        ],
                    })];
            case 5:
                // create Level
                _a.sent();
                return [4 /*yield*/, db_1.prisma.exerciceLevel.findMany()];
            case 6:
                levels = _a.sent();
                return [4 /*yield*/, db_1.prisma.exerciceType.createMany({
                        data: [
                            {
                                name: "Carte",
                            },
                            {
                                name: "Vrai ou Faux",
                            },
                            {
                                name: "Texte à trou",
                            },
                            {
                                name: "Choix multiple",
                            },
                        ],
                    })];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
seed();
