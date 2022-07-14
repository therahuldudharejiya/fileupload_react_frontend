import Axios from 'axios';

export default Axios.create({
    baseURL:"http://localhost/React_Laravel/backend/api/",
    headers:{
        "Content-Type":'multipart/form-data'
    }
})