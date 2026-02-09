  export const getDaysRemainingColor = (days) => {
    if (days < 0) return "error";
    if (days <= 3) return "warning";
    return "success";
  };