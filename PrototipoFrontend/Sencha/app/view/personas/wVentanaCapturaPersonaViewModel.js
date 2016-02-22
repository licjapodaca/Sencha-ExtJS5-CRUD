/*
 * File: app/view/personas/wVentanaCapturaPersonaViewModel.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 5.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 5.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('PrototipoWeb.view.personas.wVentanaCapturaPersonaViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.personaswventanacapturapersona',

    requires: [
        'Ext.app.bind.Formula'
    ],

    data: {
        persona: {
            
        },
        agregaRegistro: true,
        storeRegistro: null,
        gridRegistro: null,
        recordPersona: null,
        camposCol1: null,
        camposCol2: null,
        radioGroupFormulas: null
    },

    formulas: {
        nombreCalculado: {
            get: function(data) {
                var nombreCompleto = Ext.String.format('{0} {1} {2}', Ext.isEmpty(data.nombre) ? "" : data.nombre, Ext.isEmpty(data.paterno) ? "" : data.paterno, Ext.isEmpty(data.materno) ? "" : data.materno);
                return nombreCompleto.trim();
            },
            bind: {
                nombre: '{persona.nombre}',
                paterno: '{persona.primerApellido}',
                materno: '{persona.segundoApellido}'
            }
        }
    }

});