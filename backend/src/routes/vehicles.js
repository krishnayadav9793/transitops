import express from 'express';
import multer from 'multer';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, getVehicleTypes, getDocumentTypes, uploadDocument } from '../controllers/vehicleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();
router.use(authMiddleware);

router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.get('/types', getVehicleTypes);
router.get('/documents/types', getDocumentTypes);
router.post('/documents', upload.single('document'), uploadDocument);

export default router;