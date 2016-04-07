import React from 'react';
import Paper from 'material-ui/lib/paper';


const CardContainer = React.createClass({
    render() {
        return (
            <div className="planetaryDataContainer">
                {this.props.children}
            </div>
        );
    }
});


const Card = React.createClass({
    propTypes: {
        unit: React.PropTypes.string,
        noUnitSpace: React.PropTypes.bool,
        propertyName: React.PropTypes.string.isRequired,
        value: React.PropTypes.any
    },

    render() {
        const {
            unit, noUnitSpace, propertyName, value
        } = this.props;

        let valueDisplayed;
        if (value) {
            let valueString,
                valueExponential = Math.log(value) / Math.LN10;
            if (valueExponential >= 9 || valueExponential < -5) {
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
                valueString = value.toString().substring(0, 9).replace(/\.0+$/, '');
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

            let unitSpace = noUnitSpace ? '' : ' ';
            valueDisplayed = (<span>{valueString}{unitSpace}{unitDisplayed}</span>);
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

export {CardContainer, Card};
