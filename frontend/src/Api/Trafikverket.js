import axios from "axios";
import { useEffect, useState } from "react";
import SelectSearch, {fuzzySearch} from 'react-select-search';
import Select from 'react-select';






const Trafikverket = () => {
    const [data, setData] = useState([]);
    const xmlBodyStr = `<REQUEST>
                            <LOGIN authenticationkey="937a3590518241f88071375537a4cf47" />
                            <QUERY objecttype="TrainStation" schemaversion="1">
                                <FILTER>
                                    <EQ name="Advertised" value="true" />
                                </FILTER>
                                <INCLUDE>AdvertisedLocationName</INCLUDE>
                                <INCLUDE>LocationSignature</INCLUDE>
                            </QUERY>
                        </REQUEST>`


    const config = {
        headers: { 'Content-Type': 'text/xml' }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post('https://api.trafikinfo.trafikverket.se/v2/data.json', xmlBodyStr, config);
            console.log(response.data.RESPONSE.RESULT[0].TrainStation)

            setData(response.data.RESPONSE.RESULT[0].TrainStation);
        };
        fetchData()
    }, []);

    const showStations = data?.map((post) => {
        return (
            <>
                 <p>  {post.LocationSignature} , {post.AdvertisedLocationName}</p>
            </>
                 
         
        )
    })



    return (
        <>
        {/* <Select options={options} /> */}
            {/* <SelectSearch
                options={options}
                search
                filterOptions={fuzzySearch}
                value='hejsan'
                placeholder="Select your country"
            /> */}
            <div>{showStations}</div>
        </>
    )
}
export default Trafikverket