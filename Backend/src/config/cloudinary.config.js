import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vehicle-booking-system',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => {
        const userType = req.user ? 'user' : 'captain';
        const id = req.user ? req.user._id : req.captain._id;
        return `${userType}-${id}-${Date.now()}`;
    },
  },
});

const upload = multer({ storage: storage });

export default upload;
