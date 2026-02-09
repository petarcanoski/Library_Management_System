  export const getStatusColor = (status) => {
    const colors = {
      PENDING: {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-200",
        gradient: "from-yellow-100 to-yellow-200",
      },
      AVAILABLE: {
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-200",
        gradient: "from-green-100 to-green-200",
      },
      FULFILLED: {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
        gradient: "from-blue-100 to-blue-200",
      },
      CANCELLED: {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
        gradient: "from-red-100 to-red-200",
      },
      EXPIRED: {
        bg: "bg-gray-50",
        text: "text-gray-800",
        border: "border-gray-200",
        gradient: "from-gray-100 to-gray-200",
      },
    };
    return colors[status] || colors.EXPIRED;
  };