using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Caching;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Configuration;

namespace PrototipoServicios.Helpers
{
	/// <summary>
	/// Clase utilizada para el manejo de CACHING en la capa de Servicios
	/// 
	/// Uso:
	/// (1) Se debe instanciar a nivel metodo del Controller
	/// 
	/// var memoryCacher = new MemoryCacher(DatosVehiculo)(
	///			_parametros: datosVehiculo,
	///			_propiedades: new string[] { "placas", "numeroSerie", "distribuidorId", "marcaId", "lineaId", "modelo", "motivoRegId", "situacionId" },
	///			_timeExpireInMinutes: Convert.ToInt16(DatosSensitivos.Claims.SingleOrDefault(p => p.Type == "TimeExpireCachingInMinutes").Value.ToString())
	///			);
	/// 
	/// (2) Posteriormente se verifica si existe en el CACHING ya una secuencia similar con los parametros que envia un usuario al servicio Web API
	/// 
	/// respuestaWeb = memoryCacher.GetValue(RespuestaJson(List(VehiculoDetalle)))(MethodBase.GetCurrentMethod().Name);
	/// 
	/// (3) Se valida si esta nula la respuesta del CACHING y se procede a obtener los registros del BLL-DAL para agregarlo al CACHING
	/// 
	/// if (respuestaWeb == null)
	///	{
	///		respuestaWeb = vehiculoBLL.ConsultaDatosVehiculo(datosVehiculo); //======= OJO: Si se maneja PAGING en Grids en el DAL se deben obtener los datos completos en RespuestaJson.DatosCompletos y en el Servicio Paginar dentro de RespuestaJson.Datos
	///		memoryCacher.Add(
	///			key: MethodBase.GetCurrentMethod().Name,
	///			value: respuestaWeb
	///			);
	///	}
	///	
	/// (4) Si se maneja PAGING en grids se procede a inicializar el total de registros y se utilizan las clases Datos y DatosCompletos de RespuestaJson
	///	
	/// respuestaWeb.totalCount = respuestaWeb.DatosCompletos.Count();
	///	respuestaWeb.Datos = respuestaWeb.DatosCompletos.Skip(datosVehiculo.start).Take(datosVehiculo.limit).ToList();
	/// 
	/// </summary>
	/// <typeparam name="T">Clase generica que representa los parametros que se reciben en un servicio Web API</typeparam>
	public class MemoryCacher<T>
	{
		/// <summary>
		/// Clase generica que funge como la lista de parametros que se reciben en los servicios Web API y que seran evaluados en el Key del CACHING generado
		/// </summary>
		public T Parametros;

		/// <summary>
		/// Arreglo de propiedades que seran evaluadas para el Key del CACHING y que pertenecen a la clase generica definida en esta Clase
		/// </summary>
		private string[] Propiedades;

		/// <summary>
		/// Tiempo de expiracion del CACHING expresado en Minutos
		/// </summary>
		private short TimeExpireInMinutesStatus;
		private short TimeExpireInMinutesCachingData;

		public ClaimsIdentity DatosSensitivos { get; set; }

		/// <summary>
		/// Constructor de la clase MemoryCacher encargado de inicializar los parametros que seran evaluados en el CACHING
		/// </summary>
		/// <param name="_parametros">Clase parametros del Servicio Web API</param>
		/// <param name="_propiedades">Arreglo de propiedades que seran evaluados y generados en el Key del CACHING</param>
		/// <param name="_timeExpireInMinutes">Tiempo de expiracion del CACHING expresado en Minutos</param>
		public MemoryCacher(T _parametros, string[] _propiedades = null, short _timeExpireInMinutes = 120)
		{
			try
			{
				Parametros = _parametros;
				Propiedades = _propiedades;
				TimeExpireInMinutesStatus = _timeExpireInMinutes;
			}
			catch (Exception)
			{
				throw;
			}
		}

		public MemoryCacher(T _parametros, string[] _propiedades, short _timeExpireInMinutesStatus, short _timeExpireInMinutesCachingData, ClaimsIdentity _datosSensitivos)
		{
			try
			{
				Parametros = _parametros;
				Propiedades = _propiedades;
				TimeExpireInMinutesStatus = _timeExpireInMinutesStatus;
				DatosSensitivos = _datosSensitivos;
				TimeExpireInMinutesCachingData = _timeExpireInMinutesCachingData;
			}
			catch (Exception)
			{
				throw;
			}
		}

