import React from 'react';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';

const Checkout = ({ activeStep }) => {
  const steps = [
    {
      label: <h3>Shipping Details</h3>,
      icons: <LocalShippingOutlinedIcon />,
    },
    {
      label: <h3>Confirm Orders</h3>,
      icons: <CheckCircleOutlinedIcon />,
    },
    {
      label: <h3>Payment</h3>,
      icons: <AccountBalanceWalletOutlinedIcon />,
    },
  ];
  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((item, index) => (
            <Step
              key={index}
              active={activeStep === index ? true : false}
              className={activeStep >= index ? 'text-blue-600' : 'text-black'}
            >
              <StepLabel icon={item.icons}>{item.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};

export default Checkout;
