import $ from 'jquery';
import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, Polyline} from 'react-google-maps';
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader';

const Map = React.createClass({
    getInitialState() {
        return {
            mapLoaded: false
        }
    },

    mapLoaded() {
        if (!this.state.mapLoaded) {
            this.setState({mapLoaded: true});
            let path = this.refs.polyline.getPath();
            this.refs.polyline.state.polyline.setOptions({
                icons: [{
                    icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
                    offset: '100%'
                }]
            });

            this.request = $.get(config.serverUrl + '/gps/', function (result) {
                // todo: auto refresh
                for (let point of result) {
                    path.push(new google.maps.LatLng(point.latitude, point.longitude));
                }
            });

            let gsMarker = this.refs.gsMarker;
            gsMarker.state.marker.setOptions({
                icon: {
                    url: 'assets/groundstation.svg',
                    size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16)
                }
            });
            this.request = $.get(config.serverUrl + '/gsinfo/latest/', function (result) {
                // todo: get gsinfo on app start
                gsMarker.state.marker.setPosition({lat: result.latitude, lng: result.longitude});
            });
        }
    },

    render() {
        return (
            <div>
                <ScriptjsLoader
                    hostname={'maps.googleapis.com'}
                    pathname={'/maps/api/js'}
                    query={{v: `3`, libraries: 'common,geometry', key: config.googleMapsAPIKey}}
                    loadingElement={
                        <div>Loading...</div>
                      }
                    containerElement={
                        // todo: fix ugly calc() hack
                        <div style={{height: 'calc(100% + 96px)', margin: '-48px'}}></div>
                    }
                    googleMapElement={
                        <GoogleMap
                            options={{
                                streetViewControl: false
                            }}
                            defaultZoom={15}
                            // todo: set gs position as default center
                            defaultCenter={{lat: 50.062029, lng: 19.936785}}
                            onIdle={this.mapLoaded}
                        >
                            <Polyline
                                ref='polyline'
                                options={{
                                    geodesic: true,
                                    strokeColor: '#ff0000',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2
                                }}
                            />
                            <Marker ref="gsMarker"/>
                        </GoogleMap>
                    }
                />
            </div>
        );
    }
});

export default Map;
