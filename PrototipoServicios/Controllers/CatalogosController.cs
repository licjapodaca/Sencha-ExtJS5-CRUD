using PrototipoServicios.Helpers;
using PrototipoServicios.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace PrototipoServicios.Controllers
{
	/// <summary>
	/// Servicio de Catalogos
	/// </summary>
	public class CatalogosController : ApiController
    {
		/// <summary>
		/// Catalogo de Estados Civiles
		/// </summary>
		/// <returns></returns>
		[Route("api/catalogos/getestadosciviles")]
		public IHttpActionResult GetEstadosCiviles()
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var registros = memoryCacher.GetValue<List<EstadoCivil>>("EstadosCiviles", false);

				if (registros == null)
				{
					registros = new List<EstadoCivil>()
					{
						new EstadoCivil() { idEstadoCivil = 1, estadoCivilDescripcion = "Casado(a)" },
						new EstadoCivil() { idEstadoCivil = 2, estadoCivilDescripcion = "Soltero(a)" },
						new EstadoCivil() { idEstadoCivil = 3, estadoCivilDescripcion = "Divorciado(a)" },
						new EstadoCivil() { idEstadoCivil = 4, estadoCivilDescripcion = "Viudo(a)" }
					};
					memoryCacher.Add("EstadosCiviles", registros, false);
				}

				return Ok(registros);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
		
		/// <summary>
		/// Catalogo de Tipos de Identificacion
		/// </summary>
		/// <returns></returns>
		[Route("api/catalogos/gettiposidentificacion")]
		public IHttpActionResult GetTiposIdentificacion()
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var registros = memoryCacher.GetValue<List<TipoIdentificacion>>("TiposIdentificacion", false);

				if (registros == null)
				{
					registros = new List<TipoIdentificacion>()
					{
						new TipoIdentificacion() { idTipoIdentificacion = 1, tipoIdentificacionDescripcion = "Credencial de Elector" },
						new TipoIdentificacion() { idTipoIdentificacion = 2, tipoIdentificacionDescripcion = "Licencia" },
						new TipoIdentificacion() { idTipoIdentificacion = 3, tipoIdentificacionDescripcion = "Pasaporte Mexicano" }
					};
					memoryCacher.Add("TiposIdentificacion", registros, false);
				}

				return Ok(registros);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		/// <summary>
		/// Catalogo de Sedes
		/// </summary>
		/// <returns></returns>
		[Route("api/catalogos/getsedes")]
		public IHttpActionResult GetSedes()
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var registros = memoryCacher.GetValue<List<Sede>>("Sedes", false);

				if (registros == null)
				{
					registros = new List<Sede>()
					{
						new Sede() { idSede = 1, sedeDescripcion = "Mexicali, Baja California" },
						new Sede() { idSede = 2, sedeDescripcion = "Guadalajara, Jalisco" },
						new Sede() { idSede = 3, sedeDescripcion = "Mexico, Distrito Federal" }
					};
					memoryCacher.Add("Sedes", registros, false);
				}

				return Ok(registros);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
