package com.library.payload.response;

import lombok.Data;

@Data
public class RevenueStatisticsResponse {

    public double monthlyRevenue;
    public String currency;
    public int year;
    public int month;
}
