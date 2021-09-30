import { Router } from "express";
import fuelStationController from "../controllers/fuelstation.controller";


const router = Router()

router.get('/fuelstations/', fuelStationController.getFuelStationData)
router.get('/fuelstations/:id', fuelStationController.getDataByID)
//router.get('/fuelstations/geo', fuelStationController.geoGet)
router.post('/fuelstations', fuelStationController.addFuelStationData)
router.delete('/fuelstations/:id', fuelStationController.deleteFuelData)

export default router