		/// <summary>
		/// Constructor Dummy
		/// </summary>
		public MemoryCacher(short _timeExpireInMinutes = 120)
		{
			try
			{
				TimeExpireInMinutesStatus = _timeExpireInMinutes;
			}
			catch (Exception)
			{
				throw;
			}
		}

		/// <summary>
		/// Metodo encargado de obtener el valor actual de cierto CACHING en especifico
		/// </summary>
		/// <typeparam name="V">Tipo de dato que representa al valor obtenido del CACHING</typeparam>
		/// <param name="key">Nombre del Key asociado al CACHING que comprende el nombre del Metodo + [Parametros con Valores]</param>
		/// <param name="conParametros">Boleano para especificar si sera utilizado el QueryString de Parametros</param>
		/// <returns>Valor obtenido del CACHING de tipo de dato generico</returns>
		public V GetValue<V>(string key, bool conParametros = true)
		{
			try
			{
				var memoryCache = MemoryCache.Default;
				return conParametros ? (V)memoryCache.Get(String.Format("[{0}]{1}", key, GetQueryString().Trim())) : (V)memoryCache.Get(String.Format("[{0}]", key));
			}
			catch (Exception)
			{
				throw;
			}
		}

		public bool GetDataCachingStatusByUser(string key)
		{
			try
			{
				var memoryCache = MemoryCache.Default;
				string UserName = DatosSensitivos.Claims.SingleOrDefault(p => p.Type == "UsuarioBaseDeDatos").Value;

				var resp = memoryCache.Get(String.Format("[{0}][{1}]{2}[{3}]",
					UserName,
					key,
					GetQueryString().Trim(),
					"STATUS"));

				if (resp != null)
					return (bool)resp;
			}
			catch (Exception)
			{
				throw;
			}

			return false;
		}

		public V GetDataCachingValueByUser<V>(string key)
		{
			try
			{
				var memoryCache = MemoryCache.Default;
				string UserName = DatosSensitivos.Claims.SingleOrDefault(p => p.Type == "UsuarioBaseDeDatos").Value;
				return (V)memoryCache.Get(String.Format("[{0}][{1}]{2}", UserName, key, GetQueryString().Trim()));
			}
			catch (Exception)
			{
				throw;
			}
		}

