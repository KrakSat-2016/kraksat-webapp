import $ from 'jquery';

import React from 'react';
import Paper from 'material-ui/lib/paper';

import { RequestHelper } from 'app/requesthelper';

let requestHelper = new RequestHelper('/planetarydata/latest/', 5000);


const PlanetaryDataContainer = React.createClass({
    render() {
        return (
            <div className="planetaryDataContainer">
                {this.props.children}
            </div>
        );
    }
});


const PlanetaryDataCard = React.createClass({
    propTypes: {
        unit: React.PropTypes.string,
        propertyName: React.PropTypes.string.isRequired,
        value: React.PropTypes.any.isRequired
    },

    render() {
        const {
            unit, propertyName, value
        } = this.props;

        let valueDisplayed;
        if (value) {
            let valueString;
            if (Math.log10(value) > 6 || Math.log10(value) < -5) {
                // Use exponential notation for long numbers
                valueString = value.toExponential(3).replace('e+', 'e');
                let ePos = valueString.indexOf('e');
                valueString = (
                    <span>
                        {valueString.substring(0, ePos)}
                        ×10
                        <sup>{valueString.substring(ePos + 1)}</sup>
                    </span>
                );
            } else {
                // Avoid long decimal fractions when not using exponential notation
                valueString = value.toFixed(4).replace(/\.?0+$/, '');
            }

            let unitDisplayed = unit ? unit : '';
            let slashPos = unitDisplayed.indexOf('/');
            if (slashPos != -1) {
                // Display units with / as fractions
                unitDisplayed = (
                    <span>
                        <sup>{unit.substring(0, slashPos)}</sup>
                        /
                        <sub>{unit.substring(slashPos + 1)}</sub>
                    </span>
                );
            }
            valueDisplayed = (<span>{valueString} {unitDisplayed}</span>);
        } else {
            valueDisplayed = (<span className="unknownValue">Unknown</span>);
        }

        return (
            <Paper zDepth={1} className="planetaryDataCard">
                <div className="value">{valueDisplayed}</div>
                <div className="property">{propertyName}</div>
            </Paper>
        );
    }
});


const PlanetaryData = React.createClass({
    getInitialState() {
        return {
            timestamp: '', mass: '', radius: '', escape_velocity: '', average_density: '',
            earth_similarity_index: '', avg_atm_molar_mass: '', adiabatic_index: '',
            atmosphere_density: '', avg_molecule_mass: '', specific_gas_const: '',
            refractive_index: '', molar_refractivity: '', atm_speed_of_light: ''
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
                <PlanetaryDataContainer>
                    <PlanetaryDataCard propertyName="Mass" value={this.state.mass} unit="kg"/>
                    <PlanetaryDataCard propertyName="Radius" value={this.state.radius} unit="km"/>
                    <PlanetaryDataCard propertyName="Escape velocity"
                                       value={this.state.escape_velocity} unit="km/s"/>
                    <PlanetaryDataCard propertyName="Average density"
                                       value={this.state.average_density} unit="g/cm³"/>
                    <PlanetaryDataCard propertyName="Earth Similarity Index"
                                       value={this.state.earth_similarity_index}/>
                    <PlanetaryDataCard propertyName="Average molar mass of the atmosphere"
                                       value={this.state.avg_atm_molar_mass} unit="g/mol"/>
                    <PlanetaryDataCard propertyName="Adiabatic index"
                                       value={this.state.adiabatic_index}/>
                    <PlanetaryDataCard propertyName="Density of the atmosphere"
                                       value={this.state.atmosphere_density} unit="kg/m³"/>
                    <PlanetaryDataCard propertyName="Average mass of a single molecule"
                                       value={this.state.avg_molecule_mass} unit="g"/>
                    <PlanetaryDataCard propertyName="Specific gas constant"
                                       value={this.state.specific_gas_const} unit="J/K×mol"/>
                    <PlanetaryDataCard propertyName="Refractive index"
                                       value={this.state.refractive_index}/>
                    <PlanetaryDataCard propertyName="Molar refractivity"
                                       value={this.state.molar_refractivity} unit="m³/mol"/>
                    <PlanetaryDataCard propertyName="Speed of light in the atmosphere"
                                       value={this.state.atm_speed_of_light} unit="km/s"/>
                </PlanetaryDataContainer>
            </div>
        );
    }
});

export default PlanetaryData;
