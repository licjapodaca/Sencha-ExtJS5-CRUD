using Newtonsoft.Json.Linq;
using PrototipoServicios.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;

namespace PrototipoServicios.Controllers
{
	/// <summary>
	/// Servicio API de Personas
	/// </summary>
	public class PersonaController : ApiController
	{
		// GET api/persona/
		/// <summary>
		/// Obteniendo todas las personas
		/// </summary>
		/// <returns></returns>
		public IHttpActionResult GetTodasLasPersonas()
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var personas = memoryCacher.GetValue<List<Persona>>("Personas", false);

				if(personas == null)
				{
					personas = (new Personas()).listaPersonas;
					memoryCacher.Add("Personas", personas, false);
				}

				return Ok(personas);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// POST api/persona/
		/// <summary>
		/// Servicio para agregar a una nueva persona
		/// </summary>
		/// <param name="persona"></param>
		/// <returns></returns>
		public IHttpActionResult PostAgregaPersona([FromBody] Persona persona)
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var personas = memoryCacher.GetValue<List<Persona>>("Personas", false);

				if (personas == null)
					personas = (new Personas()).listaPersonas;

				persona._id = Guid.NewGuid().ToString();

				personas.Add(persona);

				memoryCacher.Add("Personas", personas, false);

				return Ok(new { _id = persona._id });
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// DELETE api/persona/
		/// <summary>
		/// Servicio para borrar a una persona
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		public IHttpActionResult DeleteBorraPersona(string id)
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var personas = memoryCacher.GetValue<List<Persona>>("Personas", false);
				bool _success = false;

				if (personas == null)
					personas = (new Personas()).listaPersonas;

				var registro = personas.Where(p => p._id == id).FirstOrDefault();

				if (registro != null)
				{
					personas.Remove(registro);
					_success = true;
				}

				memoryCacher.Add("Personas", personas, false);

				return Ok(new { success = _success });
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// PUT api/persona/
		/// <summary>
		/// Servicio para actualizar los datos de una persona
		/// </summary>
		/// <param name="id"></param>
		/// <param name="persona"></param>
		/// <returns></returns>
		public IHttpActionResult PutActualizaPersona(string id,[FromBody] Persona persona)
		{
			try
			{
				var memoryCacher = new MemoryCacher<bool>();
				var personas = memoryCacher.GetValue<List<Persona>>("Personas", false);
				bool _success = false;
				
				if (personas == null)
					personas = (new Personas()).listaPersonas;
				
				var registro = personas.Where(p => p._id == id).FirstOrDefault();

				if (registro != null)
				{
					MergeObject.Merge<Persona>(registro, persona);					
					_success = true;
				}

				memoryCacher.Add("Personas", personas, false);

				return Ok(new { success = _success });
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}

	/// <summary>
	/// Clase colleccion de Personas
	/// </summary>
	public class Personas
	{
		public List<Persona> listaPersonas { get; set; }
		public Personas()
		{
			listaPersonas = new List<Persona>()
			{
				new Persona { _id = Guid.NewGuid().ToString(), nombre = "Jorge", primerApellido = "Apodaca", segundoApellido = "Mendoza", genero = "M", correo = "japodaca@bts.com.mx", idEstadoCivil = 1, idTipoIdentificacion = 2, numeroIdentificacion = "JGFDHGFDHGF564365463", usuario = "japodaca", contrasena = "12345", idSede = 1, habilitado = 1, fechaNacimiento = DateTime.Parse("1967-03-22"), observaciones = "Ningun comentario" },
				new Persona { _id = Guid.NewGuid().ToString(), nombre = "Manuel", primerApellido = "Lopez", segundoApellido = "Gonzalez", genero = "M", correo = "mlopez@bts.com.mx", idEstadoCivil = 1, idTipoIdentificacion = 1, numeroIdentificacion = "XXX4365463", usuario = "mlopez", contrasena = "12345", idSede = 3, habilitado = 1, fechaNacimiento = DateTime.Parse("1975-07-18"), observaciones = "Ningun comentario" }
			};
		}
	}

	/// <summary>
	/// Entidad de personas
	/// </summary>
	public class Persona
	{
		public string _id { get; set; }
		public string nombre { get; set; }
		public string primerApellido { get; set; }
		public string segundoApellido { get; set; }
		/// <summary>
		/// Valores aceptados (F) Femenino y (M) Masculino
		/// </summary>
		public string genero { get; set; }
		public string correo { get; set; }
		public int? idEstadoCivil { get; set; }
		public int? idTipoIdentificacion { get; set; }
		public string numeroIdentificacion { get; set; }
		public string usuario { get; set; }
		public string contrasena { get; set; }
		public int? idSede { get; set; }
		public int? habilitado { get; set; }
		public DateTime? fechaNacimiento { get; set; }
		public string observaciones { get; set; }

		public Persona()
		{

		}
	}
}
