using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PrototipoFrontend.Startup))]
namespace PrototipoFrontend
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
