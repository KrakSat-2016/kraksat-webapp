import React from 'react';

import { RequestHelper } from 'app/requesthelper';
import {CardContainer, Card} from 'app/cards';

let requestHelper = new RequestHelper('/planetarydata/latest/', config.refreshRates.planetaryData);


const PlanetaryData = React.createClass({
    getInitialState() {
        return {
            timestamp: '', mass: '', radius: '', escape_velocity: '', average_density: '',
            earth_similarity_index: '', avg_atm_molar_mass: '', speed_of_sound: '',
            adiabatic_index: '', atmosphere_density: '', avg_molecule_mass: '',
            specific_gas_const: '', refractive_index: '', molar_refractivity: '',
            atm_speed_of_light: ''
        }
    },

    componentDidMount() {
        this.setState(requestHelper.data);
        requestHelper.start(function (result) {
            this.setState(result);
        }.bind(this));
    },

    componentWillUnmount() {
        requestHelper.stop();
    },

    render() {
        return (
            <div>
                <h1>Planetary Data</h1>
                <CardContainer>
                    <Card propertyName="Mass" value={this.state.mass} unit="kg"/>
                    <Card propertyName="Radius" value={this.state.radius / 1000} unit="km"/>
                    <Card propertyName="Escape velocity"
                                       value={this.state.escape_velocity / 1000} unit="km/s"/>
                    <Card propertyName="Average density"
                                       value={this.state.average_density} unit="kg/m³"/>
                    <Card propertyName="Earth Similarity Index"
                                       value={this.state.earth_similarity_index}/>
                    <Card propertyName="Average molar mass of the atmosphere"
                                       value={this.state.avg_atm_molar_mass / 1000} unit="g/mol"/>
                    <Card propertyName="Speed of sound"
                                       value={this.state.speed_of_sound} unit="m/s"/>
                    <Card propertyName="Adiabatic index" value={this.state.adiabatic_index}/>
                    <Card propertyName="Density of the atmosphere"
                                       value={this.state.atmosphere_density} unit="kg/m³"/>
                    <Card propertyName="Average mass of a single molecule"
                                       value={this.state.avg_molecule_mass} unit="kg"/>
                    <Card propertyName="Specific gas constant"
                                       value={this.state.specific_gas_const} unit="J/K×mol"/>
                    <Card propertyName="Refractive index" value={this.state.refractive_index}/>
                    <Card propertyName="Molar refractivity"
                                       value={this.state.molar_refractivity} unit="m³/mol"/>
                    <Card propertyName="Speed of light in the atmosphere"
                                       value={this.state.atm_speed_of_light} unit="m/s"/>
                </CardContainer>
            </div>
        );
    }
});

export default PlanetaryData;
