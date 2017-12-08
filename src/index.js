'use strict';

const { DialogflowApp } = require('actions-on-google');
const express = require('express')()
const bodyParser = require('body-parser')

express.use(bodyParser.json())

const actionMap = new Map()

const Actions = {
    'REQUEST_LOCATION': 'request.location',
    'FULFILL_LOCATION': 'fulfill.location'
}

const requestLocation = (app) => {
    const preciseLocationPermission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION
    
    app.askForPermissions('To know your location',
        [preciseLocationPermission]);
}

const fulfullLocation = (app) => {
    if (app.isPermissionGranted()) {
        let deviceCoordinates = app.getDeviceLocation().coordinates;
        app.tell('Latitude: ' + deviceCoordinates.latitude + ' Longitude: ' + deviceCoordinates.longitude)
    } else {
        app.tell('I can won\'t be able to help you without your location.')
    }
}


/** Map Location Requests */
actionMap.set(Actions.REQUEST_LOCATION, requestLocation)
actionMap.set(Actions.FULFILL_LOCATION, fulfullLocation)

express.post('/', function (req, res) {
    const app = new DialogflowApp({request: req, response: res})

    app.handleRequest(actionMap)
})

express.listen(8084, '0.0.0.0')