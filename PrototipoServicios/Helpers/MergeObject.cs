using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrototipoServicios.Helpers
{
	public static class MergeObject
	{
		public static void Merge<T>(T target, T source)
		{
			Type t = typeof(T);

			var properties = t.GetProperties().Where(prop => prop.CanRead && prop.CanWrite);

			foreach (var prop in properties)
			{
				var value = prop.GetValue(source, null);
				if (value != null)
					prop.SetValue(target, value, null);
			}
		}
	}
}