		public bool AddDataCachingStatusByUser(string key, bool value)
		{
			try
			{
				if (RamChecker.EnoughFreeRamAvaliable(WebConfigurationManager.AppSettings["PorcentajeMinimoLibreParaNoGenerarCaching"].ToString()))
				{
					var memoryCache = MemoryCache.Default;
					string UserName = DatosSensitivos.Claims.SingleOrDefault(p => p.Type == "UsuarioBaseDeDatos").Value;
					return memoryCache.Add(
						String.Format("[{0}][{1}]{2}[{3}]",
							UserName,
							key,
							GetQueryString().Trim(),
							"STATUS"),
						value,
						DateTimeOffset.UtcNow.AddMinutes(TimeExpireInMinutesStatus));
				}
				else
				{
					return false;
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		public bool AddDataCachingValueByUser(string key, object value)
		{
			try
			{
				if (RamChecker.EnoughFreeRamAvaliable(WebConfigurationManager.AppSettings["PorcentajeMinimoLibreParaNoGenerarCaching"].ToString()))
				{
					var memoryCache = MemoryCache.Default;
					string UserName = DatosSensitivos.Claims.SingleOrDefault(p => p.Type == "UsuarioBaseDeDatos").Value;
					return memoryCache.Add(
						String.Format("[{0}][{1}]{2}", UserName, key, GetQueryString().Trim()),
						value,
						DateTimeOffset.UtcNow.AddMinutes(TimeExpireInMinutesCachingData));
				}
				else
				{
					return false;
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		/// <summary>
		/// Metodo encargado de agregar al CACHING cierto valor especifico
		/// </summary>
		/// <param name="key">Nombre del Key asociado al CACHING que comprende el nombre del Metodo + [Parametros con Valores]</param>
		/// <param name="value">Valor que se guardara en el CACHING</param>
		/// <param name="conParametros">Boleano para especificar si sera utilizado el QueryString de Parametros</param>
		/// <returns>Boleano especificando si fue agregado correctamente al CACHING el valor especifico</returns>
		public bool Add(string key, object value, bool conParametros = true)
		{
			try
			{
				if (RamChecker.EnoughFreeRamAvaliable(WebConfigurationManager.AppSettings["PorcentajeMinimoLibreParaNoGenerarCaching"].ToString()))
				{
					var memoryCache = MemoryCache.Default;
					return conParametros ? memoryCache.Add(String.Format("[{0}]{1}", key, GetQueryString().Trim()), value, DateTimeOffset.UtcNow.AddMinutes(TimeExpireInMinutesStatus)) : memoryCache.Add(String.Format("[{0}]", key), value, DateTimeOffset.UtcNow.AddMinutes(TimeExpireInMinutesStatus));
				}
				else
				{
					return false;
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		/// <summary>
		/// Borrando valores del CACHING a partir de un Key proporcionado
		/// </summary>
		/// <param name="key">Nombre del Key asociado al CACHING</param>
		public void Delete(string key)
		{
			try
			{
				var memoryCache = MemoryCache.Default;

				foreach (var keyItem in memoryCache.Where(p => p.Key.StartsWith(String.Format("[{0}]", key))).Select(p => p.Key))
				{
					memoryCache.Remove(keyItem);
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		public void DeleteByUser(string key)
		{
			try
			{
				var memoryCache = MemoryCache.Default;
				string UserName = DatosSensitivos.Claims.SingleOrDefault(p => p.Type == "UsuarioBaseDeDatos").Value;

				foreach (var keyItem in memoryCache.Where(p => p.Key.StartsWith(String.Format("[{0}][{1}]", UserName, key))).Select(p => p.Key))
				{
					memoryCache.Remove(keyItem);
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		/// <summary>
		/// Metodo utilizado para generar un Query String a partir de las propiedades de la clase Parametros generica de esta Clase
		/// </summary>
		/// <returns>Cadena representando las propiedades y valores que pertenecen a la Clase Parametros Generica</returns>
		public string GetQueryString()
		{
			Type type = Parametros.GetType();
			var queryString = new StringBuilder();

			try
			{
				foreach (PropertyInfo propertyInfo in type.GetProperties())
				{
					if (Propiedades == null || Propiedades.Contains(propertyInfo.Name))
					{
						queryString.AppendFormat("[{0}:{1}]", propertyInfo.Name, propertyInfo.GetValue(Parametros, null));
					}
				}
			}
			catch (Exception)
			{
				throw;
			}

			return queryString.ToString();
		}
	}

	public static class RamChecker
	{
		[DllImport("psapi.dll", SetLastError = true)]
		[return: MarshalAs(UnmanagedType.Bool)]
		private static extern bool GetPerformanceInfo([Out] out PerformanceInformation PerformanceInformation, [In] int Size);

		[StructLayout(LayoutKind.Sequential)]
		public struct PerformanceInformation
		{
			public int Size;
			public IntPtr CommitTotal;
			public IntPtr CommitLimit;
			public IntPtr CommitPeak;
			public IntPtr PhysicalTotal;
			public IntPtr PhysicalAvailable;
			public IntPtr SystemCache;
			public IntPtr KernelTotal;
			public IntPtr KernelPaged;
			public IntPtr KernelNonPaged;
			public IntPtr PageSize;
			public int HandlesCount;
			public int ProcessCount;
			public int ThreadCount;
		}


		public static Boolean EnoughFreeRamAvaliable(string percent)
		{
			if (GetPercentageFree() > Convert.ToDecimal(percent))
				return true;
			else
				return false;
		}

		private static decimal GetPercentageFree()
		{
			Int64 phav = GetPhysicalAvailableMemoryInMiB();
			Int64 tot = GetTotalMemoryInMiB();

			return ((decimal)phav / (decimal)tot) * 100;
		}

		private static Int64 GetPhysicalAvailableMemoryInMiB()
		{
			PerformanceInformation pi = new PerformanceInformation();
			if (GetPerformanceInfo(out pi, Marshal.SizeOf(pi)))
			{
				return Convert.ToInt64((pi.PhysicalAvailable.ToInt64() * pi.PageSize.ToInt64() / 1048576));
			}
			else
			{
				return -1;
			}

		}

		private static Int64 GetTotalMemoryInMiB()
		{
			PerformanceInformation pi = new PerformanceInformation();
			if (GetPerformanceInfo(out pi, Marshal.SizeOf(pi)))
			{
				return Convert.ToInt64((pi.PhysicalTotal.ToInt64() * pi.PageSize.ToInt64() / 1048576));
			}
			else
			{
				return -1;
			}

		}
	}
}