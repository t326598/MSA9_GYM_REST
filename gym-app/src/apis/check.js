
import api from './api';



export const check = (uuid,qrNo) => api.get(`/user/attendance/check/${qrNo}/${uuid}`)

 