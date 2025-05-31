'use client'
import React from 'react';
import styled from "styled-components";
import {blackColor, grayColor} from "@/styles/colors";

type StatisticItem={
    count: number,
    text: string
}

type AdminStatisticProps = {
    statistic: {
        total: StatisticItem;
        mainLabel: StatisticItem;
        subLabel: StatisticItem;
    };
};

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 70%;
    margin: 30px auto 40px;
    hr{
        width: 1px; 
        height: 120px;
        background-color: ${grayColor};
    }
`
const StatsWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h3{
        font-size: 64px;
        font-weight: 600;
        color: ${blackColor};
    }
    p{
        font-size: 15px;
        color: ${grayColor};
    }
`

const AdminStatistic = ({statistic}:AdminStatisticProps) => {
    return (
        <StatsContainer>
            <StatsWrapper>
                <h3>{statistic.total.count}</h3>
                <p>{statistic.total.text}</p>
            </StatsWrapper>
            <hr/>
            <StatsWrapper>
                <h3>{statistic.mainLabel.count}</h3>
                <p>{statistic.mainLabel.text}</p>
            </StatsWrapper>
            <hr/>
            <StatsWrapper>
                <h3>{statistic.subLabel.count}</h3>
                <p>{statistic.subLabel.text}</p>
            </StatsWrapper>
        </StatsContainer>
    );
};

export default AdminStatistic;