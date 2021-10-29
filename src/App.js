import React, { useEffect, useState } from 'react';
import './App.css';
import  {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@mui/material';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide'); //worldwide is the default but we will change it with setcountry
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796}); //this gives us the center of the map
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  
  
   
  //this ensures we get all the country info for worldwide
  useEffect(() =>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
    });
  }, []);

  //this useEffect gets us the countries in the dropdown
  useEffect(() => { //it will be async coz we send a request to server, wait for it and then do something with it
    const getCountriesData = async () =>{
      await fetch ('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())  //so this says that when we get a response just take out the json that has all the data
      .then((data) =>{ // destructuring the data that we want to output
        const countries = data.map((country) =>( //map function is looking through all the data and returning the object
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData(); //initialise everything
  }, []);



  const onCountryChange = async (event) =>{
    const countryCode = event.target.value; //this targets the specific country when its changed
    setCountry(countryCode);

    const url = 
      countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    
    //this gets country info for each country
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data); //all the data from the country

      countryCode === "worldwide" //this will ensure that when we select a country the map takes us there plus back to ww
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

      // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      // setMapZoom(4);

    })
  };



  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* Header and dropdown */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
            {/* Loop through all the countries and show a dropdown of the list of countries */}
              {
              countries.map((country) =>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
              }
            </Select>
          </FormControl>
        </div>

        {/*  Infoboxes */}
        <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={ (e) => setCasesType("cases")} 
            title="Coronavirus cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={ (e) => setCasesType("recovered")} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={ (e) => setCasesType("deaths")} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />
        </div>
        
        {/*  Map */}
        <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}       
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={ tableData} />
              <h3 className="app__graphTitle">Worldwide {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
