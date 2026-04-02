import cron from 'node-cron';
import User from './Models/User.js';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running daily subscription cleanup...');
    try {
        const now = new Date();

        // Find users with expired subscriptions that are NOT free
        const result = await User.updateMany(
            {
                'subscription.expiry': { $lt: now },
                'subscription.plan': { $ne: 'free' }
            },
            {
                $set: {
                    'subscription.plan': 'free',
                    'subscription.expiry': null
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Downgraded ${result.modifiedCount} expired subscriptions to Free plan.`);
        } else {
            console.log('✅ No expired subscriptions found.');
        }

    } catch (error) {
        console.error('❌ Error in subscription cleanup cron:', error);
    }
});

export default cron;
