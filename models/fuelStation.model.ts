import { Schema, model } from 'mongoose'


interface FuelStation {
    fuelName: string;
    location: string;
    phoneNumbr: string;
    fuel: string;
}

const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere"
  }
})

const schema = new Schema<FuelStation>({
    fuelName: { type: String, required: true },
    location: GeoSchema,
    fuel: [{
      name: { type: String },
      type: { type: String },
      price: { type: Number }
    }]
})

const FuelStationModel = model<FuelStation>('FuelStation', schema)

export default FuelStationModel