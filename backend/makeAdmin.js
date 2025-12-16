const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email: 'naman12@gmail.com' });

        if (!user) {
            console.log('User naman12@gmail.com not found');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Success! User ${user.name} is now an Admin.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
