import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile,
                state: user.state,
                district: user.district,
                taluka: user.taluka,
                village: user.village,
                farmSize: user.farmSize,
                aadhar: user.aadhar,
                gender: user.gender,
                isAccountVerified: user.isAccountVerified,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};