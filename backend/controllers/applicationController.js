
import applicationModel from "../models/applicationModel.js";
import jobModel from "../models/jobModel.js";

const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job id is required." });
        }

        // check if the user has already applied for the job
        const existingApplication = await applicationModel.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this jobs" });
        }

        // check if the jobs exists
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job Not Found." });
        }

        // create a new application
        const newApplication = await applicationModel.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({ success: true, message: "Job applied successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }

}

const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await applicationModel.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job', options: { sort: { createdAt: -1 } },
            populate: { path: 'company', options: { sort: { createdAt: -1 } } }
        });
        if (!application) {
            return res.status(404).json({ success: false, message: "No applications!" });
        }
        return res.status(200).json({ success: true, application });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }

}

// Admin dekhega kitne user ne apply kiyahai
const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobModel.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
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

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        // find the application by application id
        const application = await applicationModel.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({ success: false, message: "Application Not Found." });
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({ success: true, message: "Updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }

}

export { applyJob, getAppliedJobs, getApplicants, updateStatus };