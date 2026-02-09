import React from "react"
import { Card, CardContent } from "@mui/material"


const StatsCard = ({ icon, value, title, subtitle, bgColor, textColor }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            {icon}
          </div>

          <span className={`text-3xl font-bold ${textColor}`}>
            {value}
          </span>
        </div>

        <p className="text-gray-700 font-semibold mb-1">
          {title}
        </p>
        <p className="text-sm text-gray-600">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  )
}

export default StatsCard
