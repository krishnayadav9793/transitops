import express from 'express';
import multer from 'multer';
import { 
    getVehicles, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle, 
    getVehicleTypes, 
    getDocumentTypes, 
    uploadDocument 
} from '../controllers/vehicleController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Configure Multer for local document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();

router.use(authenticateToken);
router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.get('/types', getVehicleTypes);
router.get('/documents/types', getDocumentTypes);
router.post('/documents', upload.single('document'), uploadDocument);

export default router;