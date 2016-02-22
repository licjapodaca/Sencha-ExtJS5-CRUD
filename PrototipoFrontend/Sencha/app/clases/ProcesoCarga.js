Ext.define('PrototipoWeb.clases.ProcesoCarga', {

	singleton: true,

	requires: [
		"PrototipoWeb.clases.Diccionario",
		"Ext.data.Store" //,
		//"Ext.data.proxy.Rest",
		//"Ext.data.reader.Json",
		//"Ext.data.writer.Json"
	],

	alternateClassName: [
		"ProcesoCarga"
	],

	config: {
		strPersonas: null,
		strEstadosCiviles: null,
		strTiposIdentificacion: null,
		strSedes: null,
		tipoFuente: null
	},

	regenerarUrls: function (config) {
		try {

			var config = config || {};
			var me = this;

			if (Ext.isEmpty(config.controller)) return

			Diccionario.setUrlDiccionario(config.urlDiccionario);

			Diccionario.obtenerDiccionario({

				callback: function () {

					// Aqui estaba el store
					me.regeneraStores(config);

					ProcesoCarga.getStrEstadosCiviles().load({
						callback: function(records, operation, success) {
							ProcesoCarga.getStrTiposIdentificacion().load({
								callback: function(records, operation, success) {
									ProcesoCarga.getStrSedes().load({
										callback: function(records, operation, success) {
											if (Diccionario.isReady) {
												Diccionario.generaVistaDinamica(config.controller.lookupReference('pnlDinamico'));
											}
										}
									});
								}
							});
						}
					});

				}

			});

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	seleccionarFuenteDeDatos: function (config) {
		try {

			var config = config || {};

			Ext.Ajax.request({
				url: 'data/configuracion.json',
				method: 'GET',
				disableCaching: true,
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				callback: function (options, success, response) {
					try {

						var configuracion = Ext.decode(response.responseText, true);

						if(Ext.isEmpty(configuracion)) return;

						switch (config.tipo) {
							case 'OW': // Oracle con WebAPI

								ProcesoCarga.regenerarUrls({
									controller: config.controller,
									grid: config.grid,
									urlDiccionario: configuracion.oracleWebApi.urlDiccionario,
									apiPersonas: configuracion.oracleWebApi.urlCrudPersonas,
									urlEstadosCiviles: configuracion.oracleWebApi.urlEstadosCiviles,
									urlTiposIdentificacion: configuracion.oracleWebApi.urlTiposIdentificacion,
									urlSedes: configuracion.oracleWebApi.urlSedes
								});

								break;
							case 'ON': // Oracle con Node.js

								ProcesoCarga.regenerarUrls({
									controller: config.controller,
									grid: config.grid,
									urlDiccionario: configuracion.oracleNodejs.urlDiccionario,
									apiPersonas: configuracion.oracleNodejs.urlCrudPersonas,
									urlEstadosCiviles: configuracion.oracleNodejs.urlEstadosCiviles,
									urlTiposIdentificacion: configuracion.oracleNodejs.urlTiposIdentificacion,
									urlSedes: configuracion.oracleNodejs.urlSedes
								});

								break;
							case 'MW': // MongoDB con WebAPI

								ProcesoCarga.regenerarUrls({
									controller: config.controller,
									grid: config.grid,
									urlDiccionario: configuracion.mongoDbWebApi.urlDiccionario,
									apiPersonas: configuracion.mongoDbWebApi.urlCrudPersonas,
									urlEstadosCiviles: configuracion.mongoDbWebApi.urlEstadosCiviles,
									urlTiposIdentificacion: configuracion.mongoDbWebApi.urlTiposIdentificacion,
									urlSedes: configuracion.mongoDbWebApi.urlSedes
								});

								break;
							case 'MN': // MongoDB con Node.js

								ProcesoCarga.regenerarUrls({
									controller: config.controller,
									grid: config.grid,
									urlDiccionario: configuracion.mongoDbNodejs.urlDiccionario,
									apiPersonas: configuracion.mongoDbNodejs.urlCrudPersonas,
									urlEstadosCiviles: configuracion.mongoDbNodejs.urlEstadosCiviles,
									urlTiposIdentificacion: configuracion.mongoDbNodejs.urlTiposIdentificacion,
									urlSedes: configuracion.mongoDbNodejs.urlSedes
								});

								break;
							case 'L': // Cache de Datos con Web API

								ProcesoCarga.regenerarUrls({
									controller: config.controller,
									grid: config.grid,
									urlDiccionario: configuracion.cacheDatosWebApi.urlDiccionario,
									apiPersonas: configuracion.cacheDatosWebApi.urlCrudPersonas,
									urlEstadosCiviles: configuracion.cacheDatosWebApi.urlEstadosCiviles,
									urlTiposIdentificacion: configuracion.cacheDatosWebApi.urlTiposIdentificacion,
									urlSedes: configuracion.cacheDatosWebApi.urlSedes
								});

								break;
						}
					} catch (e) {
						Ext.Error.raise({msg: e.message, stack: e.stack});
					}
				}
			});

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	regeneraStores: function (config) {
		try {

			var me = this;
			var config = config || {};

			if(!Ext.ClassManager.isCreated('PrototipoWeb.model.Persona')) {
				Ext.define('PrototipoWeb.model.Persona', {
					extend: 'Ext.data.Model',
					alias: 'model.persona',

					idProperty: '_id',
					fields: Diccionario.getCamposModelo()
				});
			} else {
				Ext.override(PrototipoWeb.model.Persona, {
					idProperty: '_id',
					fields: Diccionario.getCamposModelo()
				});
			}

			me.setStrPersonas(Ext.create('Ext.data.Store', {
				autoSync: true,
				//fields: Diccionario.getCamposModelo(),
				model: 'PrototipoWeb.model.Persona',
				proxy: {
					type: 'rest',
					noCache: false,
					api: {
						create: config.apiPersonas,
						read: config.apiPersonas,
						update: config.apiPersonas,
						destroy: config.apiPersonas
					},
					//appendId: true,
					//idParam: 'nombre',
					headers: {
						Accept: 'application/json'
					},
					reader: {
						type: 'json'
					},
					writer: {
						type: 'json',
						writeAllFields: true
						//writeRecordId: false
					}
				}
			}));

			//me.getStrPersonas().setModel(Ext.create('Ext.data.Model', {
			//	idProperty: '_id',
			//	fields: Diccionario.getCamposModelo()
			//}));

			me.setStrEstadosCiviles(Ext.create('Ext.data.Store', {
				fields: [
					{ type: 'int', name: 'idEstadoCivil' },
					{ type: 'string', name: 'estadoCivilDescripcion' }
				],
				proxy: {
					type: 'rest',
					url: config.urlEstadosCiviles,
					headers: {
						Accept: 'application/json'
					},
					reader: {
						type: 'json'
					}
				}
			}));

			me.setStrTiposIdentificacion(Ext.create('Ext.data.Store', {
				fields: [
					{ type: 'int', name: 'idTipoIdentificacion' },
					{ type: 'string', name: 'tipoIdentificacionDescripcion' }
				],
				proxy: {
					type: 'rest',
					url: config.urlTiposIdentificacion,
					headers: {
						Accept: 'application/json'
					},
					reader: {
						type: 'json'
					}
				}
			}));

			me.setStrSedes(Ext.create('Ext.data.Store', {
				fields: [
					{ type: 'int', name: 'idSede' },
					{ type: 'string', name: 'sedeDescripcion' }
				],
				proxy: {
					type: 'rest',
					url: config.urlSedes,
					headers: {
						Accept: 'application/json'
					},
					reader: {
						type: 'json'
					}
				}
			}));

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	launch: function() {
		try {
			var me = this;

			Ext.setGlyphFontFamily('FontAwesome');

			Ext.getBody().mask("<div style='display: inline-block;margin-top: -20px;vertical-align: middle !important;'><i class=\"fa fa-cog fa-spin fa-3x\" style='vertical-align: middle; margin-right: 12px;'></i>Generando Diccionario...</div>", "mascara");

			if(!Ext.isEmpty(Ext.Object.fromQueryString(location.search).tipo)) {
				if(Ext.Array.contains(['MN','MW','ON','OW','L'], Ext.Object.fromQueryString(location.search).tipo)) {
					ProcesoCarga.setTipoFuente(Ext.Object.fromQueryString(location.search).tipo);
				} else {
					ProcesoCarga.setTipoFuente('L');
				}
			} else {
				ProcesoCarga.setTipoFuente('L');
			}

			Ext.Ajax.setTimeout(5000);

			Ext.Ajax.on('requestexception', function( connection, response, options, eOpts ) {
				me.muestraError(Ext.String.format('Excepcion generada al utilizar el recurso [{0}] con estatus http [{1}]', options.url, response.status));
				console.log( arguments );
				console.log( 'Failure captured for: ' + options.url );
			});

			Ext.Error.handle = function (err) {
				Ext.log({ msg: err.msg, level: 'error', dump: err });
				Ext.getBody().unmask();
				me.muestraError(err.msg);
				return true;
			};

			Ext.create('PrototipoWeb.view.personas.PanelPrincipal');

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	muestraError: function(msg) {
		try {
			Ext.Msg.show({
				title: '<i class="fa fa-user-times"></i> ERROR',
				message: 'Error: ' + msg + '<br /><br /><span style="color:red;"><b>Favor de ver a detalle el error en la consola...</b></span>',
				width: 500,
				buttons: Ext.Msg.OK,
				icon: Ext.window.MessageBox.ERROR
			});
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	}

});