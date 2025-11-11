import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import bcrypt from "bcryptjs";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return next(new ErrorHandler("Please add all fields", 400));
    const existingUser = await User.findOne({ email });
    if (existingUser)
        return next(new ErrorHandler("User already exists. Please log in.", 400));
    const user = await User.create({
        name,
        email,
        password,
    });
    return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
        user,
    });
});
export const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new ErrorHandler("Please provide an email and password to login", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        return next(new ErrorHandler("User not found, please sign up first", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({ success: true, users });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    return res.status(200).json({ success: true, user });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
export const updateUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const { name, photo, gender, dob } = req.body;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    if (name)
        user.name = name;
    if (photo)
        user.photo = photo;
    if (gender)
        user.gender = gender;
    if (dob)
        user.dob = new Date(dob);
    await user.save();
    return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user,
    });
});
