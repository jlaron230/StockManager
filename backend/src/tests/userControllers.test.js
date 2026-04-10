// tests/userControllers.test.js
const userControllers = require("../controllers/userControllers");
const tables = require("../models");

jest.mock("../models", () => ({
    user: {
        findById: jest.fn(),
        updateProfile: jest.fn(),
        updateFcmToken: jest.fn(),
        updateTokenMobil: jest.fn(),
        findAll: jest.fn(),
        delete: jest.fn(),
        updateUser: jest.fn(),
        create: jest.fn(),
        findUserByEmail: jest.fn(),
    },
}));

describe("userControllers.getProfile", () => {
    it("should return user profile if authenticated", async () => {
        const mockUser = { id: 1, nom: "John", email: "john@example.com" };
        tables.user.findById.mockResolvedValue([[mockUser]]);

        const req = { session: { user: { id: 1 } } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: jest.fn(),
        };

        await userControllers.getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 401 if not authenticated", async () => {
        const req = { session: {} };
        const res = { sendStatus: jest.fn() };

        await userControllers.getProfile(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
        tables.user.findById.mockResolvedValue([[]]);

        const req = { session: { user: { id: 1 } } };
        const res = { sendStatus: jest.fn() };

        await userControllers.getProfile(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error", async () => {
        tables.user.findById.mockRejectedValue(new Error("DB error"));

        const req = { session: { user: { id: 1 } } };
        const res = { sendStatus: jest.fn() };

        await userControllers.getProfile(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
});
