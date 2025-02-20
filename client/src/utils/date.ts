export const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) {
    return "-";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString("en-CA");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "-";
  }
};

export const detailFormatDate = (dateString: string | undefined | null) => {
  if (!dateString) {
    return "-";
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "-";
  }
};
