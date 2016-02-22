Ext.define('PrototipoWeb.view.override.personas.PanelPrincipalViewController', {
	override: 'PrototipoWeb.view.personas.PanelPrincipalViewController',

	onButtonClick: function(button, e, eOpts) {
		try {

			if(Ext.isEmpty(location.href)) return;

			switch(button.itemId) {
				case "btnCacheDatos":
					window.open(Ext.String.format("../?{0}", "tipo=L"), "_self");
					//window.open(Ext.String.format("http://{0}{1}?{2}", location.host, location.pathname, "tipo=L"), "_self");
					break;
				case "btnMongoNodejs":
					window.open(Ext.String.format("../?{0}", "tipo=MN"), "_self");
					//window.open(Ext.String.format("http://{0}{1}?{2}", location.host, location.pathname, "tipo=MN"), "_self");
					break;
				case "btnMongoWebAPI":
					window.open(Ext.String.format("../?{0}", "tipo=MW"), "_self");
					//window.open(Ext.String.format("http://{0}{1}?{2}", location.host, location.pathname, "tipo=MW"), "_self");
					break;
				case "btnOracleNodejs":
					window.open(Ext.String.format("../?{0}", "tipo=ON"), "_self");
					//window.open(Ext.String.format("http://{0}{1}?{2}", location.host, location.pathname, "tipo=ON"), "_self");
					break;
				case "btnOracleWebAPI":
					window.open(Ext.String.format("../?{0}", "tipo=OW"), "_self");
					//window.open(Ext.String.format("http://{0}{1}?{2}", location.host, location.pathname, "tipo=OW"), "_self");
					break;
			}

			//if(button.itemId != "btnCacheDatos" && button.itemId != "btnMongoNodejs" && button.itemId != "btnMongoWebAPI" && button.itemId != "btnOracleNodejs" && button.itemId != "btnOracleWebAPI") return;
			//
			//ProcesoCarga.seleccionarFuenteDeDatos({
			//	controller: this,
			//	grid: this.lookupReference('grdPersonas'),
			//	tipo: button.itemId == "btnCacheDatos" ? 'L' : button.itemId == "btnMongoNodejs" ? 'MN' : button.itemId == "btnMongoWebAPI" ? 'MW' : button.itemId == "btnOracleNodejs" ? 'ON' : button.itemId == "btnOracleWebAPI" ? 'OW' : null,
			//	panel: this.lookupReference('pnlDinamico')
			//});
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onBtnCacheDatosDefinicionClick: function (button, e, eOpts) {
		try {
			window.open("http://servicios.prototipo.net:8889/PrototipoServicios/Help");
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onBtnNuevoClick: function (button, e, eOpts) {
		try {
			var me = this;

			var grid = button.up('gridpanel');

			var ventanaPersona = Ext.create('widget.personaswventanacapturapersona', {
				bind: {
					title: "<div class='aviso' style='display:inline-block;'>{nombreCalculado}</div>"
				} //,
				//animateTarget: button.getEl()
			});

			ventanaPersona.getViewModel().setData({
				agregaRegistro: true,
				storeRegistro: grid.getStore(),
				gridRegistro: grid,
				camposCol1: Diccionario.getCamposFormCol1(),
				camposCol2: Diccionario.getCamposFormCol2(),
				radioGroupFormulas: Diccionario.getRadioGroupFormulas()
			});

			ventanaPersona.show();

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onBtnBorrarClick: function (button, e, eOpts) {
		try {
			var me = this;
			var grid = button.up('gridpanel');

			if (grid.getSelectionModel().getCount() > 0) {

				var record = grid.getSelectionModel().getSelection();

				Ext.Msg.show({
					title: '<i class="fa fa-user-times"></i> AVISO',
					message: Ext.String.format('Esta seguro de borrar a <span class="aviso">{0}</span> ?', record[0].get('nombreCompleto')),
					width: 500,
					buttons: Ext.Msg.YESNO,
					fn: function (btn) {
						if (btn == "yes") {

							Ext.toast({
								html: Ext.String.format('La persona <span class="aviso">{0}</span> fue borrada...', record[0].get('nombreCompleto')),
								title: 'AVISO',
								width: 400,
								align: 't'
							});

							grid.getStore().remove(record);
							grid.getView().refresh();

						}
					},
					icon: Ext.window.MessageBox.INFO //,
					//animateTarget: button.getEl()
				});


			} else {
				Ext.Msg.show({
					title: '<i class="fa fa-user-times"></i> AVISO',
					message: 'No existe ningun registro seleccionado, favor de indicar a la persona a remover...',
					width: 500,
					buttons: Ext.Msg.OK,
					icon: Ext.window.MessageBox.INFO //,
					//animateTarget: button.getEl()
				});
			}
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onGrdPersonasItemDblClick: function (dataview, record, item, index, e, eOpts) {
		try {
			var me = this;

			var grid = dataview.ownerGrid;

			var ventanaPersona = Ext.create('widget.personaswventanacapturapersona', {
				bind: {
					title: "<div class='aviso' style='display:inline-block;'>{nombreCalculado}</div>"
				} //,
				//animateTarget: item
			});

			ventanaPersona.getViewModel().setData({
				agregaRegistro: false,
				storeRegistro: grid.getStore(),
				gridRegistro: grid,
				persona: record.getData(),
				recordPersona: record,
				camposCol1: Diccionario.getCamposFormCol1(),
				camposCol2: Diccionario.getCamposFormCol2(),
				radioGroupFormulas: Diccionario.getRadioGroupFormulas()
			});

			ventanaPersona.show();

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onTabpanelTabChange: function (tabPanel, newCard, oldCard, eOpts) {
		//try {
		//	var me = this;
		//
		//	if (newCard.itemId == "tab2" && Diccionario.isReady) {
		//		Diccionario.generaVistaDinamica(me.lookupReference('pnlDinamico'));
		//	}
		//} catch (e) {
		//	Ext.Error.raise({msg: e.message, stack: e.stack});
		//}
	},

	onViewportBeforeRender: function (component, eOpts) {
		try {
			ProcesoCarga.seleccionarFuenteDeDatos({
				controller: this,
				grid: Ext.isEmpty(this.lookupReference('grdPersonas')) ? null : this.lookupReference('grdPersonas'),
				tipo: ProcesoCarga.getTipoFuente(),
				panel: this.lookupReference('pnlDinamico')
			});
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	}

});