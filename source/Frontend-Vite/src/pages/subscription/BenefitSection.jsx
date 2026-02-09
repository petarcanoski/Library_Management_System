import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

const BenefitSection = () => {
  return (
    <Box
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 6 },
            mt: 8,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Why Subscribe?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.9)',
              mb: 5,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Unlock the full potential of your reading experience
          </Typography>

          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: 48,
                    mb: 2,
                  }}
                >
                  📚
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                  More Books
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                  Borrow multiple books simultaneously with premium plans and never run out of reading material
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: 48,
                    mb: 2,
                  }}
                >
                  ⚡
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                  Extended Duration
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                  Keep books longer with extended loan periods and enjoy your reading at your own pace
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: 48,
                    mb: 2,
                  }}
                >
                  💎
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                  Exclusive Access
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                  Get priority access to new releases and exclusive content available only to subscribers
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
  )
}

export default BenefitSection