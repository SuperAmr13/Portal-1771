import { getSeat } from "../../lib/seats";

export default function handler(req,res){
  const data = req.body;
  const seat = getSeat(data.power);
  res.json({success:true, seat});
}
