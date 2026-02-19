import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const CategoryCarousel = () => {
  const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <div className="my-10 px-4 relative">
      <Carousel className="w-full max-w-6xl mx-auto">
        {/* Carousel content */}
        <CarouselContent className="flex gap-4 overflow-x-auto snap-x snap-mandatory touch-pan-x">
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="
                basis-full
                sm:basis-1/2
                md:basis-1/3
                lg:basis-1/4
                flex justify-center
                snap-start
              "
            >
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="
                  w-full
                  sm:w-auto
                  rounded-full
                  px-6
                  py-3
                  text-sm
                  hover:bg-purple-600
                  hover:text-white
                  transition
                "
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows (always visible) */}
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 sm:left-2">
          <Button variant="outline" className="p-2 rounded-full">‹</Button>
        </CarouselPrevious>
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 sm:right-2">
          <Button variant="outline" className="p-2 rounded-full">›</Button>
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
