import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    applicants: [],
    allAppliedJobs: [],
};

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        }
    }
});

export const { setAllApplicants, setAllAppliedJobs } = applicationSlice.actions;
export default applicationSlice.reducer;