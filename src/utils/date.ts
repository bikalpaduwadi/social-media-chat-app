import { formatDate, formatDistanceToNowStrict } from "date-fns";

export const formatRelativeDate = (from: Date) => {
  const currentDate = new Date();

  const isDateDiffLessThanADay =
    currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000;

  if (isDateDiffLessThanADay) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d yyyy");
    }
  }
};
