import React, { useEffect, useState } from "react";
import { RadioGroup } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const FilterCard = () => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    Location: "",
    Industry: "",
    Salary: "",
  });

  const filterData = [
    {
      filterType: "Location",
      arrays: ["Delhi NCR", "Banglore", "Hydrabad", "Pune", "Mumbai"],
    },
    {
      filterType: "Industry",
      arrays: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
    },
    {
      filterType: "Salary",
      arrays: [ "1lakh to 5lakh", "5lakh to 10lakh", "10lakh to 25lakh", "25lakh to 50lakh"],
    },
  ];

  const changeHandler = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Send updated filters to Redux whenever they change
  useEffect(() => {
    dispatch(setSearchedQuery(filters));
  }, [filters, dispatch]);

  return (
    <div className="w-full bg-white rounded-md p-3">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3 mb-3" />

      {filterData.map((data) => (
        <div key={data.filterType} className="mb-4">
          <h1 className="font-bold text-md mb-2">{data.filterType}</h1>

          <RadioGroup
            value={filters[data.filterType]}
          >
            {data.arrays.map((item, idx) => {
              const itemId = `${data.filterType}-${idx}`;
              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-2 my-1"
                >
                  <input
                    type="radio"
                    name={data.filterType}   // group ke liye important
                    value={item}
                    id={itemId}
                    checked={filters[data.filterType] === item}
                    onChange={() => changeHandler(data.filterType, item)}
                    className="h-4 w-4 cursor-pointer shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none"
                  />

                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </RadioGroup>

        </div>
      ))}
    </div>
  );
};

export default FilterCard;
