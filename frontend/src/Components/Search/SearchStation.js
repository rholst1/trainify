import axios from "axios";
import { useEffect, useState } from "react";
import Select from 'react-select';
import './SearchStation.css';


const SearchStation = (props) => {
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
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

    const onSuggestHandler = (text) => {
        setText(text);
        setSuggestions([]);
    }
    const onChangeHandler = (text) => {

        let matches = []
        if (text.length > 0) {
            matches = data.filter(data => {
                const regex = new RegExp(`${text}`, "gi");
                return (data.AdvertisedLocationName.match(regex))

            })
        }
        setSuggestions(matches)
        setText(text)

    }


    return (
        <>
            <div className="SearchContainer">
                <input
                    typ="text"
                    placeholder={props.input}
                    onChange={e => onChangeHandler(e.target.value)}
                    value={text}
                ></input>

                <div>{suggestions && suggestions.map((suggestion, i) =>
                    <div
                        key={i}
                        className="suggestion"
                        onClick={() => onSuggestHandler(suggestion.AdvertisedLocationName)}
                    >
                        {suggestion.AdvertisedLocationName}
                    </div>
                )}
                </div>
            </div>
        </>

    )
}
export default SearchStation