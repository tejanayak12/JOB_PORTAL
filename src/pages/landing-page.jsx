import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import {
  Card, CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import companies from "../data/companies.json";
import faq from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"




const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 py-10 sm:gap-20 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center py-4 text-4xl font-extrabold tracking-tighter gradient-title sm:text-6xl lg:text-8xl">
          Find Your Dream Job {''}
          <span className="flex items-center gap-2 sm:gap-6">And Get
            <img src="/logo.png" alt="Hirrd logo" className="h-14 sm:h-24 lg:h-32" />
          </span>
        </h1>
        <p className="text-xs text-gray-300 sm:mt-4 sm:text-xl">
          Explore thousands of job listings or find the perfect candidate for your company.
        </p>
      </section>

      <div className="flex justify-center gap-6 mt-6">
        <Link to='/jobs'>
          <Button variant='blue' size='xl'>
            Find Jobs
          </Button>
        </Link>
        <Link to='/post-job'>
          <Button variant='destructive' size='xl'>
            Post Job
          </Button>
        </Link>
      </div>
      {/* Carousel */}
      <Carousel plugins={[Autoplay({ delay: 900 })]} className="container w-full py-10">
        <CarouselContent className='flex items-center gap-5 sm:gap-20'>
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className='basis-1/3 lg:basis-1/6'>
                <img src={path} alt={name} className="object-contain h-9 sm:h-14" />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* banner */}

      <img src="/banner3.png" alt="banner of hrrd" className="w-full" />


      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and get hired.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post Job, track applications, and hire the right candidate.
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}

      <Accordion type="single" collapsible>
        {faq.map((faq, index) => {
          return (<AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
          )
        })}
      </Accordion>

    </main>
  );
};

export default LandingPage;
