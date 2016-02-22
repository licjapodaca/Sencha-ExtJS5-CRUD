Ext.define('PrototipoWeb.clases.Diccionario', {
	singleton: true,

	requires: [
		//"PrototipoWeb.clases.ProcesoCarga"
	],

	alternateClassName: [
		"Diccionario"
	],

	config: {
		diccionario: null,
		camposModelo: null,
		camposGrid: null,
		camposFormCol1: null,
		camposFormCol2: null,
		urlDiccionario: null,
		radioGroupFormulas: null
	},

	isReady: false,

	obtenerDiccionario: function (config) {
		try {

			var config = config || {};
			var me = this;

			Ext.Ajax.request({
				url: me.getUrlDiccionario(),
				method: 'GET',
				disableCaching: false,
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				callback: function (options, success, response) {

					try {

						if (!success || Ext.isEmpty(Ext.decode(response.responseText, true))) {
							me.isReady = false;
							Ext.getBody().unmask();
							return;
						}

						me.setDiccionario(Ext.decode(response.responseText, true)[0]);

						var modelo = [], grid = [], formCol1 = [], formCol2 = [], formulas = [];

						Ext.each(me.getDiccionario().persona, function (obj) {

							/* Obteniendo campos para el Modelo */
							if (!Ext.isObject(obj.type)) {
								Ext.Array.push(modelo, {
									type: obj.type,
									name: obj.name,
									dateFormat: Ext.isEmpty(obj.dateFormat) ? undefined : obj.dateFormat,
									dateWriteFormat: Ext.isEmpty(obj.dateWriteFormat) ? undefined : obj.dateWriteFormat
								});
							} else {
								Ext.Array.push(modelo, {
									type: obj.type.datatype,
									name: obj.name,
									calculate: Ext.isEmpty(Ext.decode(obj.config.calculate, true)) ? undefined : Ext.decode(obj.config.calculate, true)
								});
							}

							/* Obteniendo campos para el Grid */
							if (!Ext.isEmpty(obj.config.grid)) {
								Ext.apply(obj.config.grid, {
									dataIndex: Ext.String.format(obj.config.grid.dataIndex, obj.name),
									renderer: Ext.isEmpty(Ext.decode(obj.config.grid.renderer, true)) ? undefined : Ext.decode(obj.config.grid.renderer, true)
								});

								Ext.Array.push(grid, obj.config.grid);
							}

							/* Obteniendo campos para el FormPanel */
							if (!Ext.isEmpty(obj.config.form)) {

								//TODO: Se agrego funcionalidad nueva solo para que el Checkbox fuera numerico en vez de boolean

								// Formulas de Radiogroups
								if (obj.config.form.xtype == "radiogroup" || obj.config.form.xtype == "checkboxfield") {
									if(!Ext.isEmpty(obj.config.form.formula)) {

										if(obj.config.form.xtype == "radiogroup") {
											Ext.apply(obj.config.form.formula, {
												generoFormula: Ext.isEmpty(obj.config.form.formula.generoFormula) ? undefined : Ext.decode(obj.config.form.formula.generoFormula)
											});
										}

										if(obj.config.form.xtype == "checkboxfield") {
											Ext.apply(obj.config.form.formula, {
												habilitadoFormula: Ext.isEmpty(obj.config.form.formula.habilitadoFormula) ? undefined : Ext.decode(obj.config.form.formula.habilitadoFormula)
											});
										}

										Ext.Array.push(formulas, obj.config.form.formula);
									}
								}

								if(obj.config.form.xtype == "checkboxfield") {
									if(!Ext.isEmpty(obj.config.form.formula)) {

									}
								}

								Ext.apply(obj.config.form, {
									name: obj.config.form.xtype == "radiogroup" ? undefined : Ext.String.format(obj.config.form.name, obj.name),
									defaults: obj.config.form.xtype == "radiogroup" ? { name: Ext.String.format(obj.config.form.defaults.name, obj.name) } : undefined,
									store: Ext.isEmpty(obj.config.form.store) ? undefined : Ext.decode(obj.config.form.store),
									bind: Ext.apply(obj.config.form.bind, {
										value: obj.config.form.xtype == "radiogroup" ? obj.config.form.bind.value : Ext.String.format(obj.config.form.bind.value, "persona", obj.name)
									}),
									formula: undefined
								});

								if (obj.config.form.column == 1) {
									Ext.Array.push(formCol1, obj.config.form);
								} else {
									Ext.Array.push(formCol2, obj.config.form);
								}
							}

						});

						/* Ordenamiento de campos ****************/
						Ext.Array.sort(grid, function (a, b) {   //*
							return a.order - b.order;           //*
						});                                     //*
						//*
						Ext.Array.sort(formCol1, function (a, b) {   //*
							return a.order - b.order;           //*
						});

						Ext.Array.sort(formCol2, function (a, b) {   //*
							return a.order - b.order;           //*
						});
						/******************************************/

						me.setCamposModelo(modelo);
						me.setCamposGrid(grid);
						me.setCamposFormCol1(formCol1);
						me.setCamposFormCol2(formCol2);
						me.setRadioGroupFormulas(formulas);

						me.isReady = true;

						if (!Ext.isEmpty(config.callback))
							config.callback();

					} catch (e) {
						Ext.getBody().unmask();
						Ext.Error.raise({msg: e.message, stack: e.stack});
					}
				}
			});

		} catch (e) {
			Ext.getBody().unmask();
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	generaVistaDinamica: function (panel) {
		try {
			var me = this;

			//Ext.getBody().mask("<div style='display: inline-block;margin-top: -20px;vertical-align: middle !important;'><i class=\"fa fa-cog fa-spin fa-3x\" style='vertical-align: middle; margin-right: 12px;'></i>Generando Diccionario...</div>", "mascara");

			me.obtenerDiccionario({
				callback: function () {

					if (!Ext.isEmpty(panel)) {

						panel.removeAll(true);

						var grid = Ext.create('Ext.grid.Panel', {
							reference: 'grdPersonas',
							itemId: 'grdPersonas',
							defaults: {
								style: 'background-color: transparent !important;'
							},
							enableLocking: true,
							store: ProcesoCarga.getStrPersonas(),
							viewConfig: {
								cls: [
									'miGrid x-form-trigger-wrap-default',
									'miGrid x-form-text-default'
								]
							},
							columns: Diccionario.getCamposGrid(),
							dockedItems: [
								{
									xtype: 'toolbar',
									dock: 'top',
									layout: {
										type: 'hbox',
										pack: 'end'
									},
									items: [
										{
											xtype: 'button',
											itemId: 'btnNuevo',
											glyph: 'xf234@FontAwesome',
											text: 'Nuevo registro',
											listeners: {
												click: 'onBtnNuevoClick'
											}
										},
										{
											xtype: 'button',
											itemId: 'btnBorrar',
											glyph: 'xf235@FontAwesome',
											text: 'Borrar registro',
											listeners: {
												click: 'onBtnBorrarClick'
											}
										}
									]
								}
							],
							listeners: {
								itemdblclick: 'onGrdPersonasItemDblClick'
							}
						});

						//grid.reconfigure(ProcesoCarga.getStrPersonas(), Diccionario.getCamposGrid());

						panel.add(grid);
						grid.getStore().load({
							callback: function (records, operation, success) {
								if (!Ext.isEmpty(records)) {
									if (records.length > 0) {
										//if (!Ext.isEmpty(config.grid)) {
											//config.grid.getSelectionModel().deselectAll();
											grid.getSelectionModel().select(records[0]);
										//}
									}
								}
							}
						});
					}

					Ext.getBody().unmask();

				}
			});

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	}

});