import { z } from "zod";

export default defineNuxtPlugin(() => {
  z.config({
    customError: (issue) => {
      if (issue.code === "invalid_type" && issue.input === undefined) {
        return "Required";
      }
    },
  });
});
