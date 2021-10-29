import React from 'react';
import './InfoBox.css'
import { Card, CardContent, Typography } from '@mui/material';

function InfoBox({title, cases, active, isRed, total, ...props}) {
    return (
        <Card onClick = {props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                {/* No of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{ cases }</h2>

                {/* Total cases */}
                <Typography className="infoBox__cases" color="textSecondary">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
