"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { submitForm } from "@/lib/api";
import { Form as FormModel } from "@/models/form";

const formSchema = z.object({
  title: z.string().min(1).max(255),
  contact: z.string().min(1).max(255),
  stars: z.number().min(1).max(5),
  message: z.string(),
});

export const ContactSection = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      contact: "",
      stars: 5,
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, contact, stars, message } = values;

    submitForm({ title, contact, stars, message })
      .then(() => {
        toast.success("Form submitted successfully!");
        form.reset();
      })
      .catch(() => {
        toast.error("Failed to submit the form.");
      });
  }

  return (
    <section id="contact" className="homepage-container py-10 sm:py-20">
      <Separator className="mb-20" />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4 text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-extrabold">
              <span className="relative">
                <span className="text-gradient bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                  Connect With Us
                </span>
                <svg
                  className="absolute -bottom-2 w-full left-0"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C47.6667 2.16667 154.4 -2.4 199 6"
                    stroke="url(#paint0_linear)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="1"
                      y1="5"
                      x2="199"
                      y2="5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#D247BF" />
                      <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
          </div>
          <img src="/home/contact_us.png" alt="Contact Us" className="mt-4" />
        </div>

        <Card>
          <CardHeader className="text-primary text-2xl"> </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full gap-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Your contact info" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stars</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stars">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < field.value
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <SelectItem key={value} value={value.toString()}>
                              <div className="flex">
                                {[...Array(value)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="text-yellow-400 h-5 w-5 fill-current"
                                  />
                                ))}
                                {[...Array(5 - value)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="text-gray-300 h-5 w-5 fill-current"
                                  />
                                ))}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={7}
                          placeholder="Your message..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mt-4">Send message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </section>
  );
};
