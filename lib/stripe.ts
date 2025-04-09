import { initStripe } from '@stripe/stripe-react-native';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RBVHCQXSF1TGROkkMttcuZVg2Lj3K0GYsHikIqA4gITbA2FcvmqeZ8Ycjwqaowuu8QZxRu1TbpIMzqonrrUxyO000uuHrMbXk';

export const initializeStripe = async () => {
  await initStripe({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    merchantIdentifier: 'merchant.com.heatwaves', // Replace with your merchant identifier
    urlScheme: 'heatwaves', // Should match your app scheme
  });
};
