import type { NextApiRequest, NextApiResponse } from 'next';
const api = (req:NextApiRequest,res:NextApiResponse)=>{
    if(req.method === 'GET'){
        return res.status(200).json({
            message: 'Get api success'
        })
    }
}


export default api;