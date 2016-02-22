using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Http;

namespace PrototipoServicios.Controllers
{
	/// <summary>
	/// Servicio para el diccionario de datos
	/// </summary>
    public class ConfiguracionController : ApiController
	{
		/// <summary>
		/// API para obtener el diccionario de datos dinamico
		/// </summary>
		/// <returns>
		/// Retorna en formato JSON el diccionario de datos del registro de una Persona
		/// 
		/// [
		///		{
		///			"_id": "56ba32f0a5891b50433956ad",
		///			"tipoApp": "S",
		///			"persona": [
		///				{
		///					"type": "string",
		///					"name": "_id",
		///					"config": {
		///						"grid": {
		///							"xtype": "gridcolumn",
		///							"order": 1,
		///							"width": 120,
		///							"align": "left",
		///							"dataIndex": "{0}",
		///							"text": "Id.",
		///							"hidden": true
		///						},
		///						"form": null
		///					}
		///				},
		///				...
		///			]
		///		}
		/// ]
		/// </returns>
		[Route("api/configuracion/getdiccionariodedatos")]
		public IHttpActionResult GetDiccionarioDeDatos()
		{
			object jsonObject;

			try
			{
				string allText = System.IO.File.ReadAllText(HostingEnvironment.MapPath("~/data/diccionario.json"));
				jsonObject = JsonConvert.DeserializeObject(allText);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}

			return Ok(jsonObject);
		}
    }
}
