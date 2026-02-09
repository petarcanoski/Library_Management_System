export const getDurationText = (plan) => {
  switch (plan?.durationDays) {
    case 30:
      return 'Monthly';
    case 90:
      return 'Quarterly (3 Month)';
    case 180:
      return '6 Month';
    case 365:
      return 'Yearly';
    default:
      return `${plan?.durationDays} days`;
  }
};