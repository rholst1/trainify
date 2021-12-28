import axios from "axios";
import { useEffect, useState } from "react";
import Select from 'react-select';
import './custom.css';


const Trafikverket = () => {
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [suggestions2, setSuggestions2] = useState([]);

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
    const onSuggestHandler2 = (text2) => {
        setText2(text2);
        setSuggestions2([]);
    }
    const onChangeHandler2 = (text2) => {

        let matches2 = []
        if (text2.length > 0) {
            matches2 = data.filter(data => {
                const regex2 = new RegExp(`${text2}`, "gi");
                return (data.AdvertisedLocationName.match(regex2))

            })
        }
        setSuggestions2(matches2)
        setText2(text2)
    }


    return (
        <>
            <p>Planera din resa</p>
            Från
            <input
                typ="text"
                onChange={e => onChangeHandler(e.target.value)}
                value={text}
            ></input>

            Till
            <input
                typ="text2"
                value={text2}
                onChange={e => onChangeHandler2(e.target.value)}
            ></input>
            
            <p>{suggestions && suggestions.map((suggestion, i) =>
                <div
                    key={i}
                    className="suggestion"
                    onClick={() => onSuggestHandler(suggestion.AdvertisedLocationName)}
                >
                    {suggestion.AdvertisedLocationName}
                </div>
            )}
            </p>
            <p>{suggestions2 && suggestions2.map((suggestion, i) =>
                <div
                    key={i}
                    className="suggestion"
                    onClick={() => onSuggestHandler2(suggestion.AdvertisedLocationName)}
                >
                    {suggestion.AdvertisedLocationName}
                </div>
            )}
            </p>
            <button>Hitta resa</button>
        </>

    )
}
export default Trafikverket