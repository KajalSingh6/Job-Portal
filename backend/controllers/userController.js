import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import getDataUri from "../utils/getUri.js";
import cloudinary from "../utils/cloudinary.js";


const registerAuth = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, email, password, phone, role } = req.body;

        if (!fullName || !email || !password || !phone || !role) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        user = await userModel.create({
            fullName,
            email,
            password: hashPassword,
            phone,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        const data = {
            userId: user._id
        };

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(201).cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }).json({ success: true, message: " User registered successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const loginAuth = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({ success: false, message: "Account doesn't exist with current role." })
        }

        const data = {
            userId: user._id
        }

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'lax' }).json({ success: true, message: `Welcome back ${user.fullName}`, user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


const updateProfile = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { fullName, email, phone, bio, skills } = req.body;
        const file = req.file;

        if (typeof skills === "string") {
            skills = JSON.parse(skills);
        }

        const userId = req.id;
        const user = await userModel.findById(userId);

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skills || user.profile.skills;

      
        if (file) {
            const base64File = file.buffer.toString("base64");
            const dataUri = `data:${file.mimetype};base64,${base64File}`;

            const cloudResponse = await cloudinary.uploader.upload(dataUri, {
                folder: "resumes",
                resource_type: "raw"
            });

            user.profile.resume = cloudResponse.secure_url;   
            user.profile.resumeOriginalName = file.originalname;

        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


export { registerAuth, loginAuth, logout, updateProfile };