export const formatNumber = (value: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const slugify = (input: string): string => {
  return input
    .toLocaleLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
