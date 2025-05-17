
import type React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/AppLogo';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 shadow-sm">
        <div className="container mx-auto px-6 flex justify-start">
          <Link href="/" passHref>
            <AppLogo iconSize={28} />
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Términos de Servicio de MovaZen</h1>
        
        <section className="space-y-6 text-muted-foreground">
          <p>Última actualización: [Fecha de Última Actualización]</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Acuerdo de los Términos</h2>
          <p>Estos Términos de Servicio constituyen un acuerdo legalmente vinculante hecho entre tú, ya sea personalmente o en nombre de una entidad ("tú") y MovaZen ("nosotros", "nos", o "nuestro"), concerniente a tu acceso y uso de la aplicación MovaZen así como cualquier otra forma de medio, canal de medios, sitio web móvil o aplicación móvil relacionada, vinculada o conectada de otra manera a estos (colectivamente, los "Servicios").</p>
          <p>Aceptas que al acceder a los Servicios, has leído, entendido y aceptas estar obligado por todos estos Términos de Servicio. SI NO ESTÁS DE ACUERDO CON TODOS ESTOS TÉRMINOS DE SERVICIO, ENTONCES ESTÁS EXPRESAMENTE PROHIBIDO DE USAR LOS SERVICIOS Y DEBES DESCONTINUAR EL USO INMEDIATAMENTE.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Derechos de Propiedad Intelectual</h2>
          <p>A menos que se indique lo contrario, los Servicios son nuestra propiedad propietaria y todo el código fuente, bases de datos, funcionalidad, software, diseños de sitios web, audio, video, texto, fotografías y gráficos en los Servicios (colectivamente, el "Contenido") y las marcas comerciales, marcas de servicio y logotipos contenidos en ellos (las "Marcas") son propiedad nuestra o están controlados por nosotros o licenciados a nosotros, y están protegidos por las leyes de derechos de autor y marcas registradas y varias otras leyes de propiedad intelectual y de competencia desleal de jurisdicciones internacionales y convenciones internacionales.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">3. Representaciones del Usuario</h2>
          <p>Al usar los Servicios, representas y garantizas que: (1) toda la información de registro que envíes será verdadera, precisa, actual y completa; (2) mantendrás la exactitud de dicha información y la actualizarás rápidamente según sea necesario; (3) tienes la capacidad legal y aceptas cumplir con estos Términos de Servicio; (4) no eres menor de 13 años; (5) no accederás a los Servicios a través de medios automatizados o no humanos, ya sea a través de un bot, script o de otra manera; (6) no utilizarás los Servicios para ningún propósito ilegal o no autorizado; y (7) tu uso de los Servicios no violará ninguna ley o regulación aplicable.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Registro de Usuario</h2>
          <p>Es posible que se te requiera registrarte en los Servicios. Aceptas mantener tu contraseña confidencial y serás responsable de todo uso de tu cuenta y contraseña. Nos reservamos el derecho de eliminar, reclamar o cambiar un nombre de usuario que selecciones si determinamos, a nuestra sola discreción, que dicho nombre de usuario es inapropiado, obsceno o de otra manera objetable.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Actividades Prohibidas</h2>
          <p>No puedes acceder o usar los Servicios para ningún propósito que no sea aquel para el cual ponemos los Servicios a disposición. Los Servicios no pueden ser utilizados en conexión con ningún esfuerzo comercial excepto aquellos que están específicamente respaldados o aprobados por nosotros.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Contribuciones Generadas por el Usuario</h2>
          <p>Los Servicios pueden invitarte a chatear, contribuir o participar en blogs, tableros de mensajes, foros en línea y otra funcionalidad, y pueden proporcionarte la oportunidad de crear, enviar, publicar, mostrar, transmitir, realizar, publicar, distribuir o difundir contenido y materiales a nosotros o en los Servicios, incluyendo pero no limitado a texto, escritos, video, audio, fotografías, gráficos, comentarios, sugerencias o información personal u otro material (colectivamente, "Contribuciones"). Las Contribuciones pueden ser visibles por otros usuarios de los Servicios y a través de sitios web de terceros. Como tal, cualquier Contribución que transmitas puede ser tratada como no confidencial y no propietaria.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">7. Descargo de Responsabilidad del Asistente de IA</h2>
          <p>Las funciones de inteligencia artificial (IA) dentro de MovaZen, como el generador de afirmaciones y el asistente de IA, se proporcionan solo con fines informativos y de apoyo. No están destinadas a constituir, y no constituyen, asesoramiento profesional (médico, psicológico, legal, financiero, etc.). Siempre busca el consejo de un profesional calificado con cualquier pregunta que puedas tener con respecto a una condición médica o cualquier otra preocupación profesional. Nunca ignores el consejo profesional ni demores en buscarlo debido a algo que hayas leído o recibido de las funciones de IA de MovaZen.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">8. Modificaciones e Interrupciones</h2>
          <p>Nos reservamos el derecho de cambiar, modificar o eliminar el contenido de los Servicios en cualquier momento o por cualquier motivo a nuestra sola discreción sin previo aviso. Sin embargo, no tenemos la obligación de actualizar ninguna información en nuestros Servicios. También nos reservamos el derecho de modificar o descontinuar todo o parte de los Servicios sin previo aviso en cualquier momento.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">9. Ley Aplicable</h2>
          <p>Estos Términos de Servicio y tu uso de los Servicios se rigen e interpretan de acuerdo con las leyes de [Tu Jurisdicción/País], sin tener en cuenta sus principios de conflicto de leyes.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">10. Información de Contacto</h2>
          <p>Para resolver una queja con respecto a los Servicios o para recibir más información sobre el uso de los Servicios, por favor contáctanos en: [Tu Email de Contacto o Enlace a Formulario de Contacto]</p>
        </section>
      </main>
      <footer className="py-8 border-t border-border mt-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm">&copy; {new Date().getFullYear()} MovaZen. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
