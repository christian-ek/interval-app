"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Interval from "@/types/interval";
import {
  parseIntervals,
  areValidNumbers,
  isStartLessThanOrEqualToEnd,
  areIntegers,
  hasValidFormat,
  processIntervals,
} from "@/lib/intervals";
import Result from "@/components/Result";

const stringToIntervals = z
  .string()
  .optional()
  .superRefine((val, ctx) => {
    if (!val) return;
    if (!hasValidFormat(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Intervals must be in the format XX-YY, separated by commas. Negative numbers are not allowed.",
        fatal: true,
      });
    }
  })
  .transform((val): Interval[] => parseIntervals(val))
  .superRefine((intervals, ctx) => {
    if (!areValidNumbers(intervals)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All intervals must be valid numbers separated by commas",
      });
    }

    if (!isStartLessThanOrEqualToEnd(intervals)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start of the interval must be equal to or less than the end",
      });
    }

    if (!areIntegers(intervals)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All interval values must be integers",
      });
    }
  });

const FormSchema = z.object({
  includes: stringToIntervals.refine((intervals) => intervals.length > 0, {
    message: "Includes must have at least one interval.",
  }),
  excludes: stringToIntervals.optional(),
});

export default function IntervalForm() {
  const [result, setResult] = useState<null | string>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      includes: undefined,
      excludes: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const includeIntervals = data.includes || [];
    const excludeIntervals = data.excludes || [];
    const resultIntervals = processIntervals(
      includeIntervals,
      excludeIntervals
    );
    const formattedResult = resultIntervals
      .map((interval) => interval.toString())
      .join(", ");
    setResult(formattedResult);
  }

  return (
    <div className="flex w-auto flex-col items-center space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="includes"
              render={({ field }) => (
                <FormItem className="w-96">
                  <FormLabel>Included intervals</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 1-100, 20-200"
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter intervals to include (e.g., 1-100, 20-200).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excludes"
              render={({ field }) => (
                <FormItem className="w-96">
                  <FormLabel>Excluded intervals</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 5-50, 60-120"
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter intervals to exclude (e.g., 5-50, 60-120).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      {result && <Result result={result} />}
    </div>
  );
}
