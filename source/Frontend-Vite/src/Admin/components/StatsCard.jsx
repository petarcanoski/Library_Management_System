import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
  trendValue,
  subtitle,
  loading = false,
}) {
  const colorMap = {
    primary: { main: '#667eea', light: '#764ba2' },
    success: { main: '#4caf50', light: '#66bb6a' },
    warning: { main: '#ff9800', light: '#ffa726' },
    error: { main: '#f44336', light: '#ef5350' },
    info: { main: '#2196f3', light: '#42a5f5' },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${selectedColor.main} 0%, ${selectedColor.light} 100%)`,
        color: 'white',
        boxShadow: `0 8px 24px ${alpha(selectedColor.main, 0.25)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${alpha(selectedColor.main, 0.35)}`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.75rem',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {loading ? '...' : value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  display: 'block',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              width: 56,
              height: 56,
            }}
          >
            <Icon sx={{ fontSize: 30 }} />
          </Avatar>
        </Box>

        {trend !== undefined && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {trend === 'up' ? (
              <TrendingUp sx={{ fontSize: 18 }} />
            ) : (
              <TrendingDown sx={{ fontSize: 18 }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {trendValue}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, ml: 0.5 }}>
              from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
