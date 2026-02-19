import companyModel from "../models/companyModel.js";
import getDataUri from "../utils/getUri.js";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";


const registerCompany = async (req, res) => {
    try {

        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({ success: false, message: "Company name is required!" });
        }
        let company = await companyModel.findOne({
            name: companyName
        });
        if (company) {
            return res.status(400).json({ success: false, message: "Company already exists." })
        }
        company = await companyModel.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({ success: true, message: "Company registered successfully", company })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

const getCompany = async (req, res) => {
    try {
        const userId = req.id; //logged in user id
        const companies = await companyModel.find({ userId });
        if (!companies) {
            return res.status(404).json({ success: false, message: "Companies not found!" });
        }
        return res.status(200).json({ success: true, companies });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }

}


const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await companyModel.findById(companyId);

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found!" });
        }
        return res.status(200).json({ success: true, company });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }

}

const updateCompany = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, description, website, location } = req.body;

        const file = req.file;

        // cloudinary is here....
        let logo;

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }
        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;


        const company = await companyModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found!" });
        }

        return res.status(200).json({ success: true, message: "Company information updated", company });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }

}

export { registerCompany, getCompany, getCompanyById, updateCompany };