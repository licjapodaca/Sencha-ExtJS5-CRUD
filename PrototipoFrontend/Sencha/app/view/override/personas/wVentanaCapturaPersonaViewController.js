Ext.define('PrototipoWeb.view.override.personas.wVentanaCapturaPersonaViewController', {
    override: 'PrototipoWeb.view.personas.wVentanaCapturaPersonaViewController',

	onTextfieldSpecialkey: function(field, e, eOpts) {
		try {
			var me = this;

			if (e.getKey() == e.ENTER) {
				me.nuevoRegistro();
			}
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	nuevoRegistro: function() {
		try {
			var me = this;

			if (me.lookupReference('frmModificacionDatos').getForm().isValid()) {

				if (me.getViewModel().get('agregaRegistro')) {

					me.getViewModel().get('gridRegistro').getSelectionModel().select( me.getViewModel().get('storeRegistro').add(me.getViewModel().get('persona')) );
					me.getViewModel().get('gridRegistro').getView().refresh();

					Ext.toast({
						html: Ext.String.format('Nueva persona agregada <span class="aviso">{0}</span>', me.getViewModel().get('nombreCalculado')),
						title: 'Nuevo registro',
						width: 400,
						align: 't'
					});

				} else {

					me.getViewModel().get('recordPersona').set(me.getViewModel().get('persona'));
					me.getViewModel().get('gridRegistro').getView().refresh();

					Ext.toast({
						html: Ext.String.format('La persona <span class="aviso">{0}</span> fue modificada correctamente', me.getViewModel().get('nombreCalculado')),
						title: 'Modificacion de registro',
						width: 400,
						align: 't'
					});

				}

				me.getView().close();

			} else {
				Ext.Msg.alert('AVISO', 'Existe inconsistencia de datos, favor de verificar...');
			}
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onBtnAceptarClick: function(button, e, eOpts) {
		try {
			var me = this;

			me.nuevoRegistro();
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onBtnCancelarClick: function(button, e, eOpts) {
		try {
			var me = this;

			me.getView().agregaRegistro = false;
			me.getView().close();
		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onWindowAfterRender: function(component, eOpts) {
		try {
			var me = this;


		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	},

	onWindowBeforeRender: function(component, eOpts) {
		try {
			var me = this;

			if(!Ext.isEmpty(me.getViewModel().get('radioGroupFormulas'))) {
				var formulas = {};
				Ext.Array.each(Diccionario.getRadioGroupFormulas(), function(formula) {
					Ext.Object.merge(formulas, formula);
				});
				me.getViewModel().setFormulas(formulas);
			}

			if(!Ext.isEmpty(me.getViewModel().get('camposCol1')))
				me.lookupReference('cntCol1').add(me.getViewModel().get('camposCol1'));

			if(!Ext.isEmpty(me.getViewModel().get('camposCol2')))
				me.lookupReference('cntCol2').add(me.getViewModel().get('camposCol2'));

			Ext.defer(function () {
				me.lookupReference('cntCol1').items.items[0].focus(true);
			}, 700);

		} catch (e) {
			Ext.Error.raise({msg: e.message, stack: e.stack});
		}
	}
    
});