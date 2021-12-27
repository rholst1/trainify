import axios from "axios";
import { useEffect, useState } from "react";
import Select from 'react-select';
import './custom.css';


const Trafikverket = () => {
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");
    const [suggestions, setSuggestions] = useState([]);

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

    const onSuggestHandler = (text, text2) => {
        setText(text, text2);
        setSuggestions([]);
    }
    const onChangeHandler = (text, text2) => {

        let matches = []
        if (text.length > 0 ) {
            matches = data.filter(data => {
                const regex = new RegExp(`${text}`, "gi");
                const regex2 = new RegExp(`${text2}`, "gi");
                return (data.AdvertisedLocationName.match(regex, regex2))

            })
        }
        setSuggestions(matches)
        setText(text)
        setText2(text2)
    }

    const showStations = suggestions?.map((post, i) => {
        return (
            <>

                <p key={i}>  {post.LocationSignature} , {post.AdvertisedLocationName}</p>

            </>


        )
    })



    return (
        <>
            <p>Planera din resa</p>
            Från <input 
                typ="text"
                onChange={e => onChangeHandler(e.target.value)}
                value={text}
            ></input>
            Till
            <input
                typ="text2"
                onChange={e => onChangeHandler(e.target.value)}
                value={text2} />
            <p>{suggestions && suggestions.map((suggestion, i) => <div key={i} className="suggestion"
                onClick={() => onSuggestHandler(suggestion.AdvertisedLocationName)}
            >{suggestion.AdvertisedLocationName}</div>
            )}</p>
            <button>Hitta resa</button>

        </>
        
    )
}
export default Trafikverket