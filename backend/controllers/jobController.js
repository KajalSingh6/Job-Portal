
import { validationResult } from "express-validator";
import jobModel from "../models/jobModel.js";

// for Amdin
const postJob = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, description, salary, location, jobType, requirements, experienceLevel, position, company } = req.body;
        const userId = req.id;

        if (!title || !description || !salary || !location || !jobType || !requirements?.length || !experienceLevel || !position || !company) {
            return res.status(400).json({ success: false, message: "Something is missing." });
        }
        const job = await jobModel.create({
            title,
            description,
            requirements,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position,
            company,
            created_by: userId
        });
        return res.status(201).json({ success: true, message: "New job created successfully", job });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }

}

// for students
const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {

            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await jobModel.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({ success: false, message: "Jobs not found." });
        }
        return res.status(200).json({ success: true, jobs });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await jobModel.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({ success: false, message: "Jobs Not Found." });
        }
        return res.status(200).json({ success: true, jobs });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

// for students
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobModel.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job Not Found." });
        }
        return res.status(200).json({ success: true, job });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

// for Admin - update job
const updateJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID missing" });
        }

        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job Not Found." });
        }

        const {
            title,
            description,
            salary,
            location,
            jobType,
            requirements,
            experienceLevel,
            position,
            company
        } = req.body;

        job.title = title || job.title;
        job.description = description || job.description;
        job.salary = salary ? Number(salary) : job.salary;
        job.location = location || job.location;
        job.jobType = jobType || job.jobType;

        // force array
        if (requirements) {
            job.requirements = Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map(r => r.trim()).filter(Boolean);
        }

        job.experienceLevel = experienceLevel ? Number(experienceLevel) : job.experienceLevel;
        job.position = position ? Number(position) : job.position;
        job.company = company || job.company;

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};



export { getAllJobs, postJob, getJobById, getAdminJobs, updateJob };