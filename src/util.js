import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 2000,
    },
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const sortData = (data) =>{
    const sortedData = [...data];

    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

// Draws circles on the map with a tooltip
export const showDataOnMap = (data, casesType='cases')=>(
    data.map(country =>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex} //so this accesses the function above, gets the cases type then gives the appropriate hex color
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier //so what this does is get the number of country cases multiplies them by the color codes and then gets the squareroot
            }     
        >
            <Popup>
                <div className="info-container">
                    <div
                      className="info-flag"
                      style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format('0.0')}</div>
                    <div className="info-recovered">Recovered: {numeral(country.cases).format('0.0')}</div>
                    <div className="info-deaths">Deaths: {numeral(country.cases).format('0.0')}</div>
                </div>
            </Popup>
        </Circle>
    ))
);