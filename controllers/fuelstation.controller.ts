import FuelStationModel from "../models/fuelStation.model";
import { MongoClient } from "mongoose/node_modules/mongodb";

const getFuelStationData = async (req: any, res: any, nex: any) => {

    try {
        const users = await FuelStationModel.find()

        return res.status(200).json({ success: true, count: users.length, data: users })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ e: 'Server error' })
    }

}

/*const geoGet = async (req: any, res: any, next: any) => {
    const options = {
        location: {
            $geoWithin: {
                $centerSphere: [[-79.789, 25.01], 15 / 3963.2]
            }
        }
    }

    await FuelStationModel.find(options).then(data => {
        res.json(data)
    })
}*/

const getDataByID = async (req: any, res: any, next: any) => {

    const id = req.params.id

    try {
        const fuelStation = await FuelStationModel.findById(id)
        return res.status(200).json({ success: true, data: fuelStation })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ e: 'Error server' })
    }

}

const addFuelStationData = async (req: any, res: any, next: any) => {
    try {
        const users = await FuelStationModel.create(req.body)

        return res.status(200).json({ success: true, data: users })

    } catch (e) {
        console.error(e)
        return res.status(500).json({ e: 'Error server' })
    }

}

const deleteFuelData = (req: any, res: any) => {
    const id = req.params.id;

    FuelStationModel.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                return res.status(400).json({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                return res.json({ message: 'Station was deleted successfully' })
            }
        })
        .catch(e => {
            return res.status(500).json({ message: 'Could not delete Station with id=' + id })
        })
}

export default { getFuelStationData, addFuelStationData, deleteFuelData, getDataByID, /*geoGet*/}
